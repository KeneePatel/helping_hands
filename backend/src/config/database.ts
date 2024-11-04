import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const DB_NAME = "HelpingHands";
const DB_URI = `${process.env.MONGODB_URI}`

let db: Db;

export const connectDB = async () => {
  try {
    const client = await MongoClient.connect(DB_URI);
    db = client.db(DB_NAME);
    console.log('MongoDB connected');
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

export const getDB = (): Db => {
  if (!db) {
    connectDB();
    throw new Error('Database not connected');
  }
  return db;
};

