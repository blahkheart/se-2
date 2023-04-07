// import mongoose from "mongoose";
import User, { UserDocument } from "@lib/models/user";
import type { NextApiRequest, NextApiResponse } from "next";

interface UserData {
  address: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<UserDocument | string>) {
  if (req.method === "POST") {
    try {
      const { address }: UserData = req.body;
      // Check if user exists in database
      let user = await User.findOne({ address });
      // If user doesn't exist, create a new user in the database
      if (!user) {
        user = await User.create({ address });
        await user.save();
        res.status(201).json(user);
      } else {
        // Return the user document as JSON response
        res.status(200).json(user);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
