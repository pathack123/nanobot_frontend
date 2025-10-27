import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Chip,
  Paper,
  Stack,
  Divider,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  Logout,
  Person,
  TrendingUp,
  Refresh,
  People,
  AccountBalance,
  Schedule,
  ShowChart,
} from '@mui/icons-material';
import { homeAPI, cryptoAPI } from '../utils/api';
import { logout, getUser } from '../utils/auth';
import CryptoPrice from '../components/CryptoPrice';
import WebSocketNotification from '../components/WebSocketNotification';

function Home() {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState(null);
  const [cryptoData, setCryptoData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [secretProgress, setSecretProgress] = useState(0);
  const [isHoldingSecret, setIsHoldingSecret] = useState(false);
  const user = getUser();
  const secretTimerRef = useRef(null);
  const secretIntervalRef = useRef(null);

  const cryptoSymbols = ['btcusdt', 'ethusdt', 'bnbusdt', 'adausdt', 'dogeusdt'];

  useEffect(() => {
    fetchHomeData();
    fetchCryptoData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const response = await homeAPI.getHome();
      setHomeData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const fetchCryptoData = async () => {
    setLoading(true);
    try {
      const response = await cryptoAPI.getAllLatestPrices();
      if (response.data.success) {
        setCryptoData(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching crypto data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Secret Menu - Hold icon for 10 seconds
  const handleSecretMouseDown = () => {
    setIsHoldingSecret(true);
    setSecretProgress(0);
    
    let progress = 0;
    secretIntervalRef.current = setInterval(() => {
      progress += 1;
      setSecretProgress(progress);
      
      if (progress >= 100) {
        clearInterval(secretIntervalRef.current);
        clearTimeout(secretTimerRef.current);
        // Navigate to User Management
        navigate('/users');
        setSecretProgress(0);
        setIsHoldingSecret(false);
      }
    }, 100); // Update every 100ms, 100 steps = 10 seconds
    
    secretTimerRef.current = setTimeout(() => {
      if (secretIntervalRef.current) {
        clearInterval(secretIntervalRef.current);
      }
    }, 10000);
  };

  const handleSecretMouseUp = () => {
    setIsHoldingSecret(false);
    setSecretProgress(0);
    if (secretTimerRef.current) {
      clearTimeout(secretTimerRef.current);
    }
    if (secretIntervalRef.current) {
      clearInterval(secretIntervalRef.current);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (secretTimerRef.current) {
        clearTimeout(secretTimerRef.current);
      }
      if (secretIntervalRef.current) {
        clearInterval(secretIntervalRef.current);
      }
    };
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* WebSocket Notification */}
      <WebSocketNotification />

      {/* Top Navigation Bar */}
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <Box
            onMouseDown={handleSecretMouseDown}
            onMouseUp={handleSecretMouseUp}
            onMouseLeave={handleSecretMouseUp}
            onTouchStart={handleSecretMouseDown}
            onTouchEnd={handleSecretMouseUp}
            sx={{
              cursor: 'default',
              userSelect: 'none',
              mr: 2,
            }}
          >
            <ShowChart sx={{ color: 'primary.main', fontSize: 32 }} />
          </Box>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Nanobot Trading Platform
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              icon={<Person />}
              label={user?.name || 'User'}
              variant="outlined"
              onClick={() => navigate('/profile')}
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                fontWeight: 600,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: '#000',
                  '& .MuiChip-icon': {
                    color: '#000',
                  },
                },
              }}
            />
            <Button
              variant="outlined"
              color="error"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{ fontWeight: 600 }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Paper
          elevation={3}
          sx={{
            background: 'linear-gradient(135deg, #F0B90B 0%, #F8D33A 50%, #F0B90B 100%)',
            p: 4,
            mb: 4,
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.3,
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: '#000',
                mb: 1,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <TrendingUp sx={{ fontSize: 48, mr: 2, verticalAlign: 'middle' }} />
              Real-Time Crypto Dashboard
            </Typography>
          
          </Box>
        </Paper>

    

        {/* Crypto Prices Section */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TrendingUp sx={{ color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  ราคา Cryptocurrency แบบ Real-time
                </Typography>
              </Stack>
              <Chip
                label="LIVE"
                color="success"
                icon={<Box component="span" sx={{ width: 8, height: 8, bgcolor: 'success.main', borderRadius: '50%', animation: 'pulse 2s infinite', '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.3 } } }} />}
                sx={{ fontWeight: 700 }}
              />
            </Box>

            {/* <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              📡 ข้อมูลสดจาก Binance WebSocket • บันทึกลง Database ทุกนาที
            </Typography> */}

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              {cryptoSymbols.map((symbol) => (
                <Grid item xs={12} sm={6} lg={4} key={symbol}>
                  <CryptoPrice symbol={symbol} />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Database Stats */}
        {cryptoData.length > 0 && (
          <Card sx={{ background: 'linear-gradient(135deg, #2B3139 0%, #1E2329 100%)' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                <AccountBalance sx={{ color: 'info.main', fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Database Statistics
                </Typography>
              </Stack>

              <Grid container spacing={3} sx={{ textAlign: 'center' }}>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'primary.main',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h2" sx={{ fontWeight: 900, color: 'primary.main', mb: 1 }}>
                      {cryptoData.length}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
                      สกุลเงินที่บันทึก
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'success.main',
                      borderRadius: 2,
                    }}
                  >
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
                      <Schedule sx={{ color: 'success.main', fontSize: 32 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                        {new Date(cryptoData[0]?.timestamp).toLocaleString('th-TH')}
                      </Typography>
                    </Stack>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
                      อัพเดทล่าสุด
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card sx={{ mt: 3, bgcolor: 'error.dark', borderLeft: '4px solid', borderColor: 'error.main' }}>
            <CardContent>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                ⚠️ {error}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: 'background.paper',
          py: 3,
          mt: 6,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" align="center" sx={{ fontWeight: 500 }}>
            <ShowChart sx={{ verticalAlign: 'middle', mr: 1, color: 'primary.main' }} />
            Nanobot Trading Platform • Powered by ajanfer
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
