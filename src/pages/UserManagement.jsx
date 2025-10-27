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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Stack,
  Pagination,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Divider,
  Grid,
} from '@mui/material';
import {
  Home as HomeIcon,
  Logout,
  Edit,
  Delete,
  Search,
  Person,
  Email,
  Lock,
  ShowChart,
  People,
  Badge as BadgeIcon,
  Phone,
  Chat,
} from '@mui/icons-material';
import api from '../utils/api';
import { getToken, logout as authLogout } from '../utils/auth';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', line: '' });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, [page, search]);

  const fetchCurrentUser = async () => {
    try {
      const token = getToken();
      const response = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(response.data.data);
    } catch (err) {
      // Error fetching current user
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await api.get(`/users?page=${page}&limit=10&search=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.data);
      setPagination(response.data.pagination);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'ไม่สามารถดึงข้อมูลผู้ใช้ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      phone: user.phone || '',
      line: user.line || '',
    });
    setOpenEditDialog(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }

      await api.put(`/users/${editingUser._id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOpenEditDialog(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', phone: '', line: '' });
      fetchUsers();
      fetchCurrentUser();
    } catch (err) {
      alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดต');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?')) {
      return;
    }

    try {
      const token = getToken();
      await api.delete(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (currentUser && currentUser._id === userId) {
        authLogout();
        navigate('/login');
      } else {
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการลบ');
    }
  };

  const handleLogout = () => {
    authLogout();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top Navigation Bar */}
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <People sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            User Management
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

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Current User Card */}
        {currentUser && (
          <Card
            sx={{
              mb: 4,
              background: 'linear-gradient(135deg, #F0B90B 0%, #F8D33A 100%)',
              color: '#000',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: '#000',
                    color: '#F0B90B',
                    fontSize: 36,
                    fontWeight: 900,
                    border: '3px solid #000',
                  }}
                >
                  {currentUser.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5 }}>
                    {currentUser.name}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.8 }}>
                    {currentUser.email}
                  </Typography>
                  {currentUser.phone && (
                    <Typography variant="body2" sx={{ opacity: 0.7, display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <Phone sx={{ fontSize: 16 }} /> {currentUser.phone}
                    </Typography>
                  )}
                  {currentUser.line && (
                    <Typography variant="body2" sx={{ opacity: 0.7, display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, mb: 1 }}>
                      <Chat sx={{ fontSize: 16 }} /> {currentUser.line}
                    </Typography>
                  )}
                  <Chip
                    icon={<BadgeIcon />}
                    label="Current User"
                    sx={{
                      bgcolor: '#000',
                      color: '#F0B90B',
                      fontWeight: 700,
                    }}
                  />
                </Box>
                {/* <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ display: 'block', opacity: 0.7 }}>
                    User ID
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                    {currentUser._id}
                  </Typography>
                </Box> */}
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Search Card */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <TextField
              fullWidth
              placeholder="ค้นหาตามชื่อหรืออีเมล..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
              }}
            />
          </CardContent>
        </Card>

        {/* Users List Card */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                รายชื่อผู้ใช้ทั้งหมด
              </Typography>
              <Chip
                label={`${pagination.total || 0} Users`}
                color="primary"
                sx={{ fontWeight: 700 }}
              />
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            ) : users.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <People sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  ไม่พบผู้ใช้
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>ผู้ใช้</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>อีเมล</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>เบอร์โทร</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>LINE</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>วันที่สร้าง</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700 }}>
                          การจัดการ
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow
                          key={user._id}
                          sx={{
                            '&:hover': {
                              bgcolor: 'action.hover',
                            },
                          }}
                        >
                          <TableCell>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar
                                sx={{
                                  bgcolor: 'primary.main',
                                  color: '#000',
                                  fontWeight: 700,
                                }}
                              >
                                {user.name.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                  {user.name}
                                </Typography>
                                {currentUser && user._id === currentUser._id && (
                                  <Chip
                                    label="You"
                                    size="small"
                                    color="success"
                                    sx={{ height: 20, fontSize: '0.7rem', mt: 0.5 }}
                                  />
                                )}
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.phone ? (
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2">{user.phone}</Typography>
                              </Stack>
                            ) : (
                              <Typography variant="body2" color="text.secondary">-</Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {user.line ? (
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <Chat sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2">{user.line}</Typography>
                              </Stack>
                            ) : (
                              <Typography variant="body2" color="text.secondary">-</Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString('th-TH', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <IconButton
                                size="small"
                                color="warning"
                                onClick={() => handleEdit(user)}
                                sx={{
                                  bgcolor: 'warning.main',
                                  color: '#fff',
                                  width: 36,
                                  height: 36,
                                  '&:hover': { bgcolor: 'warning.dark', color: '#fff' },
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(user._id)}
                                sx={{
                                  bgcolor: 'error.main',
                                  color: '#fff',
                                  width: 36,
                                  height: 36,
                                  '&:hover': { bgcolor: 'error.dark', color: '#fff' },
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={pagination.pages}
                      page={page}
                      onChange={(e, value) => setPage(value)}
                      color="primary"
                      size="large"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            backgroundImage: 'none',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Edit sx={{ color: 'warning.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              แก้ไขข้อมูลผู้ใช้
            </Typography>
          </Stack>
        </DialogTitle>
        <form onSubmit={handleUpdate}>
          <DialogContent sx={{ pt: 3 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="ชื่อ"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                label="อีเมล"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                label="รหัสผ่าน (ไม่ต้องกรอกหากไม่ต้องการเปลี่ยน)"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="ใส่รหัสผ่านใหม่หรือเว้นว่างไว้"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="เบอร์โทรศัพท์"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                type="text"
                value={formData.line}
                onChange={(e) => setFormData({ ...formData, line: e.target.value })}
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
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button
              onClick={() => {
                setOpenEditDialog(false);
                setEditingUser(null);
                setFormData({ name: '', email: '', password: '', phone: '', line: '' });
              }}
              variant="outlined"
              color="inherit"
            >
              ยกเลิก
            </Button>
            <Button type="submit" variant="contained" color="warning" sx={{ color: '#000' }}>
              อัพเดท
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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
            Nanobot Trading Platform • User Management System
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default UserManagement;
