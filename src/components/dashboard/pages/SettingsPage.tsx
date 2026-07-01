import { useState, useEffect } from 'react';
import { User, Shield, Palette, Bell, CreditCard, Camera, Eye, EyeOff, CheckCircle2, Moon, Sun, Monitor, Loader2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { supabase } from '../../../lib/supabase';

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'billing', label: 'Billing', icon: CreditCard },
] as const;

type Section = typeof SECTIONS[number]['id'];

interface UserSettings {
  theme: string;
  notif_email_generations: boolean;
  notif_email_credits: boolean;
  notif_email_features: boolean;
  notif_email_digest: boolean;
  notif_email_marketing: boolean;
  notif_inapp_updates: boolean;
  notif_inapp_community: boolean;
  notif_inapp_system: boolean;
  interface_animations: boolean;
  interface_compact_sidebar: boolean;
  interface_tooltips: boolean;
  interface_autosave: boolean;
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  notif_email_generations: true,
  notif_email_credits: true,
  notif_email_features: false,
  notif_email_digest: false,
  notif_email_marketing: false,
  notif_inapp_updates: true,
  notif_inapp_community: true,
  notif_inapp_system: true,
  interface_animations: true,
  interface_compact_sidebar: false,
  interface_tooltips: true,
  interface_autosave: true,
};

