require("dotenv").config();
const axios = require("axios");

async function simpleMessageTest() {
  try {
    console.log("\n🔍 Simple Message Test...\n");

    // Test just the endpoint structure first
    console.log("Testing message endpoint without auth (should get 401)...");
    try {
      await axios.post("http://localhost:4000/api/messages", {
        receiverId: 1,
        message: "test",
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ Endpoint exists and requires auth (401 Unauthorized)");
      } else {
        console.log(
          "❌ Unexpected response:",
          error.response?.status,
          error.response?.data,
        );
      }
    }

    // Test with invalid token
    console.log("\nTesting with invalid token (should get 401)...");
    try {
      await axios.post(
        "http://localhost:4000/api/messages",
        {
          receiverId: 1,
          message: "test",
        },
        {
          headers: {
            Authorization: "Bearer invalid-token",
          },
        },
      );
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ Invalid token correctly rejected (401)");
      } else {
        console.log(
          "❌ Unexpected response:",
          error.response?.status,
          error.response?.data,
        );
      }
    }

    console.log("\n📝 Summary:");
    console.log("- Message endpoint exists at /api/messages");
    console.log("- Requires authentication (Bearer token)");
    console.log('- The frontend "Failed to send message" is likely due to:');
    console.log("  1. Missing or invalid JWT token in localStorage");
    console.log("  2. Token expired");
    console.log("  3. User not logged in properly");
    console.log("\n🔧 To fix frontend issue:");
    console.log("1. Ensure user is logged in");
    console.log('2. Check browser localStorage for "token"');
    console.log("3. Check browser console for actual error details");
  } catch (error) {
    console.log("❌ Test Error:", error.message);
  }
}

simpleMessageTest();
