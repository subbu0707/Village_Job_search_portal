require("dotenv").config();
const axios = require("axios");

async function debugChat() {
  console.log("\n🔍 CHAT DEBUG - Step by Step\n");

  try {
    // Test 1: Check message endpoint exists
    console.log("1. Testing message endpoint (should get 401)...");
    try {
      await axios.post("http://localhost:4000/api/messages", { test: "data" });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ Message endpoint exists and requires auth");
      } else {
        console.log("❌ Unexpected response:", error.response?.status);
      }
    }

    // Test 2: Check if we can get existing users
    console.log("\n2. Checking existing users for testing...");

    // Test 3: Try login with common credentials
    console.log("\n3. Trying to login with existing user...");
    const commonPasswords = ["password", "password123", "123456"];
    const emails = ["sample@gmail.com", "test1762185565294@example.com"];

    let validToken = null;
    let validUserId = null;

    for (const email of emails) {
      for (const password of commonPasswords) {
        try {
          const loginRes = await axios.post(
            "http://localhost:4000/api/auth/login",
            {
              email: email,
              password: password,
              termsAccepted: true,
            }
          );

          if (loginRes.data.success) {
            validToken = loginRes.data.data.token;
            validUserId = loginRes.data.data.user.id;
            console.log(`✅ Login successful with ${email}`);
            break;
          }
        } catch (err) {
          // Continue trying
        }
      }
      if (validToken) break;
    }

    if (!validToken) {
      console.log("❌ Could not login with any existing users");
      console.log("\n💡 SOLUTION: In the browser:");
      console.log("   1. Go to http://localhost:5173");
      console.log("   2. Register a new account");
      console.log("   3. Then try using chat");
      return;
    }

    // Test 4: Try sending message with valid token
    console.log("\n4. Testing message send with valid token...");
    try {
      const msgRes = await axios.post(
        "http://localhost:4000/api/messages",
        {
          receiverId: validUserId === 1 ? 2 : 1,
          message: "Test message from debug script",
          jobId: 1,
        },
        {
          headers: { Authorization: `Bearer ${validToken}` },
        }
      );

      if (msgRes.data.success) {
        console.log("✅ Message sent successfully!");
        console.log("   The backend chat API is working perfectly");
      }
    } catch (error) {
      console.log("❌ Message send failed:", error.response?.data?.message);
    }

    // Test 5: Try getting conversation
    console.log("\n5. Testing conversation retrieval...");
    try {
      const convRes = await axios.get(
        `http://localhost:4000/api/messages/${validUserId === 1 ? 2 : 1}`,
        {
          headers: { Authorization: `Bearer ${validToken}` },
        }
      );

      if (convRes.data.success) {
        console.log("✅ Conversation retrieved successfully!");
        console.log("   Messages:", convRes.data.data.length);
      }
    } catch (error) {
      console.log("❌ Conversation failed:", error.response?.data?.message);
    }

    console.log("\n🎯 DIAGNOSIS COMPLETE");
    console.log("\nIf backend tests pass but frontend fails:");
    console.log("  → Frontend user is not logged in");
    console.log('  → Check browser localStorage for "token"');
    console.log("  → Check browser console for actual errors");
  } catch (error) {
    console.log("❌ Debug error:", error.message);
  }
}

debugChat();
