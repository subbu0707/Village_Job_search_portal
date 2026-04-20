import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';

const ChatWindow = ({ recipientId, recipientName, jobId, onClose }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, [recipientId]);

  const loadMessages = async () => {
    try {
      const response = await api.get(`/messages/${recipientId}`);
      setMessages(response.data.data || []);
      setError('');
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await api.post('/messages', {
        recipient_id: recipientId,
        message: newMessage,
        job_id: jobId || null
      });
      setNewMessage('');
      await loadMessages();
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>{recipientName}</h3>
          {jobId && <small style={styles.subtitle}>Job ID: {jobId}</small>}
        </div>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>
      </div>

      <div style={styles.messagesArea}>
        {loading ? (
          <p style={styles.centerText}>{t('Loading messages...')}</p>
        ) : error ? (
          <p style={{ ...styles.centerText, color: '#EF4444' }}>{error}</p>
        ) : messages.length === 0 ? (
          <p style={styles.centerText}>{t('No messages yet')}</p>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} style={styles.messageWrapper}>
              <div style={msg.isOwn ? styles.ownMsg : styles.otherMsg}>
                <p>{msg.message_text || msg.message}</p>
                <small>{new Date(msg.created_at).toLocaleTimeString()}</small>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSend} style={styles.inputArea}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={t('Type a message...')}
          style={styles.input}
        />
        <button type="submit" style={styles.sendBtn}>{t('Send')}</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#4F46E5',
    color: 'white',
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: '16px',
  },
  subtitle: {
    opacity: 0.8,
    fontSize: '12px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '20px',
    cursor: 'pointer',
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  messageWrapper: {
    display: 'flex',
  },
  ownMsg: {
    backgroundColor: '#4F46E5',
    color: 'white',
    padding: '10px 12px',
    borderRadius: '8px',
    maxWidth: '75%',
    marginLeft: 'auto',
  },
  otherMsg: {
    backgroundColor: '#f3f4f6',
    color: '#1f2937',
    padding: '10px 12px',
    borderRadius: '8px',
    maxWidth: '75%',
  },
  centerText: {
    textAlign: 'center',
    color: '#9ca3af',
    margin: 'auto',
  },
  inputArea: {
    display: 'flex',
    gap: '10px',
    padding: '12px',
    borderTop: '1px solid #e5e7eb',
  },
  input: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
  },
  sendBtn: {
    backgroundColor: '#4F46E5',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default ChatWindow;
