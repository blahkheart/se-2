import dbConnect from "./dbConnect";
import User, { UserDocument } from "./models/user";
import mongoose from "mongoose";

let db: mongoose.Connection | undefined;

async function init() {
  if (db) return;
  try {
    await dbConnect();
    db = mongoose.connection;
  } catch (e) {
    console.error("Failed to establish connection to database");
  }
}

(async () => {
  await init();
})();

export async function getUsers() {
  try {
    if (!db) await init();
    const _data = await User.find({}).limit(20);
    const result = _data.map((user: UserDocument) => ({ ...user.toObject(), id: user._id.toString() }));
    return { users: result };
  } catch (error) {
    return { error: "Failed to fetch users" };
  }
}
