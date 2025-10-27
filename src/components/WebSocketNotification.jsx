import { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  AlertTitle,
  IconButton,
  Slide,
  Stack,
  Typography,
  Chip,
  Paper,
} from '@mui/material';
import {
  Close,
  Wifi,
  PersonAdd,
  Edit,
  Delete,
  AccessTime,
  Email,
  Person,
  Info,
} from '@mui/icons-material';
import wsClient from '../utils/websocket';

const WebSocketNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    wsClient.connect();

    const unsubscribe = wsClient.subscribe((data) => {
      if (data.type === 'connection') {
        setIsConnected(data.status === 'connected');
      }

      if (data.type === 'user:created' || data.type === 'user:updated' || data.type === 'user:deleted') {
        const notification = {
          id: Date.now(),
          type: data.type,
          message: data.data?.message || data.message || 'User event occurred',
          timestamp: data.timestamp || new Date(),
          data: data.data,
        };

        setNotifications((prev) => [notification, ...prev].slice(0, 5));

        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
        }, 8000);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getNotificationSeverity = (type) => {
    switch (type) {
      case 'user:created':
        return 'success';
      case 'user:updated':
        return 'info';
      case 'user:deleted':
        return 'error';
      default:
        return 'info';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'user:created':
        return <PersonAdd />;
      case 'user:updated':
        return <Edit />;
      case 'user:deleted':
        return <Delete />;
      default:
        return <Info />;
    }
  };

  const getNotificationTitle = (type) => {
    switch (type) {
      case 'user:created':
        return 'ผู้ใช้ใหม่';
      case 'user:updated':
        return 'อัพเดทข้อมูล';
      case 'user:deleted':
        return 'ลบผู้ใช้';
      default:
        return 'แจ้งเตือน';
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 80,
        right: 20,
        zIndex: 1300,
        width: 380,
        maxWidth: 'calc(100vw - 40px)',
      }}
    >
      {/* Connection Status Badge - แสดงเฉพาะเมื่อเชื่อมต่อสำเร็จ */}
      {isConnected && (
        <Slide direction="left" in={isConnected} mountOnEnter unmountOnExit>
          <Alert
            severity="success"
            icon={<Wifi />}
            sx={{
              mb: 2,
              bgcolor: 'rgba(14, 203, 129, 0.1)',
              border: '1px solid',
              borderColor: 'success.main',
              '& .MuiAlert-icon': {
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                  '50%': { opacity: 0.6, transform: 'scale(1.1)' },
                },
              },
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                WebSocket เชื่อมต่อแล้ว
              </Typography>
              <Chip
                label="LIVE"
                size="small"
                color="success"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  height: 20,
                }}
              />
            </Stack>
          </Alert>
        </Slide>
      )}

      {/* Notification List */}
      {notifications.map((notification) => (
        <Slide key={notification.id} direction="left" in mountOnEnter unmountOnExit>
          <Alert
            severity={getNotificationSeverity(notification.type)}
            icon={getNotificationIcon(notification.type)}
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={() =>
                  setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
                }
              >
                <Close fontSize="small" />
              </IconButton>
            }
            sx={{
              mb: 2,
              border: '1px solid',
              borderColor: `${getNotificationSeverity(notification.type)}.main`,
              boxShadow: 3,
            }}
          >
            <AlertTitle sx={{ fontWeight: 700, mb: 1 }}>
              {getNotificationTitle(notification.type)}
            </AlertTitle>
            
            <Typography variant="body2" sx={{ mb: 1 }}>
              {notification.message}
            </Typography>

            {notification.data && (
              <Box
                sx={{
                  mt: 1.5,
                  pt: 1.5,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Stack spacing={0.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Email sx={{ fontSize: 14 }} />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {notification.data.email}
                    </Typography>
                  </Stack>
                  {notification.data.name && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Person sx={{ fontSize: 14 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {notification.data.name}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Box>
            )}

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1, opacity: 0.7 }}>
              <AccessTime sx={{ fontSize: 12 }} />
              <Typography variant="caption">เมื่อสักครู่</Typography>
            </Stack>
          </Alert>
        </Slide>
      ))}

      {/* Help Text when connected but no notifications */}
      {isConnected && notifications.length === 0 && (
        <Slide direction="left" in mountOnEnter unmountOnExit>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'info.main',
              textAlign: 'center',
            }}
          >
            <Info sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              ทดสอบ WebSocket
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              ไปที่ "จัดการผู้ใช้งาน" แล้วลอง
              <br />
              สร้าง, แก้ไข, หรือลบผู้ใช้
              <br />
              <Box component="span" sx={{ color: 'success.main', fontWeight: 700 }}>
                จะเห็น notification แสดงที่นี่
              </Box>
            </Typography>
          </Paper>
        </Slide>
      )}
    </Box>
  );
};

export default WebSocketNotification;
