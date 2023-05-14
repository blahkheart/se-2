import { withNextCors } from "../middleware/cors";
import dbConnect from "@lib/dbConnect";
import abis from "@unlock-protocol/contracts";
import axios from "axios";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import Integration from "~~/lib/models/integration";
// import Subscriber from "~~/lib/models/subscriber";
import Tier from "~~/lib/models/tier";
import { decryptData } from "~~/utils/scaffold-eth";

const secret2 = process.env.SECRET;
console.log("SECRET_ENV:", secret2);

// type SubscriberData = {
//   id: string;
//   tier: string;
//   address: string;
//   email: string;
//   isActive: boolean;
//   startDate: Date;
//   endDate: Date;
// };

// interface TierData {
//   id?: string;
//   network: number | 80001;
//   integrationId: string;
// }

export default withNextCors(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    // Connect to the database
    await dbConnect();
    // get data from request
    const { subscriberAddress, email, lockAddress } = req.body;
    // get the tier for this lockAddress
    const { id, network, integrationId } = await Tier.findOne({ lockAddress });
    console.log("TIER_DATA:", id, network, integrationId);

    // get the integration for this tier
    const { apiKeyInternal, secret, siteUrl } = await Integration.findOne({ _id: integrationId });
    const decryptKey = `${secret}:${secret2}`;
    console.log("DECRYPT_KEY:", decryptKey);
    const decryptedApiKey = decryptData(apiKeyInternal, decryptKey);
    console.log("DECRYPT_API_KEY:", decryptedApiKey);

    if (!decryptedApiKey) {
      return res.status(400).json({ message: "Error decrypting API key" });
    }

    // check if address has a valid key to the lockAddress
    // const unlockProvider = `https://rpc.unlock-protocol.com/${network}`;
    const unlockProvider = `https://rpc.unlock-protocol.com/80001`;
    const provider = new ethers.providers.JsonRpcProvider(unlockProvider);
    console.log("PROVIDER:", provider);

    const publicLockContract = new ethers.Contract(lockAddress, abis.PublicLockV12.abi, provider);
    console.log("publicLockContract:", publicLockContract);

    const hasValidKey = publicLockContract.getHasValidKey(subscriberAddress);
    if (!hasValidKey) {
      return res.status(401).json({ message: `User has no valid key for tier with address: ${lockAddress}` });
    }
    console.log("HAS_VALID_KEY:", hasValidKey);

    // get key expiration timestamp from lock
    const tokenId = publicLockContract.tokenOfOwnerByIndex(subscriberAddress, 0);
    const keyExpiryTimestamp = parseInt(publicLockContract.keyExpirationTimestampFor(tokenId));
    console.log("EXPIRY_TIMESTSMP:", keyExpiryTimestamp);

    // generate token
    const [_id, tokenSecret] = decryptedApiKey.split(":");
    if (!_id || !tokenSecret) {
      return res.status(400).json({ message: "Invalid API key" });
    }
    console.log("TOKEN_ID_SECRET:", _id, tokenSecret);

    const token = jwt.sign({}, Buffer.from(tokenSecret, "hex"), {
      keyid: _id,
      algorithm: "HS256",
      expiresIn: "5m",
      audience: `/admin/`,
    });
    // call ghost admin and find user with email address
    let ghostApiUrl = `${siteUrl}/ghost/api/admin/members/`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Ghost ${token}`,
      "Accept-Version": "v5.24",
    };
    const result = await fetch(ghostApiUrl, { headers });
    const members = await result.json();
    const member = members.find((user: any) => user.email === email);
    const memberId = member.id;
    // add user to the specific ghost tier with appropriate start and end dates
    ghostApiUrl = `${siteUrl}/ghost/api/admin/members/${memberId}`;

    const payload = {
      members: [
        {
          tiers: [
            {
              id,
              expiry_at: keyExpiryTimestamp,
            },
          ],
        },
      ],
    };

    const response = await axios.post(ghostApiUrl, payload, { headers });
    console.log("RESPONSE:", response);

    // use returned data to get subscriber or create new
    if (response && response.status === 201) {
      // Save new tier to database
      const subscriberId = response.data.members[0].id;
      console.log("RESPONSE_DATA:", response.data);
      console.log("RESPONSE_DATA_MEMBER:", response.data.members[0]);
      console.log("RESPONSE_DATA_MEMBER_ID:", response.data.members[0].id);
      console.log("RESPONSE_DATA_MEMBER_TIER:", response.data.members[0].tiers[0]);

      // const subscriberData: SubscriberData = {
      //   id: subscriberId,
      //   tier: id,
      //   address: subscriberAddress,
      //   email,
      //   isActive: true,
      //   startDate: Date.now;
      //   endDate: expiry_at;
      // };
      // const newSubscriber = new Subscriber(subscriberData);
      // await newSubscriber.save();
      // return res.status(201).json({ message: "Tier created successfully.", data: newTier });
      console.log("subscriberID::", subscriberId);
      return res.status(201).json({ message: "Member subscribed successfully." });
    } else {
      return res.status(400).send({
        title: "Bad request",
        msg: "error creating tier",
      });
    }
    // const response = await axios.post(ghostApiUrl, payload, { headers });
    // if (response && response.status === 201) {
    //   // Save new tier to database
    //   const tierId = response.data.tiers[0].id;
    //   const tierData: TierData = {
    //     id: tierId
    //   };
    //   const newTier = new Tier(tierData);
    //   await newTier.save();
    //   return res.status(201).json({ message: "Tier created successfully.", data: newTier });
    // } else {
    //   return res.status(400).send({
    //     title: "Bad request",
    //     msg: "error creating tier",
    //   });
    // }

    // Add the new tier to the user's list of tiers
    // createdBy.tiers.push(newTier._id);
    // await createdBy.save();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});
