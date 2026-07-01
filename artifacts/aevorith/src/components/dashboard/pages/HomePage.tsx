import { useState, useEffect } from 'react';
import { Image, Video, Box, Zap, TrendingUp, Star, Clock, Sparkles, ArrowRight, Play, ChevronRight } from 'lucide-react';
import type { Page } from '../../../types';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

interface RecentCreation {
  id: string;
  type: string;
  title: string;
  thumbnail: string;
  created_at: string;
}

const QUICK_ACTIONS = [
  { icon: Image, label: 'Generate Image', page: 'ai-image' as Page, color: 'from-purple-500 to-pink-500', desc: 'Create stunning AI images' },
  { icon: Video, label: 'Create Video', page: 'ai-video' as Page, color: 'from-blue-500 to-cyan-500', desc: 'Text to video generation' },
  { icon: Sparkles, label: 'Animate Image', page: 'ai-video' as Page, color: 'from-emerald-500 to-teal-500', desc: 'Bring images to life' },
  { icon: Box, label: 'Create 3D', page: '3d-generator' as Page, color: 'from-orange-500 to-amber-500', desc: '3D asset generation' },
];

const TRENDING = [
  { prompt: 'Ultra-realistic cyberpunk street portrait at night', model: 'Flux Ultra', likes: 2840, thumbnail: 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { prompt: 'Ancient dragon made of crystal in a stormy sky', model: 'Midjourney v6', likes: 2210, thumbnail: 'https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { prompt: 'Futuristic cityscape with flying cars at sunset', model: 'Flux Pro', likes: 1890, thumbnail: 'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { prompt: 'Underwater alien bioluminescent forest', model: 'DALL-E 3', likes: 1650, thumbnail: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=300' },
];

const timeOfDay = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

export default function HomePage({ onNavigate }: HomePageProps) {
  const { user, profile, subscription } = useAuth();
  const [recentCreations, setRecentCreations] = useState<RecentCreation[]>([]);
  const [stats, setStats] = useState({ images: 0, videos: 0, total: 0 });

  const displayName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';
  const creditsUsed = subscription?.credits_used ?? 0;
  const creditsLimit = subscription?.credits_limit ?? 0;
  const creditsRemaining = creditsLimit - creditsUsed;

  useEffect(() => {
    if (!user) return;
    supabase
      .from('generations')
      .select('id, type, title, thumbnail, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(4)
      .then(({ data }) => {
        if (data) {
          setRecentCreations(data.map(g => ({
            id: g.id,
            type: g.type,
            title: g.title,
            thumbnail: g.thumbnail ?? '',
            created_at: g.created_at,
          })));
        }
      });

    supabase
      .from('generations')
      .select('type', { count: 'exact' })
      .eq('user_id', user.id)
      .then(({ data, count }) => {
        if (data) {
          const images = data.filter(g => g.type === 'image').length;
          const videos = data.filter(g => g.type === 'video').length;
          setStats({ images, videos, total: count ?? data.length });
        }
      });
  }, [user]);

  const relativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const STATS = [
    { label: 'Images Generated', value: stats.images.toString(), change: 'All time', icon: Image, color: 'text-purple-400' },
    { label: 'Videos Created', value: stats.videos.toString(), change: 'All time', icon: Video, color: 'text-blue-400' },
    { label: 'Credits Used', value: creditsUsed.toString(), change: `${creditsRemaining} remaining`, icon: Zap, color: 'text-amber-400' },
    { label: 'Total Creations', value: stats.total.toString(), change: 'All time', icon: TrendingUp, color: 'text-green-400' },
  ];

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-white/40 text-sm mb-1">{timeOfDay()},</p>
          <h1 className="font-display font-bold text-3xl text-white">Welcome back, {displayName}!</h1>
          <p className="text-white/50 text-sm mt-1">
            {creditsLimit > 0
              ? `You have ${creditsRemaining.toLocaleString()} credits remaining. Keep creating.`
              : 'Start creating with AI-powered tools.'}
          </p>
        </div>
        <button onClick={() => onNavigate('ai-image')} className="btn-primary">
          <Sparkles className="w-4 h-4" />
          Start Creating
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(stat => (
          <div key={stat.label} className="stat-card">
            <div className={`${stat.color} mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-display font-bold text-white mb-0.5">{stat.value}</div>
            <div className="text-white/60 text-sm font-medium">{stat.label}</div>
            <div className="text-white/30 text-xs mt-1">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="section-title text-lg mb-4">Quick Create</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map(action => (
            <button
              key={action.label}
              onClick={() => onNavigate(action.page)}
              className="glass-card p-5 text-left group hover:scale-[1.02]"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.color} p-0.5 mb-4`}>
                <div className="w-full h-full rounded-[10px] bg-[#0a0a14] flex items-center justify-center">
                  <action.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="font-semibold text-white text-sm mb-1">{action.label}</div>
              <div className="text-white/40 text-xs">{action.desc}</div>
              <div className="mt-3 flex items-center gap-1 text-purple-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                Open <ChevronRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Creations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title text-lg">Recent Creations</h2>
          <button onClick={() => onNavigate('my-creations')} className="btn-ghost text-sm gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        {recentCreations.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Sparkles className="w-10 h-10 text-white/15 mx-auto mb-3" />
            <p className="text-white/40 text-sm">No creations yet</p>
            <p className="text-white/25 text-xs mt-1">Generate your first image to see it here</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentCreations.map(creation => (
              <div key={creation.id} className="glass-card overflow-hidden group cursor-pointer">
                <div className="relative h-40">
                  <img src={creation.thumbnail} alt={creation.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-2 right-2">
                    <span className={`tag text-[9px] py-0.5 px-2 ${creation.type === 'image' ? 'tag-purple' : creation.type === 'video' ? 'tag-blue' : 'tag-green'}`}>
                      {creation.type}
                    </span>
                  </div>
                  {creation.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Play className="w-4 h-4 text-white ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-white text-xs font-medium truncate">{creation.title}</p>
                  <div className="flex items-center gap-1 mt-1 text-white/30 text-[11px]">
                    <Clock className="w-3 h-3" />
                    {relativeTime(creation.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trending */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h2 className="section-title text-lg">Trending Creations</h2>
          </div>
          <button className="btn-ghost text-sm gap-1">
            See more <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TRENDING.map((item, i) => (
            <div key={i} className="glass-card p-4 flex items-center gap-4 cursor-pointer group">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                <img src={item.thumbnail} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium line-clamp-2 leading-tight">{item.prompt}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="tag tag-purple text-[10px]">{item.model}</span>
                  <span className="flex items-center gap-1 text-white/30 text-xs">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    {item.likes.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Tools */}
      <div>
        <h2 className="section-title text-lg mb-4">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Try Flux Ultra', desc: 'The most advanced image model is now available on your plan.', page: 'ai-image' as Page, color: 'text-purple-400', icon: Image },
            { title: 'Explore Templates', desc: '200+ new templates added this week for all creative styles.', page: 'templates' as Page, color: 'text-blue-400', icon: Sparkles },
            { title: 'Generate 3D Assets', desc: 'Beta: Create 3D models from text or image in seconds.', page: '3d-generator' as Page, color: 'text-amber-400', icon: Box },
          ].map(rec => (
            <button key={rec.title} onClick={() => onNavigate(rec.page)} className="glass-card p-5 text-left group">
              <rec.icon className={`w-6 h-6 ${rec.color} mb-3`} />
              <h3 className="text-white font-semibold text-sm mb-1">{rec.title}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{rec.desc}</p>
              <div className="mt-3 flex items-center gap-1 text-purple-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
