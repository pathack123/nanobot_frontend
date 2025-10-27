import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Fade } from '@mui/material';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import UserManagement from './pages/UserManagement';
import ProtectedRoute from './components/ProtectedRoute';
import WebSocketNotification from './components/WebSocketNotification';
import tradingTheme from './theme/tradingTheme';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UserManagement />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={tradingTheme}>
      <CssBaseline />
      <BrowserRouter>
        <WebSocketNotification />
        <AnimatedRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

