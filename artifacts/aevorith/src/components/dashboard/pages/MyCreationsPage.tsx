import { useState, useEffect } from 'react';
import { Search, Grid3X3, List, Download, Share2, Trash2, Edit3, Heart, MoreHorizontal, Play, Box, Loader2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';

interface Creation {
  id: string;
  type: 'image' | 'video' | '3d' | 'animation';
  title: string;
  prompt: string;
  model: string;
  thumbnail: string;
  liked: boolean;
  created_at: string;
}

const TABS = ['All', 'Images', 'Videos', '3D', 'Animations'] as const;
const SORT_OPTIONS = ['Newest', 'Oldest', 'Most Liked', 'Name A-Z'];

export default function MyCreationsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState<typeof TABS[number]>('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<string[]>([]);
  const [creations, setCreations] = useState<Creation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    supabase
      .from('generations')
      .select('id, type, title, prompt, model, thumbnail, liked, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) {
          setCreations(data.map(g => ({
            id: g.id,
            type: g.type as Creation['type'],
            title: g.title,
            prompt: g.prompt ?? '',
            model: g.model ?? '',
            thumbnail: g.thumbnail ?? '',
            liked: g.liked ?? false,
            created_at: g.created_at,
          })));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const filtered = creations.filter(c => {
    if (tab === 'Images') return c.type === 'image';
    if (tab === 'Videos') return c.type === 'video';
    if (tab === '3D') return c.type === '3d';
    if (tab === 'Animations') return c.type === 'animation';
    return true;
  }).filter(c => !search || c.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'Oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === 'Name A-Z') return a.title.localeCompare(b.title);
      if (sortBy === 'Most Liked') return (b.liked ? 1 : 0) - (a.liked ? 1 : 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleLike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const item = creations.find(c => c.id === id);
    if (!item) return;
    const newLiked = !item.liked;
    setCreations(prev => prev.map(c => c.id === id ? { ...c, liked: newLiked } : c));
    await supabase.from('generations').update({ liked: newLiked }).eq('id', id);
  };

  const handleDeleteSelected = async () => {
    await supabase.from('generations').delete().in('id', selected);
    setCreations(prev => prev.filter(c => !selected.includes(c.id)));
    setSelected([]);
    toast.success(`${selected.length} creation${selected.length > 1 ? 's' : ''} deleted.`);
  };

  const handleDeleteOne = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase.from('generations').delete().eq('id', id);
    setCreations(prev => prev.filter(c => c.id !== id));
    toast.success('Creation deleted.');
  };

  const relativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const typeIcon = (type: Creation['type']) => {
    if (type === 'video') return <Play className="w-3 h-3" />;
    if (type === '3d') return <Box className="w-3 h-3" />;
    return null;
  };

  const tagClass = (type: Creation['type']) => {
    if (type === 'image') return 'tag-purple';
    if (type === 'video') return 'tag-blue';
    if (type === '3d') return 'tag-green';
    return 'tag-pink';
  };

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title text-2xl">My Creations</h1>
          <p className="text-white/40 text-sm mt-1">{creations.length} total creations</p>
        </div>
        {selected.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-sm">{selected.length} selected</span>
            <button onClick={handleDeleteSelected} className="btn-ghost text-sm gap-1.5 text-red-400 hover:text-red-300">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
            <button className="btn-secondary text-sm gap-1.5">
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search creations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-dark pl-9"
          />
        </div>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="input-dark w-auto"
        >
          {SORT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>

        <div className="flex glass rounded-xl border border-white/8 p-1">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-purple-600' : 'hover:bg-white/8'}`}>
            <Grid3X3 className="w-4 h-4 text-white" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-purple-600' : 'hover:bg-white/8'}`}>
            <List className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 glass rounded-xl p-1 w-fit">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-purple-600 text-white' : 'text-white/50 hover:text-white'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(creation => (
            <div
              key={creation.id}
              className={`glass-card overflow-hidden group cursor-pointer relative ${selected.includes(creation.id) ? 'ring-2 ring-purple-500' : ''}`}
              onClick={() => toggleSelect(creation.id)}
            >
              <div className="relative aspect-square">
                <img src={creation.thumbnail} alt={creation.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className={`absolute top-2 left-2 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selected.includes(creation.id) ? 'bg-purple-500 border-purple-500' : 'border-white/40 opacity-0 group-hover:opacity-100'}`}>
                  {selected.includes(creation.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
                </div>

                <div className="absolute top-2 right-2">
                  <span className={`tag text-[9px] py-0.5 px-2 ${tagClass(creation.type)}`}>
                    {creation.type}
                  </span>
                </div>

                {typeIcon(creation.type) && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      {typeIcon(creation.type)}
                    </div>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-2 flex gap-1.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
                  <button onClick={e => e.stopPropagation()} className="flex-1 glass py-1.5 rounded-lg flex items-center justify-center gap-1 text-[11px] text-white hover:bg-white/20 transition-colors">
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={e => e.stopPropagation()} className="w-8 h-7 glass rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Download className="w-3.5 h-3.5 text-white" />
                  </button>
                  <button onClick={e => e.stopPropagation()} className="w-8 h-7 glass rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Share2 className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-3">
                <p className="text-white text-xs font-medium truncate">{creation.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2">
                    <button onClick={e => toggleLike(creation.id, e)}>
                      <Heart className={`w-3 h-3 ${creation.liked ? 'fill-red-400 text-red-400' : 'text-white/30'}`} />
                    </button>
                    <span className="text-white/30 text-[11px]">{relativeTime(creation.created_at)}</span>
                  </div>
                  <button onClick={e => handleDeleteOne(creation.id, e)}>
                    <MoreHorizontal className="w-4 h-4 text-white/30 hover:text-white/60 transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(creation => (
            <div key={creation.id} className="glass-card flex items-center gap-4 p-3 cursor-pointer">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                <img src={creation.thumbnail} alt={creation.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{creation.title}</p>
                <p className="text-white/40 text-xs truncate mt-0.5">{creation.prompt}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`tag text-[10px] ${tagClass(creation.type)}`}>{creation.type}</span>
                <span className="text-white/30 text-xs hidden md:block">{creation.model}</span>
                <span className="text-white/25 text-xs hidden lg:block">{relativeTime(creation.created_at)}</span>
                <div className="flex gap-1">
                  <button className="w-7 h-7 hover:bg-white/8 rounded-lg flex items-center justify-center transition-colors"><Edit3 className="w-3.5 h-3.5 text-white/40" /></button>
                  <button className="w-7 h-7 hover:bg-white/8 rounded-lg flex items-center justify-center transition-colors"><Download className="w-3.5 h-3.5 text-white/40" /></button>
                  <button onClick={e => handleDeleteOne(creation.id, e)} className="w-7 h-7 hover:bg-red-500/10 rounded-lg flex items-center justify-center transition-colors"><Trash2 className="w-3.5 h-3.5 text-white/30 hover:text-red-400" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-white/15 mx-auto mb-3" />
          <p className="text-white/40">{creations.length === 0 ? 'No creations yet' : 'No creations found'}</p>
          <p className="text-white/25 text-sm mt-1">
            {creations.length === 0 ? 'Generate your first image to see it here' : 'Try adjusting your search or filters'}
          </p>
        </div>
      )}
    </div>
  );
}
