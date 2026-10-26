import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';;
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Mail, ArrowLeft, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { GridBackground } from '../../components/common/GridBackground';
import { authApi } from '../../services/authApi';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../store/slices/authSlice';

export const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(60);

  // Resend countdown
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !otp.trim()) {
      toast.error('Please provide 6-digit OTP.');
      return;
    }

    if (otp.trim().length !== 6) {
      toast.error('Please enter a valid 6-digit verification code.');
      return;
    }

    dispatch(setLoading(true));
    try {
      const res = await authApi.verifySignupOTP({
        email: email.trim(),
        otp: otp.trim(),
      });

      toast.success("Email Verified!. Redirecting to login...");

      // Redirect to login after brief confirmation
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      toast.error(err.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isLoading) return;
    if (!email.trim()) {
      toast.error('Please provide your email to resend OTP.');
      return;
    }
    dispatch(setLoading(true));
    try {
      const res = await authApi.resendSignupOTP({ email: email.trim() });
      toast.success(res.message || 'New OTP sent to your email.');
      setResendCooldown(60);
      setOtp('');
    } catch (err) {
      toast.error(err.message || 'Failed to resend verification code.');
    } finally {
      dispatch(setLoading(false));
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Verify your email</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter the 6-digit verification code sent to your email
          </p>
          {email && (
            <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-primary-light text-primary-dark dark:bg-primary-dark/40 dark:text-yellow-200 rounded-full text-xs font-semibold">
              <Mail className="w-3.5 h-3.5" />
              <span>{email}</span>
            </div>
          )}
        </div>

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-y-4">
          {!location.state?.email && (
            <TextField
              fullWidth
              size="small"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="student@niu.edu.in"
              required
            />
          )}

          <TextField
            fullWidth
            size="small"
            label="6-Digit Verification Code"
            value={otp}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 6);
              setOtp(val);
            }}
            placeholder="123456"
            inputProps={{
              maxLength: 6,
              style: { textAlign: 'center', letterSpacing: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem' },
            }}
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading || otp.length !== 6}
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
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Verify & Continue'
            )}
          </Button>
        </form>

        {/* Resend Action */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Didn't receive the code?</span>
          {resendCooldown > 0 ? (
            <span className="text-slate-400 dark:text-slate-500 font-medium">Resend in {resendCooldown}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading}
              className="font-semibold text-primary dark:text-yellow-300 hover:underline cursor-pointer disabled:opacity-50 inline-flex items-center gap-1"
            >
              {isLoading && <RefreshCw className="w-3 h-3 animate-spin" />}
              <span>Resend Code</span>
            </button>
          )}
        </div>

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

export default VerifyEmailPage;
