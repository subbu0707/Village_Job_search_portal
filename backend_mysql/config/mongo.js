const mongoose = require("mongoose");

let isConnected = false;

const connectMongo = async () => {
  if (isConnected) {
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "Village_Job_Search_Portal";

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set in environment variables");
  }

  await mongoose.connect(mongoUri, {
    dbName,
    serverSelectionTimeoutMS: 10000,
  });

  isConnected = true;
  console.log(`✅ MongoDB connected: ${dbName}`);

  return mongoose.connection;
};

module.exports = {
  mongoose,
  connectMongo,
};
