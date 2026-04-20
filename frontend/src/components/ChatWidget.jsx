import React, { useState, useEffect, useRef } from "react";
import api from "../api/api";
import { useTranslation } from "react-i18next";

const ChatWidget = ({ recipientId, recipientName, jobId, onClose }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [recipientId, jobId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await api.get(`/messages/${recipientId}`);
      setMessages(response.data.data || []);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await api.post("/messages", {
        receiverId: recipientId,
        message: newMessage,
        jobId,
      });
      setNewMessage("");
      loadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      alert(t("Failed to send message"));
    }
  };

  return (
    <div style={styles.widget}>
      <div style={styles.header}>
        <h3>{recipientName}</h3>
        <button onClick={onClose} style={styles.closeBtn}>
          ✕
        </button>
      </div>

      <div style={styles.messagesContainer}>
        {loading ? (
          <p style={styles.loadingText}>{t("Loading messages...")}</p>
        ) : messages.length === 0 ? (
          <p style={styles.emptyText}>{t("No messages yet")}</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                ...styles.message,
                ...(msg.isOwn ? styles.ownMessage : styles.otherMessage),
              }}
            >
              <p>{msg.message}</p>
              <small style={styles.timestamp}>
                {new Date(msg.createdAt).toLocaleTimeString()}
              </small>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} style={styles.form}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={t("Type a message...")}
          style={styles.input}
        />
        <button type="submit" style={styles.sendBtn}>
          {t("Send")}
        </button>
      </form>
    </div>
  );
};

const styles = {
  widget: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "350px",
    height: "500px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    zIndex: 1000,
  },
  header: {
    backgroundColor: "#4F46E5",
    color: "white",
    padding: "15px",
    borderRadius: "8px 8px 0 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeBtn: {
    backgroundColor: "transparent",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "20px",
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  message: {
    padding: "10px 15px",
    borderRadius: "8px",
    maxWidth: "80%",
    wordWrap: "break-word",
  },
  ownMessage: {
    backgroundColor: "#4F46E5",
    color: "white",
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "#f3f4f6",
    color: "#1f2937",
    alignSelf: "flex-start",
  },
  timestamp: {
    fontSize: "12px",
    opacity: 0.7,
    marginTop: "5px",
    display: "block",
  },
  loadingText: {
    textAlign: "center",
    color: "#9ca3af",
  },
  emptyText: {
    textAlign: "center",
    color: "#9ca3af",
  },
  form: {
    display: "flex",
    gap: "10px",
    padding: "15px",
    borderTop: "1px solid #e5e7eb",
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    fontSize: "14px",
  },
  sendBtn: {
    backgroundColor: "#4F46E5",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default ChatWidget;
