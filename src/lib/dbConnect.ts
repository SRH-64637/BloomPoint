import mongoose from "mongoose";
import { DB_name } from "@/constants";

const MongoDB_URI = process.env.MongoDB_URI || "";

if (!MongoDB_URI) {
  throw new Error("Please define MONGODB_URI in your .env file");
}

// Validate connection string format
if (
  !MongoDB_URI.startsWith("mongodb://") &&
  !MongoDB_URI.startsWith("mongodb+srv://")
) {
  throw new Error(
    "Invalid MongoDB connection string. Must start with 'mongodb://' or 'mongodb+srv://'"
  );
}

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(MongoDB_URI, {});
    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to database", DB_name);
  } catch (error) {
    console.error("Error connecting to database", error);
    process.exit(1);
  }
}

export default dbConnect;
