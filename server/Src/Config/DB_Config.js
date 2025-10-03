import mongoose from "mongoose";
import { secretKeys } from "./SecretKeys.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(secretKeys.MONGODB_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
        process.exit(1);
    }
    };