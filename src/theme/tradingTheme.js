import { createTheme } from '@mui/material/styles';

// Dark Trading Theme - Inspired by Binance, Bybit, and modern trading platforms
const tradingTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#F0B90B', // Gold/Yellow - สีหลักแบบ Binance
      light: '#FCD535',
      dark: '#C79503',
      contrastText: '#000000',
    },
    secondary: {
      main: '#2B3139', // Dark gray for cards
      light: '#363E47',
      dark: '#1E2329',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#0ECB81', // Green for buy/profit
      light: '#2EE5A1',
      dark: '#0AA868',
      contrastText: '#000000',
    },
    error: {
      main: '#F6465D', // Red for sell/loss
      light: '#FF6B7D',
      dark: '#DC3545',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFA726',
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: '#000000',
    },
    info: {
      main: '#29B6F6',
      light: '#4FC3F7',
      dark: '#0288D1',
      contrastText: '#000000',
    },
    background: {
      default: '#0B0E11', // Very dark background
      paper: '#1E2329', // Card background
      dark: '#141519', // Darker sections
    },
    text: {
      primary: '#EAECEF', // Main text
      secondary: '#848E9C', // Secondary text
      disabled: '#5E6673',
    },
    divider: '#2B3139',
    chart: {
      green: '#0ECB81',
      red: '#F6465D',
      blue: '#3861FB',
      purple: '#8247E5',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    caption: {
      fontSize: '0.75rem',
      color: '#848E9C',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.3)',
    '0px 4px 8px rgba(0, 0, 0, 0.3)',
    '0px 6px 12px rgba(0, 0, 0, 0.3)',
    '0px 8px 16px rgba(0, 0, 0, 0.3)',
    '0px 12px 24px rgba(0, 0, 0, 0.4)',
    '0px 16px 32px rgba(0, 0, 0, 0.4)',
    '0px 20px 40px rgba(0, 0, 0, 0.5)',
    '0px 24px 48px rgba(0, 0, 0, 0.5)',
    '0px 2px 4px rgba(0, 0, 0, 0.3)',
    '0px 2px 4px rgba(0, 0, 0, 0.3)',
    '0px 2px 4px rgba(0, 0, 0, 0.3)',
    '0px 2px 4px rgba(0, 0, 0, 0.3)',
    '0px 2px 4px rgba(0, 0, 0, 0.3)',
    '0px 2px 4px rgba(0, 0, 0, 0.3)',
    '0px 2px 4px rgba(0, 0, 0, 0.3)',
    '0px 2px 4px rgba(0, 0, 0, 0.3)',
    '0px 2px 4px rgba(0, 0, 0, 0.3)',
    '0px 2px 4px rgba(0, 0, 0, 0.3)',
    '0px 2px 4px rgba(0, 0, 0, 0.3)',
    '0px 2px 4px rgba(0, 0, 0, 0.3)',
    '0px 2px 4px rgba(0, 0, 0, 0.3)',
    '0px 2px 4px rgba(0, 0, 0, 0.3)',
    '0px 2px 4px rgba(0, 0, 0, 0.3)',
    '0px 2px 4px rgba(0, 0, 0, 0.3)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#2B3139 #0B0E11',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#0B0E11',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#2B3139',
            borderRadius: '4px',
            '&:hover': {
              background: '#363E47',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #F0B90B 0%, #F8D33A 100%)',
          color: '#000000',
          '&:hover': {
            background: 'linear-gradient(135deg, #FCD535 0%, #F0B90B 100%)',
          },
        },
        containedSuccess: {
          background: '#0ECB81',
          '&:hover': {
            background: '#0AA868',
          },
        },
        containedError: {
          background: '#F6465D',
          '&:hover': {
            background: '#DC3545',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E2329',
          backgroundImage: 'none',
          borderRadius: 12,
          border: '1px solid #2B3139',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1E2329',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E2329',
          backgroundImage: 'none',
          borderBottom: '1px solid #2B3139',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#141519',
            '& fieldset': {
              borderColor: '#2B3139',
            },
            '&:hover fieldset': {
              borderColor: '#363E47',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#F0B90B',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default tradingTheme;

