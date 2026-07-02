import { useState, useEffect } from 'react';
import { Upload, Settings2, ChevronDown, Wand2, Download, Heart, Share2, MoreHorizontal, Sliders, RefreshCw, ZoomIn } from 'lucide-react';
import { AI_MODELS, IMAGE_STYLES } from '../../../data';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';

interface GeneratedImage {
  id: string;
  title: string;
  prompt: string;
  model: string;
  thumbnail: string;
  liked: boolean;
  created_at: string;
}

const RESOLUTIONS = ['512×512', '768×768', '1024×1024', '1536×1024', '1024×1536'];
const ASPECTS = ['1:1', '16:9', '9:16', '4:3', '3:4', '3:2'];
const QUALITIES = ['Standard', 'High', 'Ultra'];

export default function AIImagePage() {
  const { user } = useAuth();
  const toast = useToast();
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('flux-ultra');
  const [selectedStyle, setSelectedStyle] = useState('photorealistic');
  const [selectedRes, setSelectedRes] = useState('1024×1024');
  const [selectedAspect, setSelectedAspect] = useState('1:1');
  const [selectedQuality, setSelectedQuality] = useState('High');
  const [generating, setGenerating] = useState(false);
  const [negativePrompt, setNegativePrompt] = useState('');
  const [cfgScale, setCfgScale] = useState(7);
  const [steps, setSteps] = useState(30);
  const [gallery, setGallery] = useState<GeneratedImage[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);

  const imageModels = AI_MODELS.filter(m => m.category === 'image');

  useEffect(() => {
    if (!user) {
      setLoadingGallery(false);
      return;
    }
    supabase
      .from('generations')
      .select('id, title, prompt, model, thumbnail, liked, created_at')
      .eq('user_id', user.id)
      .eq('type', 'image')
      .order('created_at', { ascending: false })
      .limit(24)
      .then(({ data }) => {
        if (data) {
          setGallery(data.map(g => ({
            id: g.id,
            title: g.title,
            prompt: g.prompt,
            model: g.model,
            thumbnail: g.thumbnail,
            liked: g.liked ?? false,
            created_at: g.created_at,
          })));
        }
        setLoadingGallery(false);
      })
      .catch(() => setLoadingGallery(false));
  }, [user]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);

    const modelName = imageModels.find(m => m.id === selectedModel)?.name ?? selectedModel;
    const title = prompt.slice(0, 60) + (prompt.length > 60 ? '...' : '');

    try {
      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style: selectedStyle, model: modelName }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error ?? 'Request failed');
      }

      const { thumbnail } = await res.json();

      const { data, error } = await supabase
        .from('generations')
        .insert({
          type: 'image',
          title,
          prompt,
          model: modelName,
          thumbnail,
          metadata: { style: selectedStyle, resolution: selectedRes, aspect: selectedAspect, quality: selectedQuality, cfg_scale: cfgScale, steps },
        })
        .select('id, title, prompt, model, thumbnail, liked, created_at')
        .single();

      if (error) {
        toast.error('Failed to save generation.');
        return;
      }

      if (data) {
        setGallery(prev => [{
          id: data.id,
          title: data.title,
          prompt: data.prompt,
          model: data.model,
          thumbnail: data.thumbnail,
          liked: data.liked ?? false,
          created_at: data.created_at,
        }, ...prev]);
        toast.success('Image generated successfully!');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate image.';
      toast.error(msg);
    } finally {
      setGenerating(false);
    }
  };

  const toggleLike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const item = gallery.find(g => g.id === id);
    if (!item) return;
    const newLiked = !item.liked;
    setGallery(prev => prev.map(g => g.id === id ? { ...g, liked: newLiked } : g));
    await supabase.from('generations').update({ liked: newLiked }).eq('id', id);
  };

  return (
    <div className="flex h-full min-h-0 animate-fade-in">
      {/* Left: Settings Panel */}
      <div className="w-80 flex-shrink-0 border-r border-white/8 overflow-y-auto bg-[#060810]/50">
        <div className="p-5 space-y-5">
          <div>
            <h2 className="section-title text-sm mb-1">AI Image Generator</h2>
            <p className="text-white/40 text-xs">Create stunning images from text descriptions</p>
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Prompt</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create in detail..."
              rows={4}
              className="input-dark resize-none"
            />
          </div>

          {/* Negative Prompt */}
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Negative Prompt</label>
            <textarea
              value={negativePrompt}
              onChange={e => setNegativePrompt(e.target.value)}
              placeholder="What to exclude from the image..."
              rows={2}
              className="input-dark resize-none text-xs"
            />
          </div>

          {/* Model */}
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">AI Model</label>
            <div className="space-y-1.5">
              {imageModels.map(model => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all border ${selectedModel === model.id ? 'bg-purple-500/15 border-purple-500/40 text-white' : 'glass border-white/8 text-white/60 hover:text-white hover:border-white/15'}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${selectedModel === model.id ? 'bg-purple-400' : 'bg-white/20'}`} />
                    <span>{model.name}</span>
                    {model.badge && <span className="tag tag-purple text-[9px] py-0.5 px-1.5">{model.badge}</span>}
                  </div>
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Art Style</label>
            <div className="grid grid-cols-3 gap-2">
              {IMAGE_STYLES.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`relative rounded-xl overflow-hidden h-16 border-2 transition-all ${selectedStyle === style.id ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-white/10 hover:border-white/25'}`}
                >
                  <img src={style.preview} alt={style.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-1.5">
                    <span className="text-white text-[9px] font-medium">{style.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Resolution */}
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Resolution</label>
            <div className="grid grid-cols-3 gap-1.5">
              {RESOLUTIONS.map(r => (
                <button key={r} onClick={() => setSelectedRes(r)} className={`px-2 py-2 rounded-lg text-xs font-medium transition-all border ${selectedRes === r ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'glass border-white/8 text-white/50 hover:text-white'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-1.5">
              {ASPECTS.map(a => (
                <button key={a} onClick={() => setSelectedAspect(a)} className={`px-2 py-2 rounded-lg text-xs font-medium transition-all border ${selectedAspect === a ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'glass border-white/8 text-white/50 hover:text-white'}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Quality */}
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Quality</label>
            <div className="flex gap-2">
              {QUALITIES.map(q => (
                <button key={q} onClick={() => setSelectedQuality(q)} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${selectedQuality === q ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'glass border-white/8 text-white/50 hover:text-white'}`}>
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced */}
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-3 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" /> Advanced
            </label>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-white/50">CFG Scale</span>
                  <span className="text-xs text-white font-mono">{cfgScale}</span>
                </div>
                <input type="range" min={1} max={20} value={cfgScale} onChange={e => setCfgScale(+e.target.value)}
                  className="w-full accent-purple-500 h-1.5" />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-white/50">Steps</span>
                  <span className="text-xs text-white font-mono">{steps}</span>
                </div>
                <input type="range" min={10} max={50} value={steps} onChange={e => setSteps(+e.target.value)}
                  className="w-full accent-purple-500 h-1.5" />
              </div>
            </div>
          </div>

          {/* Upload */}
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Upload Reference</label>
            <button className="w-full glass border border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all">
              <Upload className="w-5 h-5 text-white/30" />
              <span className="text-xs text-white/40">Drop an image or click to upload</span>
            </button>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
            className={`w-full btn-primary justify-center py-3.5 text-base rounded-xl ${generating ? 'opacity-75' : 'purple-glow'}`}
          >
            {generating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Generate Image
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right: Gallery */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="section-title text-sm">Generated Gallery</h3>
          <div className="flex items-center gap-2">
            <button className="btn-ghost text-xs gap-1"><Settings2 className="w-3.5 h-3.5" /> Filter</button>
          </div>
        </div>

        {generating && (
          <div className="mb-6 glass-card p-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl shimmer-bg" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-4 h-4 text-purple-400 animate-spin" />
                <span className="text-white font-medium text-sm">Generating your image...</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-purple-500 to-violet-400 h-1.5 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
              <p className="text-white/40 text-xs mt-1.5">Using {imageModels.find(m => m.id === selectedModel)?.name} · {selectedRes}</p>
            </div>
          </div>
        )}

        {loadingGallery ? (
          <div className="flex justify-center py-20">
            <RefreshCw className="w-6 h-6 text-purple-400 animate-spin" />
          </div>
        ) : gallery.length === 0 && !generating ? (
          <div className="text-center py-20">
            <Wand2 className="w-12 h-12 text-white/15 mx-auto mb-3" />
            <p className="text-white/40">No images yet</p>
            <p className="text-white/25 text-sm mt-1">Enter a prompt and click Generate Image to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map(creation => (
              <div key={creation.id} className="glass-card overflow-hidden group cursor-pointer">
                <div className="relative aspect-square">
                  <img src={creation.thumbnail} alt={creation.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
                    <p className="text-white text-xs font-medium line-clamp-2">{creation.prompt}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={e => toggleLike(creation.id, e)} className="w-7 h-7 glass rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                        <Heart className={`w-3.5 h-3.5 ${creation.liked ? 'fill-red-400 text-red-400' : 'text-white'}`} />
                      </button>
                      <button className="w-7 h-7 glass rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                        <Download className="w-3.5 h-3.5 text-white" />
                      </button>
                      <button className="w-7 h-7 glass rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                        <Share2 className="w-3.5 h-3.5 text-white" />
                      </button>
                      <button className="w-7 h-7 glass rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors ml-auto">
                        <ZoomIn className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-white text-xs font-medium truncate">{creation.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-white/30 text-[11px]">{creation.model}</span>
                    <button><MoreHorizontal className="w-4 h-4 text-white/30 hover:text-white/60 transition-colors" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
