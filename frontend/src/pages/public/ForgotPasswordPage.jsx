import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { GridBackground } from '../../components/common/GridBackground';
import { authApi } from '../../services/authApi';
import {toast} from "react-hot-toast"
import {setLoading} from '../../store/slices/authSlice'
import {useDispatch, useSelector} from 'react-redux'

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const {isLoading} = useSelector((state)=>state.auth)
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    dispatch(setLoading(true))
    try {
      await authApi.forgotPassword({ email: email.trim() });
      toast.success("If email registered, OTP sent!");
      navigate('/reset-password', { state: { email: email.trim() } });
    } catch (err) {
      toast.error(err.message || 'Failed to request password reset.');
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Forgot password?</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your email to receive a password reset verification code
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Reset instructions sent!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                If an account exists for <span className="font-semibold text-slate-700 dark:text-slate-200">{email}</span>, you will receive a reset OTP code.
              </p>
            </div>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/reset-password', { state: { email: email.trim() } })}
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
              Enter Reset Code
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-y-4">
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
              {isLoading ? (
                 'Sending OTP...'
              ) : (
                'Send Reset Code'
              )}
            </Button>
          </form>
        )}

        {/* Back Link */}
        <div className="text-center pt-2">
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

export default ForgotPasswordPage;
