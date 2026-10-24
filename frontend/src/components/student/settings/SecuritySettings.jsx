import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { authApi } from '../../../services/authApi';
import { logout } from '../../../store/slices/authSlice';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  Info
} from 'lucide-react';

export const SecuritySettings = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');

  // Password visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // OTP flow state
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // 60-second cooldown timer
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Handle Send OTP
  const handleSendOtp = async () => {
    try {
      setIsSendingOtp(true);
      const res = await authApi.sendChangePasswordOTP();
      if (res && res.success) {
        setOtpSent(true);
        setCooldown(60);
        toast.success(
          res.message || `Verification OTP sent to ${user?.email || 'your email'}`
        );
      } else {
        throw new Error(res?.message || 'Could not send verification OTP');
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      toast.error(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Password strength checklist rules
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const isPasswordValid = hasMinLength && hasUpper && hasLower && hasNumber;
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  // Handle Change Password Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error('Current password is required');
      return;
    }

    if (!isPasswordValid) {
      toast.error(
        'New password must be at least 8 characters and include uppercase, lowercase, and a number'
      );
      return;
    }

    if (!passwordsMatch) {
      toast.error('New password and confirm password do not match');
      return;
    }

    if (!otp.trim()) {
      toast.error('Please enter the 6-digit OTP sent to your email');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await authApi.changePassword({
        currentPassword,
        newPassword,
        otp: otp.trim()
      });

      if (res && res.success) {
        toast.success(
          res.message || 'Password changed successfully! Please login with your new password.',
          { duration: 5000 }
        );
        // Clear auth slice & redirect to login as backend revokes sessions on password change
        dispatch(logout());
        navigate('/login', { replace: true });
      } else {
        throw new Error(res?.message || 'Password change failed');
      }
    } catch (err) {
      console.error('Change password error:', err);
      toast.error(err.message || 'Could not update password. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 space-y-6">
      {/* Header Bar */}
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[var(--primary)]" />
          <span>Security & Password Management</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Update your account password with two-factor email OTP authentication.
        </p>
      </div>

      {/* Info Notice Box */}
      <div className="bg-blue-50/70 border border-blue-200 p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-blue-900 leading-relaxed">
          <p className="font-bold text-blue-950">How password change works:</p>
          <p className="text-blue-800">
            For security, click <span className="font-semibold">"Send Verification OTP"</span> below. A 6-digit code will be sent to{' '}
            <span className="font-mono font-bold text-blue-950">{user?.email || 'your registered email'}</span>. After changing your password, you will be logged out of all active devices.
          </p>
        </div>
      </div>

      {/* OTP Request Action */}
      <div className="bg-slate-50 border border-slate-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-slate-800 block">
            {otpSent ? 'Verification Code Dispatched' : 'Request Password Change OTP'}
          </span>
          <span className="text-[11px] text-slate-500 block">
            {otpSent
              ? `Check inbox of ${user?.email || 'registered email'}. Valid for 10 minutes.`
              : 'You must request an OTP before submitting new password credentials.'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleSendOtp}
          disabled={isSendingOtp || cooldown > 0}
          className="px-4 py-2 text-xs font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1.5 shadow-2xs"
        >
          {isSendingOtp ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Sending OTP...</span>
            </>
          ) : cooldown > 0 ? (
            <>
              <Clock className="w-3.5 h-3.5" />
              <span>Resend in {cooldown}s</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>{otpSent ? 'Resend OTP' : 'Send Verification OTP'}</span>
            </>
          )}
        </button>
      </div>

      {/* Main Password Form */}
      <form onSubmit={handleSubmit} className="space-y-5 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Current Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-white border border-slate-200 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showCurrent ? 'Hide password' : 'Show password'}
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 6-Digit Email OTP */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              6-Digit Email OTP <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 482910"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-mono tracking-widest bg-white border border-slate-200 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors"
              />
            </div>
            {!otpSent && (
              <p className="text-[10px] text-amber-600 font-semibold">
                * Click "Send Verification OTP" above first to receive this code.
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new strong password"
                className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-white border border-slate-200 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showNew ? 'Hide password' : 'Show password'}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-white border border-slate-200 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && (
              <span
                className={`text-[11px] font-semibold block ${
                  passwordsMatch ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
              </span>
            )}
          </div>
        </div>

        {/* Live Password Requirements Checklist */}
        <div className="bg-slate-50 border border-slate-200/80 p-3.5 space-y-2 text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
            Password Security Rules:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <span
              className={`inline-flex items-center gap-1 font-medium ${
                hasMinLength ? 'text-emerald-700 font-bold' : 'text-slate-500'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${hasMinLength ? 'text-emerald-600' : 'text-slate-300'}`} />
              8+ Characters
            </span>
            <span
              className={`inline-flex items-center gap-1 font-medium ${
                hasUpper ? 'text-emerald-700 font-bold' : 'text-slate-500'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${hasUpper ? 'text-emerald-600' : 'text-slate-300'}`} />
              Uppercase Letter
            </span>
            <span
              className={`inline-flex items-center gap-1 font-medium ${
                hasLower ? 'text-emerald-700 font-bold' : 'text-slate-500'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${hasLower ? 'text-emerald-600' : 'text-slate-300'}`} />
              Lowercase Letter
            </span>
            <span
              className={`inline-flex items-center gap-1 font-medium ${
                hasNumber ? 'text-emerald-700 font-bold' : 'text-slate-500'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${hasNumber ? 'text-emerald-600' : 'text-slate-300'}`} />
              Numeric Digit
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !isPasswordValid || !passwordsMatch || !otp || !currentPassword}
            className="px-5 py-2.5 text-xs font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-40 transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Change & Verify Password</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecuritySettings;
