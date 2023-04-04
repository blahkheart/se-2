import dbConnect from "@lib/dbConnect";
import Integration from "@lib/models/integration";
import User from "@lib/models/user";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      // Connect to the database
      await dbConnect();

      // Get the user who is creating the integration
      const createdBy = await User.findById(req.body.createdBy);

      // Create the new integration
      const newIntegration = new Integration({
        name: req.body.name,
        description: req.body.description,
        apiKey: req.body.apiKey,
        triggers: req.body.triggers,
        actions: req.body.actions,
        createdBy: createdBy._id,
      });

      // Save the new integration to the database
      await newIntegration.save();

      // Add the new integration to the user's list of integrations
      createdBy.integrations.push(newIntegration._id);
      await createdBy.save();

      res.status(201).json({ message: "Integration created successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
