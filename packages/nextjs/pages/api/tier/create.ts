import dbConnect from "@lib/dbConnect";
import Tier from "@lib/models/tier";
import axios from "axios";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import Integration from "~~/lib/models/integration";
import authOptions from "~~/pages/api/auth/auth-options";
import { decryptData } from "~~/utils/scaffold-eth";


type TierData = {
  id: string;
  name: string;
  lockAddress: string;
  description?: string;
  type?: "free" | "paid";
  visibility?: "public" | "private";
  monthlyPrice?: number;
  yearlyPrice?: number | undefined;
  welcomePageUrl?: string | undefined;
  currency?: string;
  createdBy: string;
  integrationId: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    // Connect to the database
    await dbConnect();
    // get data from request
    const {
      name,
      lockAddress,
      description,
      type,
      visibility,
      yearlyPrice,
      monthlyPrice,
      welcomePageUrl,
      currency,
      createdBy,
      integrationId,
      message,
      signature,
    } = req.body;
    const session: any = await getServerSession(req, res, authOptions);

    // verify user
    const integration = await Integration.findOne({ _id: integrationId });
    const integrationCreator = integration.createdBy.toString();
    const ghostBlogBaseUrl = integration.siteUrl;
    const encryptedApiKey = integration.apiKey;
    const userAddress = session?.user.name;
    const decodedAddress = ethers.utils.verifyMessage(message, signature);
    if (userAddress !== decodedAddress || createdBy !== integrationCreator) {
      return res.status(401).json({ message: "User Authorization Failed" });
    }

    // decryt API key
    const decryptedApiKey = decryptData(encryptedApiKey, signature);
    if (!decryptedApiKey) {
      return res.status(400).json({ message: "Error decrypting API key" });
    }

    // generate token
    const [id, secret] = decryptedApiKey.split(":");
    if (!id || !secret) {
      return res.status(400).json({ message: "Invalid API key" });
    }
    const token = jwt.sign({}, Buffer.from(secret, "hex"), {
      keyid: id,
      algorithm: "HS256",
      expiresIn: "5m",
      audience: `/admin/`,
    });

    // Create new tier on Ghos
    const ghostApiUrl = `${ghostBlogBaseUrl}/ghost/api/admin/tiers/`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Ghost ${token}`,
      "Accept-Version": "v5.24",
    };
    const payload = {
      tiers: [
        {
          name,
          description,
          visibility,
          monthly_price: monthlyPrice,
          yearly_price: yearlyPrice,
          currency,
          welcome_page_url: welcomePageUrl,
        },
      ],
    };

    const response = await axios.post(ghostApiUrl, payload, { headers });
    if (response && response.status === 201) {
      // Save new tier to database
      const tierId = response.data.tiers[0].id;
      const tierData: TierData = {
        id: tierId,
        name,
        lockAddress,
        description,
        type,
        visibility,
        yearlyPrice,
        monthlyPrice,
        welcomePageUrl,
        currency,
        createdBy,
        integrationId,
      };
      const newTier = new Tier(tierData);
      await newTier.save();
      return res.status(201).json({ message: "Tier created successfully.", data: newTier });
    } else {
      return res.status(400).send({
        title: "Bad request",
        msg: "error creating tier",
      });
    }

    // Add the new tier to the user's list of tiers
    // createdBy.tiers.push(newTier._id);
    // await createdBy.save();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
}