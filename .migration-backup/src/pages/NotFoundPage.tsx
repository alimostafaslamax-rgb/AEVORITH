import { useNavigate } from 'react-router-dom';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050709] flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-900/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-violet-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="text-center relative z-10 max-w-lg">
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-2xl text-white tracking-tight">AEVORITH</span>
        </div>

        <div className="font-display font-black text-[120px] leading-none gradient-text mb-4 select-none">
          404
        </div>

        <h1 className="font-display font-bold text-2xl text-white mb-3">Page not found</h1>
        <p className="text-white/50 text-base mb-10 leading-relaxed">
          This page doesn't exist or was removed. Head back to the platform to keep creating.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary gap-2 px-6 py-3 rounded-xl text-base"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-primary gap-2 px-6 py-3 rounded-xl text-base purple-glow"
          >
            <Home className="w-5 h-5" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
