import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';

const NotificationBell = ({ userId }) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  const loadNotifications = async () => {
    try {
      const response = await api.get('/notifications?limit=5');
      setNotifications(response.data.data || []);
      
      const countResponse = await api.get('/notifications/unread/count');
      setUnreadCount(countResponse.data.data.count || 0);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      loadNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      loadNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <div style={styles.container}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={styles.bellButton}
        title={t('Notifications')}
      >
        🔔
        {unreadCount > 0 && (
          <span style={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div style={styles.dropdown}>
          <div style={styles.header}>
            <h4 style={styles.title}>{t('Notifications')}</h4>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                style={styles.markAllBtn}
              >
                {t('Mark all as read')}
              </button>
            )}
          </div>

          <div style={styles.notificationsList}>
            {notifications.length === 0 ? (
              <p style={styles.emptyText}>{t('No notifications')}</p>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  style={{
                    ...styles.notificationItem,
                    ...(notification.is_read ? {} : styles.unreadNotification)
                  }}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <p style={styles.notificationTitle}>{notification.title}</p>
                  <p style={styles.notificationMessage}>{notification.message}</p>
                  <small style={styles.notificationTime}>
                    {new Date(notification.created_at).toLocaleString()}
                  </small>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
  },
  bellButton: {
    position: 'relative',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '5px',
  },
  badge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: '#EF4444',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '40px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    width: '350px',
    zIndex: 1000,
    maxHeight: '400px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: '14px',
  },
  markAllBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#4F46E5',
    cursor: 'pointer',
    fontSize: '12px',
    textDecoration: 'underline',
  },
  notificationsList: {
    overflowY: 'auto',
    maxHeight: '300px',
  },
  notificationItem: {
    padding: '12px',
    borderBottom: '1px solid #f3f4f6',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  unreadNotification: {
    backgroundColor: '#EEF2FF',
  },
  notificationTitle: {
    margin: '0 0 5px 0',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  notificationMessage: {
    margin: '0 0 5px 0',
    fontSize: '12px',
    color: '#6b7280',
  },
  notificationTime: {
    color: '#9ca3af',
    fontSize: '11px',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    padding: '20px',
    margin: 0,
  },
};

export default NotificationBell;
