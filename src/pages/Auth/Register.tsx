import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bot, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, error, clearError, loading } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!name || !email || !password || !confirmPassword) {
      setValidationError("Please fill in all details.");
      return;
    }
    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    try {
      await register(email, password, name);
      // Proceed to verification step
      navigate('/verify-email');
    } catch (err) {}
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center px-4 relative">
      <div className="absolute w-[350px] h-[350px] rounded-full bg-[#00FF88]/5 blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#111111] border border-[#1E1E1E] rounded-2xl p-8 shadow-2xl space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-2">
            <div className="w-7 h-7 rounded bg-neon-gradient flex items-center justify-center font-bold text-black text-sm">L</div>
            <span className="font-extrabold text-lg text-white">LifeOS AI</span>
          </Link>
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="text-xs text-[#A0A0A0]">Join LifeOS and design your ultimate digital second brain.</p>
        </div>

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
            <label className="text-xs font-semibold text-[#A0A0A0]">Your Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A0]" />
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black border border-[#1E1E1E] text-sm text-white placeholder-[#A0A0A0] focus:border-[#00FF88] focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

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

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A0A0A0]">Password (Min 6 chars)</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A0]" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black border border-[#1E1E1E] text-sm text-white placeholder-[#A0A0A0] focus:border-[#00FF88] focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A0A0A0]">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A0]" />
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? (
              <span>Creating Second Brain...</span>
            ) : (
              <>
                <span>Sign Up</span>
                <Bot className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-[#A0A0A0]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#00FF88] hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
