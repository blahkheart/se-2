import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "~~/lib/dbConnect";
import User from "~~/lib/models/user";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      await dbConnect();
      const user = await User.findOne({ email: "alexbaxteronline@gmail.com" });
      res.status(200).json({ user });
      //   const users = await User.find({});
      //   res.status(200).json({ users });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }
};

export default handler;
