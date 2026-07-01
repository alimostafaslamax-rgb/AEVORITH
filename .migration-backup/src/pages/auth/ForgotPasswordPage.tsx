import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Loader2, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address.');
      return;
    }
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      toast.error(error);
      return;
    }
    setSent(true);
    toast.success('Reset email sent! Check your inbox.');
  };

  return (
    <div className="min-h-screen bg-[#050709] flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-violet-900/15 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-2xl text-white tracking-tight">AEVORITH</span>
        </div>

        <div className="glass-strong rounded-3xl p-8 border border-white/10">
          <Link to="/auth/login" className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-6 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>

          {!sent ? (
            <>
              <div className="mb-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-purple-400" />
                </div>
                <h1 className="font-display font-bold text-2xl text-white mb-1">Reset your password</h1>
                <p className="text-white/50 text-sm">Enter your email and we'll send you a reset link</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-dark"
                    autoComplete="email"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary justify-center py-3.5 text-base rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
                <Mail className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="font-display font-bold text-xl text-white mb-2">Check your inbox</h2>
              <p className="text-white/50 text-sm mb-1">We sent a password reset link to</p>
              <p className="text-purple-400 font-medium mb-6">{email}</p>
              <p className="text-white/30 text-xs mb-6">Didn't receive it? Check your spam folder or try again.</p>
              <button
                onClick={() => setSent(false)}
                className="btn-secondary text-sm w-full justify-center"
              >
                Try a different email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
