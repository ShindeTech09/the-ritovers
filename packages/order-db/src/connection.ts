import { error } from "console";
import mongoose from "mongoose";

let isConnected = false;

export const connectOrderDb = async () => {
  if (isConnected) return;
  if (!process.env.MONGO_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  try {
    await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
    throw error;
  }
};