export default function SettingsPage() {
  const { user, profile, subscription, updateProfile, refreshProfile } = useAuth();
  const toast = useToast();

  const [section, setSection] = useState<Section>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Profile form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Settings
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  // Billing invoices from notifications
  const [invoices] = useState([
    { date: 'Jun 1, 2026', desc: 'Creator Plan · Monthly', amount: '$19.00', status: 'Paid' },
    { date: 'May 1, 2026', desc: 'Creator Plan · Monthly', amount: '$19.00', status: 'Paid' },
    { date: 'Apr 1, 2026', desc: 'Creator Plan · Monthly', amount: '$19.00', status: 'Paid' },
  ]);

  // Load profile into form
  useEffect(() => {
    if (profile) {
      const parts = profile.full_name.split(' ');
      setFirstName(parts[0] ?? '');
      setLastName(parts.slice(1).join(' '));
      setUsername(profile.username);
      setBio(profile.bio);
      setWebsite(profile.website);
    }
  }, [profile]);

  // Load settings
  useEffect(() => {
    if (!user) return;
    setLoadingSettings(true);
    supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setSettings(data as UserSettings);
        setLoadingSettings(false);
      });
  }, [user]);

  const handleProfileSave = async () => {
    setSaving(true);
    const { error } = await updateProfile({
      full_name: [firstName, lastName].filter(Boolean).join(' '),
      username,
      bio,
      website,
    });
    setSaving(false);
    if (error) { toast.error(error); return; }
    toast.success('Profile updated successfully.');
  };

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) { toast.error('Please fill in all password fields.'); return; }
    if (newPassword !== confirmPassword) { toast.error('New passwords do not match.'); return; }
    if (newPassword.length < 8) { toast.error('Password must be at least 8 characters.'); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Password updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSettingsChange = async (key: keyof UserSettings, value: boolean | string) => {
    if (!user) return;
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    const { error } = await supabase
      .from('user_settings')
      .upsert({ user_id: user.id, ...updated, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    if (error) toast.error('Failed to save setting.');
  };

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-purple-600' : 'bg-white/10'}`}
    >
      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="flex h-full min-h-0 animate-fade-in">
      {/* Settings sidebar */}
      <div className="w-56 flex-shrink-0 border-r border-white/8 p-4 space-y-1 bg-[#060810]/50">
        <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest px-3 mb-4">Settings</p>
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={`sidebar-item ${section === id ? 'active' : ''}`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Settings content */}
      <div className="flex-1 overflow-y-auto p-6 max-w-2xl">
        {section === 'profile' && (
          <div className="space-y-6">
            <h2 className="section-title text-xl">Profile Settings</h2>

            {/* Avatar */}
            <div className="glass-card p-6">
              <h3 className="text-white font-semibold text-sm mb-4">Profile Picture</h3>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center text-2xl font-bold text-white">
                    {firstName ? firstName[0].toUpperCase() : (profile?.email[0]?.toUpperCase() ?? 'U')}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-purple-600 rounded-lg flex items-center justify-center border-2 border-[#080a10]">
                    <Camera className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
                <div>
                  <p className="text-white font-medium">{profile?.full_name || 'Your Name'}</p>
                  <p className="text-white/40 text-sm mt-0.5">{user?.email}</p>
                  <button className="btn-secondary text-xs mt-3 gap-1.5">Upload Photo</button>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-white font-semibold text-sm">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/50 mb-2">First Name</label>
                  <input className="input-dark" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-2">Last Name</label>
                  <input className="input-dark" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-2">Username</label>
                <input className="input-dark" value={username} onChange={e => setUsername(e.target.value)} placeholder="@username" />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-2">Email Address</label>
                <input className="input-dark opacity-60" value={user?.email ?? ''} readOnly type="email" />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-2">Bio</label>
                <textarea className="input-dark resize-none" rows={3} value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell the world about yourself..." />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-2">Website</label>
                <input className="input-dark" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yourwebsite.com" />
              </div>
              <button onClick={handleProfileSave} disabled={saving} className={`btn-primary gap-2 ${saving ? 'opacity-75' : ''}`}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {section === 'security' && (
          <div className="space-y-6">
            <h2 className="section-title text-xl">Security Settings</h2>

            <div className="glass-card p-6 space-y-4">
              <h3 className="text-white font-semibold text-sm">Change Password</h3>
              <div>
                <label className="block text-xs text-white/50 mb-2">Current Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} className="input-dark pr-10" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••••••" />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-2">New Password</label>
                <input type="password" className="input-dark" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••••••" />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-2">Confirm New Password</label>
                <input type="password" className="input-dark" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••••••" />
              </div>
              <button onClick={handlePasswordChange} disabled={saving} className={`btn-primary gap-2 ${saving ? 'opacity-75' : ''}`}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </div>

            <div className="glass-card p-6 space-y-4">
              <h3 className="text-white font-semibold text-sm">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between p-3 glass rounded-xl border border-white/8">
                <div>
                  <div className="text-white text-sm font-medium">Authenticator App</div>
                  <div className="text-white/40 text-xs mt-0.5">Use an authenticator app for 2FA</div>
                </div>
                <button className="btn-secondary text-xs">Enable</button>
              </div>
              <div className="flex items-center justify-between p-3 glass rounded-xl border border-white/8">
                <div>
                  <div className="text-white text-sm font-medium">SMS Verification</div>
                  <div className="text-white/40 text-xs mt-0.5">Receive codes via SMS</div>
                </div>
                <button className="btn-secondary text-xs">Enable</button>
              </div>
            </div>

            <div className="glass-card p-6 space-y-3">
              <h3 className="text-white font-semibold text-sm mb-1">Login Sessions</h3>
              {[
                { device: 'Chrome on MacOS', location: 'Current session', time: 'Active now', current: true },
              ].map((session, i) => (
                <div key={i} className="flex items-center gap-3 p-3 glass rounded-xl border border-white/6">
                  <Shield className={`w-4 h-4 flex-shrink-0 ${session.current ? 'text-green-400' : 'text-white/30'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium">{session.device}</div>
                    <div className="text-white/40 text-xs">{session.location} · {session.time}</div>
                  </div>
                  {session.current && <span className="tag tag-green text-[10px]">Active</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'appearance' && (
          <div className="space-y-6">
            <h2 className="section-title text-xl">Appearance</h2>

            <div className="glass-card p-6 space-y-4">
              <h3 className="text-white font-semibold text-sm">Theme</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'system', label: 'System', icon: Monitor },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleSettingsChange('theme', t.id)}
                    className={`p-4 rounded-xl flex flex-col items-center gap-2 border transition-all ${settings.theme === t.id ? 'bg-purple-500/15 border-purple-500/50 text-white' : 'glass border-white/8 text-white/50 hover:text-white'}`}
                  >
                    <t.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {loadingSettings ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 text-purple-400 animate-spin" /></div>
            ) : (
              <div className="glass-card p-6 space-y-4">
                <h3 className="text-white font-semibold text-sm">Interface Settings</h3>
                {([
                  { key: 'interface_compact_sidebar', label: 'Compact sidebar', desc: 'Show icons only in the sidebar' },
                  { key: 'interface_animations', label: 'Animations', desc: 'Enable smooth UI transitions' },
                  { key: 'interface_tooltips', label: 'Show tooltips', desc: 'Display helpful tips on hover' },
                  { key: 'interface_autosave', label: 'Auto-save drafts', desc: 'Automatically save prompt drafts' },
                ] as { key: keyof UserSettings; label: string; desc: string }[]).map(s => (
                  <div key={s.key} className="flex items-center justify-between">
                    <div>
                      <div className="text-white text-sm font-medium">{s.label}</div>
                      <div className="text-white/40 text-xs mt-0.5">{s.desc}</div>
                    </div>
                    <ToggleSwitch
                      checked={settings[s.key] as boolean}
                      onChange={v => handleSettingsChange(s.key, v)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {section === 'notifications' && (
          <div className="space-y-6">
            <h2 className="section-title text-xl">Notifications</h2>

            {loadingSettings ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 text-purple-400 animate-spin" /></div>
            ) : (
              <>
                <div className="glass-card p-6 space-y-4">
                  <h3 className="text-white font-semibold text-sm">Email Notifications</h3>
                  {([
                    { key: 'notif_email_generations', label: 'Generation completed', desc: 'Notify when AI generation is done' },
                    { key: 'notif_email_credits', label: 'Credit warnings', desc: 'Alert when credits are running low' },
                    { key: 'notif_email_features', label: 'New features', desc: 'Updates about new platform features' },
                    { key: 'notif_email_digest', label: 'Weekly digest', desc: 'Weekly summary of your creations' },
                    { key: 'notif_email_marketing', label: 'Marketing emails', desc: 'Tips, promotions, and offers' },
                  ] as { key: keyof UserSettings; label: string; desc: string }[]).map(n => (
                    <div key={n.key} className="flex items-center justify-between">
                      <div>
                        <div className="text-white text-sm font-medium">{n.label}</div>
                        <div className="text-white/40 text-xs mt-0.5">{n.desc}</div>
                      </div>
                      <ToggleSwitch
                        checked={settings[n.key] as boolean}
                        onChange={v => handleSettingsChange(n.key, v)}
                      />
                    </div>
                  ))}
                </div>

                <div className="glass-card p-6 space-y-4">
                  <h3 className="text-white font-semibold text-sm">In-App Notifications</h3>
                  {([
                    { key: 'notif_inapp_updates', label: 'Generation updates', desc: 'Real-time progress notifications' },
                    { key: 'notif_inapp_community', label: 'Community activity', desc: 'Likes and shares on your creations' },
                    { key: 'notif_inapp_system', label: 'System alerts', desc: 'Maintenance and downtime notices' },
                  ] as { key: keyof UserSettings; label: string; desc: string }[]).map(n => (
                    <div key={n.key} className="flex items-center justify-between">
                      <div>
                        <div className="text-white text-sm font-medium">{n.label}</div>
                        <div className="text-white/40 text-xs mt-0.5">{n.desc}</div>
                      </div>
                      <ToggleSwitch
                        checked={settings[n.key] as boolean}
                        onChange={v => handleSettingsChange(n.key, v)}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {section === 'billing' && (
          <div className="space-y-6">
            <h2 className="section-title text-xl">Billing & Subscription</h2>

            {/* Current plan */}
            <div className="glass-card p-6 bg-gradient-to-br from-purple-900/30 to-transparent border-purple-500/30">
              <div className="flex items-start justify-between">
                <div>
                  <div className="tag tag-purple mb-2">Current Plan</div>
                  <h3 className="text-white font-bold text-xl capitalize">{subscription?.plan ?? 'Free'} Plan</h3>
                  <p className="text-white/50 text-sm mt-1">
                    {subscription?.plan === 'free' ? 'Free forever' : '$19/month'} ·{' '}
                    {subscription?.renews_at
                      ? `Renews ${new Date(subscription.renews_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                      : 'No renewal'}
                  </p>
                </div>
                {subscription?.plan === 'free' && (
                  <button className="btn-primary text-sm">Upgrade to Creator</button>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/50">Credits used this month</span>
                  <span className="text-white font-medium">
                    {subscription?.credits_used ?? 0} / {subscription?.credits_limit ?? 50}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-violet-400 h-2 rounded-full"
                    style={{ width: `${subscription ? (subscription.credits_used / subscription.credits_limit) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-sm">Payment Method</h3>
                <button className="btn-secondary text-xs">Add New</button>
              </div>
              <div className="flex items-center gap-4 p-3 glass rounded-xl border border-white/8">
                <div className="w-10 h-7 rounded bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs font-bold">VISA</div>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">•••• •••• •••• 4242</div>
                  <div className="text-white/40 text-xs">Expires 08/27</div>
                </div>
                <span className="tag tag-green text-[10px]">Default</span>
              </div>
            </div>

            {/* Billing history */}
            <div className="glass-card p-6 space-y-3">
              <h3 className="text-white font-semibold text-sm">Billing History</h3>
              {invoices.map((invoice, i) => (
                <div key={i} className="flex items-center gap-4 p-3 glass rounded-xl border border-white/6">
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{invoice.desc}</div>
                    <div className="text-white/40 text-xs">{invoice.date}</div>
                  </div>
                  <div className="text-white font-semibold text-sm">{invoice.amount}</div>
                  <span className="tag tag-green text-[10px]">{invoice.status}</span>
                  <button className="text-xs text-white/40 hover:text-white/70 transition-colors">PDF</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
