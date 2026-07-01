import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Info, Loader2, X } from 'lucide-react';
import { useToastState } from '../../contexts/ToastContext';
import type { ToastType } from '../../contexts/ToastContext';

const icons: Record<ToastType, React.ElementType> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  loading: Loader2,
};

const colors: Record<ToastType, string> = {
  success: 'text-green-400 bg-green-400/10 border-green-500/30',
  error: 'text-red-400 bg-red-400/10 border-red-500/30',
  info: 'text-blue-400 bg-blue-400/10 border-blue-500/30',
  loading: 'text-purple-400 bg-purple-400/10 border-purple-500/30',
};

function ToastItem({ id, type, message }: { id: string; type: ToastType; message: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 10); }, []);

  const Icon = icons[type];

  return (
    <div
      className={`flex items-start gap-3 w-80 rounded-2xl px-4 py-3.5 border shadow-2xl transition-all duration-300 backdrop-blur-xl
        ${colors[type]}
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
      style={{ background: 'rgba(10, 10, 20, 0.92)' }}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${type === 'loading' ? 'animate-spin' : ''}`} />
      <p className="text-white/90 text-sm leading-relaxed flex-1">{message}</p>
      <button
        onClick={() => setVisible(false)}
        className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useToastState();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem id={t.id} type={t.type} message={t.message} />
        </div>
      ))}
    </div>
  );
}
