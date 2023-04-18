import dbConnect from "@lib/dbConnect";
import Tier from "@lib/models/tier";
// import axios from "axios";
// import jwt from "jsonwebtoken";
// import User from "@lib/models/user";
import { NextApiRequest, NextApiResponse } from "next";

// const {api_key} = process.env.ADMIN_API_KEY;
// const { ADMIN_API_KEY, GHOST_BLOG_URL } = process.env;
// if (!ADMIN_API_KEY || !GHOST_BLOG_URL)
//   throw new Error(`Add ${!ADMIN_API_KEY && "Ghost Admin API key " && !GHOST_BLOG_URL && "Blog URL "}to .env`);

// const [id, secret] = ADMIN_API_KEY.split(":");
// const token = jwt.sign({}, Buffer.from(secret, "hex"), {
//   keyid: id,
//   algorithm: "HS256",
//   expiresIn: "5m",
//   audience: `/admin/`,
// });

// const ghostApiUrl = `${GHOST_BLOG_URL}/ghost/api/admin/tiers/`;
// const headers = {
//   Origin: "http://localhost:3000",
//   "Content-Type": "application/json",
//   Authorization: `Ghost ${token}`,
//   "Accept-Version": "v5.24",
// };

type TierData = {
  id: string;
  name: string;
  lockAddress: string;
  description?: string;
  type?: "free" | "paid";
  visibility?: "public" | "private";
  monthlyPrice?: number;
  yearlyPrice?: number;
  welcomePageUrl?: string;
  currency?: string;
  createdBy: string;
  integrationId: string;
};
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      // Connect to the database
      await dbConnect();
      // get data from request
      const tierData: TierData = {
        id: req.body.id,
        name: req.body.name,
        lockAddress: req.body.lockAddress,
        description: req.body.description,
        type: req.body.type,
        visibility: req.body.visibility,
        yearlyPrice: req.body.yearlyPrice,
        monthlyPrice: req.body.monthlyPrice,
        welcomePageUrl: req.body.welcomePageUrl,
        currency: req.body.currency,
        createdBy: req.body.createdBy,
        integrationId: req.body.integrationId,
      };
      // Create the new tier
      const newTier = new Tier(tierData);

      // Save the new tier to the database
      await newTier.save();

      // Add the new tier to the user's list of tiers
      // createdBy.tiers.push(newTier._id);
      // await createdBy.save();

      res.status(201).json({ message: "Tier created successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
