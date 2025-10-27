import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Avatar,
  Stack,
  Alert,
  InputAdornment,
  Paper,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Home as HomeIcon,
  Logout,
  Person,
  Email,
  Lock,
  ShowChart,
  Phone,
  Chat,
  Save,
  ArrowBack,
  Edit,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import api from '../utils/api';
import { getToken, logout as authLogout, getUser } from '../utils/auth';

function Profile() {
  const navigate = useNavigate();
  const currentUser = getUser();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    line: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = response.data.data;
      setUserData(user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        phone: user.phone || '',
        line: user.line || '',
      });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'ไม่สามารถดึงข้อมูลได้');
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

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
      const token = getToken();
      const updateData = { ...formData };
      
      // ถ้าไม่ได้กรอก password ให้ลบออก
      if (!updateData.password) {
        delete updateData.password;
      }

      await api.put(`/users/${userData._id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('อัปเดตข้อมูลสำเร็จ!');
      setIsEditing(false);
      fetchUserData();
      
      // Update localStorage if name changed
      const updatedUser = { ...currentUser, name: updateData.name, email: updateData.email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดต');
    }
  };

  const handleLogout = () => {
    authLogout();
    navigate('/login');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>กำลังโหลด...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top Navigation Bar */}
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <ShowChart sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            โปรไฟล์ของฉัน
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/home')}
              sx={{ fontWeight: 600 }}
            >
              Home
            </Button>
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

      <Container maxWidth="md" sx={{ py: 4 }}>
   

        {/* Profile Header Card */}
        <Card
          sx={{
            mb: 4,
            background: 'linear-gradient(135deg, #F0B90B 0%, #F8D33A 100%)',
            color: '#000',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: '#000',
                  color: '#F0B90B',
                  fontSize: 48,
                  fontWeight: 900,
                  border: '4px solid #000',
                }}
              >
                {userData?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5 }}>
                  {userData?.name}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8, mb: 1 }}>
                  {userData?.email}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', opacity: 0.7, fontFamily: 'monospace' }}>
                  {/* User ID: {userData?._id} */}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Edit Form Card */}
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              ข้อมูลส่วนตัว
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="ชื่อ"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={!isEditing}
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
                  label="อีเมล"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {isEditing && (
                  <TextField
                    fullWidth
                    label="รหัสผ่านใหม่ (ไม่ต้องกรอกหากไม่ต้องการเปลี่ยน)"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="ใส่รหัสผ่านใหม่หรือเว้นว่างไว้"
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
                )}

                <TextField
                  fullWidth
                  label="เบอร์โทรศัพท์"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
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
                  disabled={!isEditing}
                  placeholder="@yourlineid"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Chat sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />

              </Stack>
            </form>

            {isEditing ? (
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: userData.name || '',
                      email: userData.email || '',
                      password: '',
                      phone: userData.phone || '',
                      line: userData.line || '',
                    });
                  }}
                >
                  ยกเลิก
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  color="success"
                  startIcon={<Save />}
                  sx={{ fontWeight: 600 }}
                >
                  บันทึกการเปลี่ยนแปลง
                </Button>
              </Stack>
            ) : (
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(true)}
                  sx={{ color: '#000', fontWeight: 600 }}
                >
                  แก้ไขข้อมูล
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Account Info */}
        <Paper sx={{ mt: 3, p: 3, bgcolor: 'background.paper' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>วันที่สร้างบัญชี:</strong> {new Date(userData?.createdAt).toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>
        </Paper>
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
            Nanobot Trading Platform • Profile Management
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Profile;

