import dbConnect from "@lib/dbConnect";
import Integration from "@lib/models/integration";
// import User from "@lib/models/user";
import { NextApiRequest, NextApiResponse } from "next";

// Todos
// use session to process api requests
type IntegrationUpdateData = {
  name: string | undefined;
  apiKey: string | undefined;
  siteUrl: string | undefined;
  description: string | undefined;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }
  try {
    // Connect to the database
    await dbConnect();
    // get Id and data from request
    const { id, name, apiKey, siteUrl, description } = req.body;
    const update: IntegrationUpdateData = {
      name: name || undefined,
      apiKey: apiKey || undefined,
      siteUrl: siteUrl || undefined,
      description: description || undefined,
    };
    // find and update integration
    const response = await Integration.findOneAndUpdate({ _id: id }, update);

    res.status(200).json({ message: "Integration updated successfully.", data: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
}
