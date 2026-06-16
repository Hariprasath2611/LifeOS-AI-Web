import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const ForgotPassword: React.FC = () => {
  const { forgotPassword, error, clearError, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccess(false);

    if (!email) {
      setValidationError("Please enter your email address.");
      return;
    }

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {}
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center px-4 relative">
      <div className="absolute w-[350px] h-[350px] rounded-full bg-[#00FF88]/5 blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#111111] border border-[#1E1E1E] rounded-2xl p-8 shadow-2xl space-y-6">
        {/* Title */}
        <div className="space-y-2 text-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-2">
            <div className="w-7 h-7 rounded bg-neon-gradient flex items-center justify-center font-bold text-black text-sm">L</div>
            <span className="font-extrabold text-lg text-white">LifeOS AI</span>
          </Link>
          <h2 className="text-2xl font-bold text-white">Reset Password</h2>
          <p className="text-xs text-[#A0A0A0]">Enter your registered email to receive password recovery details.</p>
        </div>

        {/* Success Banner */}
        {success && (
          <div className="p-4 rounded-xl bg-[#00E676]/10 border border-[#00E676]/30 flex items-start gap-3 text-xs text-[#00E676]">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#00E676]" />
            <div className="space-y-1">
              <p className="font-semibold">Reset Link Transmitted!</p>
              <p className="text-[#A0A0A0]">Check your email inbox for instructions to update your credentials.</p>
            </div>
          </div>
        )}

        {/* Errors display */}
        {(error || validationError) && (
          <div className="p-3.5 rounded-lg bg-[#FF5252]/10 border border-[#FF5252]/30 flex items-start gap-2.5 text-xs text-[#FF5252]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{validationError || error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A0A0A0]">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A0]" />
              <input
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black border border-[#1E1E1E] text-sm text-white placeholder-[#A0A0A0] focus:border-[#00FF88] focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neon-gradient hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] text-black font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? <span>Sending reset link...</span> : <span>Send Instructions</span>}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-xs text-[#A0A0A0] hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
