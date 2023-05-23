import { withNextCors } from "../middleware/cors";
import dbConnect from "@lib/dbConnect";
import axios from "axios";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { abi as publicLockABI } from "~~/abi/publicLock";
import Integration from "~~/lib/models/integration";
import Subscriber from "~~/lib/models/subscriber";
import Tier from "~~/lib/models/tier";
import { decryptData } from "~~/utils/scaffold-eth";

const envSecret = process.env.SECRET;

type SubscriberData = {
  id: string;
  tier: string;
  address: string;
  email: string;
  isActive: boolean;
  startDate: number;
  endDate: number;
};

export default withNextCors(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    // Connect to the database
    await dbConnect();
    // get data from request
    const { subscriberAddress, email, lockAddress } = req.body;
    const dbQuery = { $or: [{ monthlyLockAddress: lockAddress }, { yearlyLockAddress: lockAddress }] };
    // get the tier for this lockAddress
    const { id, name, network, integrationId } = await Tier.findOne(dbQuery);
    // get the integration for this tier
    const { apiKeyInternal, secret, siteUrl } = await Integration.findOne({ _id: integrationId });
    const tierId = id;
    // decrypt api key
    const decryptKey = `${secret}:${envSecret}`;
    const decryptedApiKey = decryptData(apiKeyInternal, decryptKey);
    if (!decryptedApiKey) {
      return res.status(400).json({ message: "Error decrypting API key" });
    }

    const unlockProvider = `https://rpc.unlock-protocol.com/${network}`;
    const provider = new ethers.providers.JsonRpcProvider(unlockProvider);
    const publicLockContract = new ethers.Contract(lockAddress, publicLockABI, provider);
    // check if address has a valid key to the lockAddress
    const hasValidKey = await publicLockContract.getHasValidKey(subscriberAddress);
    if (!hasValidKey) {
      return res.status(401).json({ message: `User has no valid key for tier with address: ${lockAddress}` });
    }
    // get key expiration timestamp from lock
    const tokenId = await publicLockContract.tokenOfOwnerByIndex(subscriberAddress, 0);
    const keyExpiryTimestamp = await publicLockContract.keyExpirationTimestampFor(tokenId);
    const keyExpiryTimestampInSeconds = keyExpiryTimestamp * 1000; // convert to seconds
 
    // generate ghost admin api token
    const [apiKeyId, apiKeySecret] = decryptedApiKey.split(":");
    if (!apiKeyId || !apiKeySecret) {
      return res.status(400).json({ message: "Invalid API key" });
    }
    const token = jwt.sign({}, Buffer.from(apiKeySecret, "hex"), {
      keyid: apiKeyId,
      algorithm: "HS256",
      expiresIn: "5m",
      audience: `/admin/`,
    });
    // ghost api endpoint url
    let ghostApiUrl = `${siteUrl}/ghost/api/admin/members/`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Ghost ${token}`,
      "Accept-Version": "v5.24",
    };
    // get all members from ghost admin 
    const result = await fetch(ghostApiUrl, { headers });
    const { members } = await result.json();
    if (!members) return res.status(400).json({ message: "Error fetching from Ghost admin" });
    // find user with 'email' address
    const member = members.find((user: any) => user.email === email);
    const memberId = member.id;
    // add user to the specific ghost tier
    ghostApiUrl = `${siteUrl}/ghost/api/admin/members/${memberId}`;
    const payload = {
      members: [
        {
          tiers: [
            {
              name,
              id: tierId,
              expiry_at: keyExpiryTimestampInSeconds,
            },
          ],
        },
      ],
    };

    const response = await axios.put(ghostApiUrl, payload, { headers });

    // use returned data to get subscriber or create new
    if (response && response.status === 200) {
      // Save new tier to database
      const subscriberId = response.data.members[0].id;
      const subscriberData: SubscriberData = {
        id: subscriberId,
        tier: tierId,
        address: subscriberAddress,
        email,
        isActive: true,
        startDate: Date.now(),
        endDate: keyExpiryTimestampInSeconds,
      };
      const subscriber = await Subscriber.findOne({ id: subscriberId });

      if (!subscriber) {
        const newSubscriber = new Subscriber(subscriberData);
        await newSubscriber.save();
        console.log("subscriberID::", subscriberId);
      } else {
        const response = await Subscriber.findOneAndUpdate({ _id: id }, subscriberData);
        console.log("Old Member subscribed::", response);
      }
      return res.status(201).json({ message: "Member subscribed successfully.", data: subscriberData });
    } else {
      return res.status(400).send({
        title: "Bad request",
        msg: "error creating tier",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});