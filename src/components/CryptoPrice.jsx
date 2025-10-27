import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, Typography, Box, Chip, Stack, Divider } from '@mui/material';
import { TrendingUp, TrendingDown, FiberManualRecord } from '@mui/icons-material';

const BINANCE_WS_URL = 'wss://stream.binance.com:9443';

// Crypto logos/icons mapping
const cryptoIcons = {
  btcusdt: '₿',
  ethusdt: 'Ξ',
  bnbusdt: '🔸',
  adausdt: '₳',
  dogeusdt: 'Ð',
};

const cryptoNames = {
  btcusdt: 'Bitcoin',
  ethusdt: 'Ethereum',
  bnbusdt: 'BNB',
  adausdt: 'Cardano',
  dogeusdt: 'Dogecoin',
};

function CryptoPrice({ symbol = 'btcusdt' }) {
  const [price, setPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    const wsSymbol = symbol.toLowerCase();
    let isMounted = true;

    const connectWebSocket = () => {
      if (wsRef.current) {
        wsRef.current.onclose = null;
        if (
          wsRef.current.readyState === WebSocket.OPEN ||
          wsRef.current.readyState === WebSocket.CONNECTING
        ) {
          wsRef.current.close();
        }
        wsRef.current = null;
      }

      const ws = new WebSocket(`${BINANCE_WS_URL}/ws/${wsSymbol}@ticker`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (isMounted) {
          setIsConnected(true);
        }
      };

      ws.onmessage = (event) => {
        if (isMounted) {
          try {
            const data = JSON.parse(event.data);
            setPrice(parseFloat(data.c));
            setPriceChange(parseFloat(data.P));
          } catch (error) {
            // Error parsing message
          }
        }
      };

      ws.onerror = (error) => {
        if (isMounted) {
          setIsConnected(false);
        }
      };

      ws.onclose = () => {
        if (isMounted) {
          setIsConnected(false);

          reconnectTimeoutRef.current = setTimeout(() => {
            if (isMounted) {
              connectWebSocket();
            }
          }, 3000);
        }
      };
    };

    connectWebSocket();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.onclose = null;
        if (
          wsRef.current.readyState === WebSocket.OPEN ||
          wsRef.current.readyState === WebSocket.CONNECTING
        ) {
          wsRef.current.close();
        }
        wsRef.current = null;
      }
    };
  }, [symbol]);

  const getPriceColor = () => {
    if (!priceChange) return 'text.primary';
    return priceChange >= 0 ? 'success.main' : 'error.main';
  };

  const formatPrice = (value) => {
    if (!value) return '0.00';
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Card
      sx={{
        height: '100%',
        background: priceChange >= 0
          ? 'linear-gradient(135deg, rgba(14, 203, 129, 0.05) 0%, rgba(14, 203, 129, 0.02) 100%)'
          : 'linear-gradient(135deg, rgba(246, 70, 93, 0.05) 0%, rgba(246, 70, 93, 0.02) 100%)',
        border: '1px solid',
        borderColor: priceChange >= 0 ? 'success.main' : 'error.main',
        borderWidth: '1px',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: priceChange >= 0
            ? '0 8px 24px rgba(14, 203, 129, 0.2)'
            : '0 8px 24px rgba(246, 70, 93, 0.2)',
          borderWidth: '2px',
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* Header: Symbol & Status */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                background: priceChange >= 0
                  ? 'linear-gradient(135deg, #0ECB81 0%, #2EE5A1 100%)'
                  : 'linear-gradient(135deg, #F6465D 0%, #FF6B7D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {cryptoIcons[symbol.toLowerCase()] || '🪙'}
            </Typography>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
                {symbol.toUpperCase().replace('USDT', '')}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                {cryptoNames[symbol.toLowerCase()] || 'Crypto'}
              </Typography>
            </Box>
          </Stack>

          <Chip
            icon={
              <FiberManualRecord
                sx={{
                  fontSize: 10,
                  animation: isConnected ? 'pulse 2s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.3 },
                  },
                }}
              />
            }
            label={isConnected ? 'Live' : 'Offline'}
            size="small"
            color={isConnected ? 'success' : 'error'}
            sx={{
              fontWeight: 700,
              fontSize: '0.65rem',
              height: 22,
            }}
          />
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Price Display */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              color: getPriceColor(),
              fontFamily: '"Roboto Mono", monospace',
              letterSpacing: '-0.02em',
            }}
          >
            ${formatPrice(price)}
          </Typography>
        </Box>

        {/* Price Change */}
        {priceChange !== null && (
          <Stack direction="row" spacing={1} alignItems="center">
            {priceChange >= 0 ? (
              <TrendingUp sx={{ color: 'success.main', fontSize: 20 }} />
            ) : (
              <TrendingDown sx={{ color: 'error.main', fontSize: 20 }} />
            )}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: getPriceColor(),
                fontFamily: '"Roboto Mono", monospace',
              }}
            >
              {priceChange >= 0 ? '+' : ''}
              {priceChange.toFixed(2)}%
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
              24h Change
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export default CryptoPrice;
