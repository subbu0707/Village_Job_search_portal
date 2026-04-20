// Backend server entry point
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { connectMongo } = require("./config/mongo");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const locationRoutes = require("./routes/locationRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const userRoutes = require("./routes/userRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const jobQuestionRoutes = require("./routes/jobQuestionRoutes");
const ratingRoutes = require("./routes/ratings");

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "✅ Server is running" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/job-questions", jobQuestionRoutes);
app.use("/api/ratings", ratingRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectMongo();

    app.listen(PORT, () => {
      console.log(`\n🚀 Backend Server Running on http://localhost:${PORT}`);
      console.log(`📍 API Base: http://localhost:${PORT}/api`);
      console.log(`✅ Database: MongoDB Connected`);
      console.log(`🔐 JWT: Enabled\n`);
    });
  } catch (error) {
    console.error("❌ Failed to start backend:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
