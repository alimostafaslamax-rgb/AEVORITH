import { Home, Image, Video, MessageSquare, Box, FolderOpen, Layout, Cpu, Wrench, Code2, CreditCard, Settings, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Page } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
  mobile?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS: { icon: React.ElementType; label: string; page: Page; badge?: string }[] = [
  { icon: Home, label: 'Home', page: 'home' },
  { icon: Image, label: 'AI Image', page: 'ai-image', badge: 'New' },
  { icon: Video, label: 'AI Video', page: 'ai-video' },
  { icon: MessageSquare, label: 'AI Chat', page: 'ai-chat' },
  { icon: Box, label: '3D Generator', page: '3d-generator', badge: 'Beta' },
  { icon: FolderOpen, label: 'My Creations', page: 'my-creations' },
  { icon: Layout, label: 'Templates', page: 'templates' },
  { icon: Cpu, label: 'Models', page: 'models' },
  { icon: Wrench, label: 'Tools', page: 'tools' },
  { icon: Code2, label: 'API Access', page: 'api-access' },
  { icon: CreditCard, label: 'Pricing', page: 'pricing' },
  { icon: Settings, label: 'Settings', page: 'settings' },
];

export default function Sidebar({ currentPage, onNavigate, collapsed, onCollapse, mobile, onClose }: SidebarProps) {
  const { subscription } = useAuth();
  const handleNav = (page: Page) => {
    onNavigate(page);
    onClose?.();
  };

  return (
    <div className={`flex flex-col h-full bg-[#080a10] border-r border-white/8 transition-all duration-300 ${collapsed && !mobile ? 'w-16' : 'w-60'}`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/8 ${collapsed && !mobile ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        {(!collapsed || mobile) && (
          <span className="font-display font-bold text-white tracking-tight">AEVORITH</span>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {(!collapsed || mobile) && (
          <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest px-3 mb-3">Navigation</p>
        )}
        {NAV_ITEMS.map(({ icon: Icon, label, page, badge }) => (
          <button
            key={page}
            onClick={() => handleNav(page)}
            className={`sidebar-item ${currentPage === page ? 'active' : ''} ${collapsed && !mobile ? 'justify-center px-3' : ''}`}
            title={collapsed && !mobile ? label : undefined}
          >
            <Icon className={`w-4 h-4 flex-shrink-0 ${currentPage === page ? 'text-purple-400' : ''}`} />
            {(!collapsed || mobile) && (
              <>
                <span className="flex-1 text-left">{label}</span>
                {badge && (
                  <span className="tag tag-purple text-[9px] px-2 py-0.5">{badge}</span>
                )}
              </>
            )}
          </button>
        ))}
      </div>

      {/* Credits widget */}
      {(!collapsed || mobile) && (
        <div className="px-3 pb-4">
          <div className="glass-card p-3 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/50 font-medium">Credits</span>
              <span className="text-xs font-bold text-white">
                {subscription
                  ? `${subscription.credits_limit - subscription.credits_used} / ${subscription.credits_limit}`
                  : '— / —'}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-purple-500 to-violet-400 h-1.5 rounded-full"
                style={{
                  width: subscription
                    ? `${Math.max(0, ((subscription.credits_limit - subscription.credits_used) / subscription.credits_limit) * 100)}%`
                    : '0%',
                }}
              />
            </div>
            <button
              onClick={() => handleNav('pricing')}
              className="mt-3 w-full text-xs text-purple-400 hover:text-purple-300 font-medium text-center transition-colors"
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      )}

      {/* Collapse toggle (desktop only) */}
      {!mobile && (
        <button
          onClick={() => onCollapse(!collapsed)}
          className="flex items-center justify-center py-3 border-t border-white/8 text-white/30 hover:text-white/60 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}
