"use strict";

const mongoose = require("mongoose");

const connectToMongoDB = async () => {
  const db_connect = process.env.MONGO_URI;

  if (!db_connect) {
    console.error("❌ MONGO_URI is not defined in environment variables.");
    return;
  }

  try {
    await mongoose.connect(db_connect, {
      serverSelectionTimeoutMS: 50000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });

    console.log("✅ MongoDB connected successfully!");

    mongoose.connection.on("error", (error) => {
      console.error("❌ MongoDB Error:", new Date().toISOString(), error);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
      connectToMongoDB();
    });

    mongoose.connection.on("connected", () => {
      console.log("🎉 MongoDB connection is live!");
    });

  } catch (error) {
    console.error("❌ Initial MongoDB connection failed at:", new Date().toISOString());
    console.error(error.message || error);
  }
};

module.exports = { connectToMongoDB };
