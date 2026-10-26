import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { GridBackground } from '../../components/common/GridBackground';
import { authApi } from '../../services/authApi';
import {toast} from "react-hot-toast"
import { setLoading } from '../../store/slices/authSlice';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const {isLoading} = useSelector((state)=>state.auth)  
  const [step, setStep] = useState(1); // 1 = Verify OTP, 2 = Enter New Password
  const [resetToken, setResetToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email:location.state?.email || "",
    otp:"",
    newPassword:"",
    confirmPassword:""
  })
 
  // Step 1: Verify Reset OTP
  const handleVerifyOtp = async (e) => {
    const {email, otp} = formData
    e.preventDefault();
    if (!email.trim() || !otp.trim()) {
      toast.error('Please provide both email and 6-digit OTP.');
      return;
    }

    dispatch(setLoading(true))
    try {
      const res = await authApi.verifyResetOTP({
        email: email.trim(),
        otp: otp.trim(),
      });
      if (res.data?.resetToken) {
        setResetToken(res.data.resetToken);
        setStep(2);
      } else {
        throw new Error('Reset token missing from response');
      }
    } catch (err) {
      toast.error(err.message || 'Invalid or expired OTP code.');
    } finally {
      dispatch(setLoading(false))
    }
  };

  // Step 2: Set New Password
  const handleResetPassword = async (e) => {
    const {newPassword, confirmPassword} = formData
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 char long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    dispatch(setLoading(true))
    try {
      await authApi.resetPassword({
        email: formData.email.trim(),
        resetToken,
        newPassword:formData.newPassword.trim(),
      })
      toast.success('Password reset successfully! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Failed to reset password. Please try again.');
    } finally {
      dispatch(setLoading(false))
    }
  };

  return (
    <GridBackground isFullPage showGlow={true} mask="radial" className="flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/95 dark:bg-[#0d0e13]/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 p-8 space-y-6 shadow-2xl transition-all">
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="inline-block mb-1">
            <Logo size="md" onClick={() => navigate('/')} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {step === 1 ? 'Verify Reset Code' : 'Set New Password'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {step === 1
              ? 'Enter the 6-digit code sent to your email'
              : 'Choose a strong new password for your account'}
          </p>
        </div>
        {/* Step 1: Verify OTP */}
        {step === 1 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 flex flex-col gap-y-4">
            <TextField
              fullWidth
              size="small"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e)=>setFormData(prev=>({...prev, email:e.target.value}))}
              placeholder="student@niu.edu.in"
            />

            <TextField
              fullWidth
              size="small"
              label="6-Digit Reset Code"
              value={formData.otp}
              onChange={(e)=>setFormData(prev=>({...prev, otp:e.target.value}))}
              placeholder="123456"
              inputProps={{
                maxLength: 6,
                style: { textAlign: 'center', letterSpacing: '0.4rem', fontWeight: 'bold' },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                backgroundColor: 'var(--primary)',
                '&:hover': { backgroundColor: 'var(--primary-hover)' },
                color: '#ffffff',
                textTransform: 'none',
                fontWeight: 600,
                padding: '9px 16px',
                borderRadius: '10px',
              }}
            >
              {isLoading ?  "Verifying Code..." : "Verify Code" }
            </Button>
          </form>
        )}

        {/* Step 2: Set New Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4 flex flex-col gap-y-4">
            <TextField
              fullWidth
              size="small"
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={(e)=>setFormData(prev=>({...prev, newPassword:e.target.value}))}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              size="small"
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e)=>setFormData(prev=>({...prev, confirmPassword:e.target.value}))}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                backgroundColor: 'var(--primary)',
                '&:hover': { backgroundColor: 'var(--primary-hover)' },
                color: '#ffffff',
                textTransform: 'none',
                fontWeight: 600,
                padding: '9px 16px',
                borderRadius: '10px',
              }}
            >
              {isLoading ? "Resetting your password..." : "Reset Password"}
            </Button>
          </form>
        )}

        {/* Back Link */}
        <div className="text-center pt-1">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-yellow-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </GridBackground>
  );
};

export default ResetPasswordPage;
