import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Plus, User, Settings, CreditCard, LogOut, Image, Video, Box, Sparkles, Check, ChevronDown, Menu, X } from 'lucide-react';
import type { Page } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../lib/supabase';

interface TopNavProps {
  onNavigate: (page: Page) => void;
  onLandingNavigate: () => void;
  onMobileMenuToggle: () => void;
  mobileMenuOpen: boolean;
}

interface DbNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function TopNav({ onNavigate, onLandingNavigate, onMobileMenuToggle, mobileMenuOpen }: TopNavProps) {
  const { user, profile, subscription, signOut } = useAuth();
  const toast = useToast();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [notifications, setNotifications] = useState<DbNotification[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const createRef = useRef<HTMLDivElement>(null);

  const unread = notifications.filter(n => !n.read).length;
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const planLabel = subscription
    ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1) + ' Plan'
    : 'Free Plan';

  useEffect(() => {
    if (!user) return;
    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => { if (data) setNotifications(data); })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (createRef.current && !createRef.current.contains(e.target as Node)) setCreateOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkAllRead = async () => {
    if (!user) return;
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSignOut = async () => {
    setProfileOpen(false);
    await signOut();
    toast.success('Signed out successfully.');
    onLandingNavigate();
  };

  const relativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
    return `${Math.floor(hrs / 24)} day${Math.floor(hrs / 24) > 1 ? 's' : ''} ago`;
  };

  const SEARCH_RESULTS = [
    { type: 'tool', title: 'AI Image Generator', desc: 'Generate images from text', page: 'ai-image' as Page },
    { type: 'tool', title: 'AI Video Studio', desc: 'Create videos with AI', page: 'ai-video' as Page },
    { type: 'tool', title: '3D Generator', desc: 'Create 3D assets', page: '3d-generator' as Page },
    { type: 'page', title: 'Templates', desc: 'Browse AI templates', page: 'templates' as Page },
    { type: 'page', title: 'AI Models', desc: 'Browse AI models', page: 'models' as Page },
  ].filter(r => !searchQuery || r.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const notifIcon = (type: string) => {
    if (type === 'success') return <Check className="w-3.5 h-3.5 text-green-400" />;
    if (type === 'update') return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
    return <Bell className="w-3.5 h-3.5 text-blue-400" />;
  };

  return (
    <div className="glass-strong border-b border-white/8 px-4 md:px-6 py-3.5 flex items-center gap-3 sticky top-0 z-30">
      {/* Mobile menu toggle */}
      <button onClick={onMobileMenuToggle} className="md:hidden btn-ghost p-2">
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Search */}
      <div ref={searchRef} className="relative flex-1 max-w-sm">
        <div
          className="flex items-center gap-2 glass rounded-xl px-3 py-2 cursor-text border border-white/8 hover:border-white/15 transition-colors"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="w-4 h-4 text-white/30 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search tools, templates, creations..."
            className="bg-transparent text-white text-sm outline-none placeholder:text-white/30 w-full"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
          />
        </div>

        {searchOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-2xl border border-white/12 shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-2">
              <p className="text-[10px] text-white/30 font-semibold uppercase tracking-widest px-3 py-2">
                {searchQuery ? 'Results' : 'Quick Access'}
              </p>
              {SEARCH_RESULTS.map(r => (
                <button
                  key={r.title}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/6 transition-colors text-left"
                  onClick={() => { onNavigate(r.page); setSearchOpen(false); setSearchQuery(''); }}
                >
                  <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                    <Search className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{r.title}</div>
                    <div className="text-white/40 text-xs">{r.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Create New */}
        <div ref={createRef} className="relative">
          <button
            onClick={() => setCreateOpen(!createOpen)}
            className="btn-primary text-sm px-3 py-2 gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create New</span>
            <ChevronDown className="w-3 h-3 hidden sm:block" />
          </button>

          {createOpen && (
            <div className="absolute top-full right-0 mt-2 w-52 glass-strong rounded-2xl border border-white/12 shadow-2xl overflow-hidden animate-scale-in">
              <div className="p-2">
                {[
                  { icon: Image, label: 'Generate Image', page: 'ai-image' as Page },
                  { icon: Video, label: 'Generate Video', page: 'ai-video' as Page },
                  { icon: Sparkles, label: 'Animate Image', page: 'ai-video' as Page },
                  { icon: Box, label: 'Create 3D', page: '3d-generator' as Page },
                ].map(item => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-500/10 transition-colors text-left"
                    onClick={() => { onNavigate(item.page); setCreateOpen(false); }}
                  >
                    <item.icon className="w-4 h-4 text-purple-400" />
                    <span className="text-white text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors border border-white/8"
          >
            <Bell className="w-4 h-4 text-white/60" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                {unread}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 glass-strong rounded-2xl border border-white/12 shadow-2xl overflow-hidden animate-scale-in">
              <div className="p-4 border-b border-white/8">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white text-sm">Notifications</h4>
                  <span className="tag tag-purple text-[10px]">{unread} new</span>
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-white/30 text-sm">No notifications yet</div>
                ) : notifications.map(n => (
                  <div key={n.id} className={`flex gap-3 p-4 border-b border-white/5 hover:bg-white/4 transition-colors ${!n.read ? 'bg-purple-500/5' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${n.type === 'success' ? 'bg-green-500/15' : n.type === 'update' ? 'bg-purple-500/15' : 'bg-blue-500/15'}`}>
                      {notifIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white text-sm font-medium">{n.title}</p>
                        {!n.read && <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0" />}
                      </div>
                      <p className="text-white/50 text-xs mt-0.5 leading-relaxed">{n.message}</p>
                      <p className="text-white/25 text-xs mt-1">{relativeTime(n.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3">
                <button
                  onClick={handleMarkAllRead}
                  className="w-full text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium py-1"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 glass rounded-xl px-2 py-1.5 border border-white/8 hover:bg-white/8 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt="" className="w-full h-full rounded-lg object-cover" />
                : <User className="w-3.5 h-3.5 text-white" />
              }
            </div>
            <div className="hidden md:block text-left">
              <div className="text-white text-xs font-semibold leading-none truncate max-w-[100px]">{displayName}</div>
              <div className="text-white/40 text-[11px] mt-0.5">{planLabel}</div>
            </div>
            <ChevronDown className="w-3 h-3 text-white/30 hidden md:block" />
          </button>

          {profileOpen && (
            <div className="absolute top-full right-0 mt-2 w-52 glass-strong rounded-2xl border border-white/12 shadow-2xl overflow-hidden animate-scale-in">
              <div className="p-3 border-b border-white/8">
                <div className="text-white font-semibold text-sm truncate">{displayName}</div>
                <div className="text-white/40 text-xs mt-0.5 truncate">{user?.email}</div>
                <div className="tag tag-purple text-[10px] mt-2">{planLabel}</div>
              </div>
              <div className="p-2">
                {[
                  { icon: User, label: 'My Profile', page: 'settings' as Page },
                  { icon: Settings, label: 'Settings', page: 'settings' as Page },
                  { icon: CreditCard, label: 'Billing', page: 'pricing' as Page },
                ].map(item => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/6 transition-colors text-left"
                    onClick={() => { onNavigate(item.page); setProfileOpen(false); }}
                  >
                    <item.icon className="w-4 h-4 text-white/50" />
                    <span className="text-white/80 text-sm">{item.label}</span>
                  </button>
                ))}
                <div className="my-1 border-t border-white/8" />
                <button
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors text-left"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-sm">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
