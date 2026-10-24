import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { authApi } from '../../services/authApi';
import { setCredentials, setLoading } from '../../store/slices/authSlice';

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: 'kumarrahulhzb799@gmail.com',
    password: '1@Rahul1@',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      toast.error('Please enter both email and password.');
      return;
    }

    dispatch(setLoading(true));

    try {
      const res = await authApi.login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (res.success && res.data?.user) {
        dispatch(setCredentials(res.data.user));
        toast.success('Signed in successfully!');
        navigate('/student/dashboard');
      }
    } catch (err) {
      // If user is unverified, redirect to verify-email
      if (err.message && err.message.toLowerCase().includes('verify')) {
        toast.error('Email verification required.');
        navigate('/verify-email', { state: { email: formData.email.trim() } });
      } else {
        toast.error(err.message || 'Invalid email or password.');
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-300 p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="inline-block mb-1">
            <Logo size="md" onClick={() => navigate('/')} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
          <p className="text-xs text-slate-500">Sign in to your student account to continue</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-y-4">
          <TextField
            fullWidth
            size="small"
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="student@niu.edu.in"
          />

          <TextField
            fullWidth
            size="small"
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff size={18} className="text-slate-600" />
                      ) : (
                        <Eye size={18} className="text-slate-500" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <div className="flex items-center justify-between text-xs">
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{ color: '#4f46e5', '&.Mui-checked': { color: '#4f46e5' } }}
                />
              }
              label={<span className="text-xs text-slate-600">Remember me</span>}
            />

            <Link
              to="/forgot-password"
              className="text-indigo-600 hover:text-primary-dark font-semibold"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              backgroundColor: 'bg-primary',
              '&:hover': { backgroundColor: 'bg-primary-dark' },
              textTransform: 'none',
              fontWeight: 600,
              padding: '9px 16px',

            }}
          >
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
