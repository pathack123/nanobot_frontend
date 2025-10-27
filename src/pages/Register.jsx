import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  Stack,
  InputAdornment,
  IconButton,
  Paper,
} from '@mui/material';
import {
  PersonAdd,
  Visibility,
  VisibilityOff,
  ShowChart,
  Email,
  Lock,
  Person,
  Phone,
  Chat,
} from '@mui/icons-material';
import { authAPI } from '../utils/api';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    line: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.register(formData);
      setSuccess(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0B0E11 0%, #1E2329 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23F0B90B\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.5,
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Logo/Brand */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #F0B90B 0%, #F8D33A 100%)',
            borderRadius: 3,
          }}
        >
          <ShowChart sx={{ fontSize: 64, color: '#000' }} />
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#000', mt: 1 }}>
            Nanobot Trading
          </Typography>
          <Typography variant="body2" sx={{ color: '#000', opacity: 0.8, fontWeight: 600 }}>
            Professional Cryptocurrency Trading Platform
          </Typography>
        </Paper>

        <Card
          elevation={8}
          sx={{
            background: 'linear-gradient(135deg, #1E2329 0%, #2B3139 100%)',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
              สมัครสมาชิก
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: 'center', mb: 3 }}
            >
              สร้างบัญชีเพื่อเริ่มเทรดแบบมืออาชีพ
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="ชื่อ"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="เบอร์โทรศัพท์"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="08X-XXX-XXXX"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="LINE ID"
                  name="line"
                  type="text"
                  value={formData.line}
                  onChange={handleChange}
                  placeholder="@yourlineid"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Chat sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  startIcon={<PersonAdd />}
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}
                >
                  สมัครสมาชิก
                </Button>
              </Stack>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                มีบัญชีแล้ว?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 700,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  เข้าสู่ระบบ
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 3 }}
        >
          © 2025 Nanobot Trading Platform. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Register;
