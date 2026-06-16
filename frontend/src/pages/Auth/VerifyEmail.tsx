import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, CheckCircle2, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const { verifyEmail, user, error, loading } = useAuthStore();
  const [success, setSuccess] = useState(false);

  const handleVerify = async () => {
    try {
      await verifyEmail();
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {}
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center px-4 relative">
      <div className="absolute w-[350px] h-[350px] rounded-full bg-[#00FF88]/5 blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#111111] border border-[#1E1E1E] rounded-2xl p-8 shadow-2xl space-y-6 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-[#00FF88]/10 flex items-center justify-center border border-[#00FF88]/20 text-[#00FF88]">
            <Mail className="w-6 h-6 animate-pulse-slow" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Verify Your Email</h2>
          <p className="text-xs text-[#A0A0A0]">
            We've transmitted a verification link to <span className="text-white font-medium">{user?.email || 'your email'}</span>.
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="p-3.5 rounded-xl bg-[#00E676]/10 border border-[#00E676]/30 flex items-center justify-center gap-2 text-xs text-[#00E676] animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Email verified successfully! Redirecting...</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-[#FF5252]/10 border border-[#FF5252]/30 flex items-center justify-center gap-2 text-xs text-[#FF5252]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3 pt-2">
          {/* Mock Validation Action Button */}
          <button
            onClick={handleVerify}
            disabled={loading || success}
            className="w-full bg-neon-gradient hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] text-black font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Verifying account...</span>
            ) : (
              <>
                <span>Verify Email Address</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            disabled={loading || success}
            className="w-full py-2.5 rounded-xl bg-black hover:bg-[#1E1E1E] border border-[#1E1E1E] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Resend Link</span>
          </button>
        </div>

        <p className="text-xs text-[#A0A0A0]">
          Want to update your details?{' '}
          <Link to="/register" className="text-[#00FF88] hover:underline font-semibold">
            Go back
          </Link>
        </p>
      </div>
    </div>
  );
};
