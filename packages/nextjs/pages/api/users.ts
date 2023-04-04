import { NextApiRequest, NextApiResponse } from "next";
import { getUsers } from "~~/lib/users";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const _data = await getUsers();
      res.status(200).json({ _data });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }
}
