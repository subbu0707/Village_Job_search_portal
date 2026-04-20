// Create messages table for chat functionality
require("dotenv").config();
const mysql = require("mysql2/promise");

async function createMessagesTable() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("💬 Creating messages table...\n");

    // Create messages table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        message TEXT NOT NULL,
        job_id INT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL,
        INDEX idx_sender_receiver (sender_id, receiver_id),
        INDEX idx_job_id (job_id),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log("✅ messages table created successfully!");
    console.log("\nTable Structure:");
    console.log("  - id: Message ID");
    console.log("  - sender_id: User who sent the message");
    console.log("  - receiver_id: User who receives the message");
    console.log("  - message: Message content");
    console.log("  - job_id: Related job (optional)");
    console.log("  - is_read: Whether message is read");
    console.log("  - created_at: When message was sent");
  } catch (error) {
    console.error("❌ Error creating messages table:", error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the function
createMessagesTable()
  .then(() => {
    console.log("\n✅ Messages table setup complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Setup failed:", error);
    process.exit(1);
  });
