import mongoose from "mongoose";

const MDB_URI: any = process.env.MONGODB_URI;

if (!MDB_URI) throw new Error("Add mongodb uri to .env");

async function dbConnect() {
  try {
    const conn = await mongoose.connect(MDB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.log(err);
  }
}

export default dbConnect;

/**
  import {MongoClient} from 'mongodb'
  const URI = process.env,MDB_URI
  const options ={
    if(!MDB_URI)throw new Error('Add mongo db uri to .env)
    let cllient = new MongoClient(URI,options)
    let clientPromise
    if(process.env.NODE_ENV !== 'production'){
      if(!global._mongoClientPromise){
      global._mongoClientPromise = client.connect()
      }
      clientPromise = global._mongoclientPromise
    }else {
      clientPromise = client.connect()
    }
  }
  export default clientPromise
 */
