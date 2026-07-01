import { useState } from 'react';
import { Video, Image, Wand2, Clock, Camera, Play, RefreshCw, Upload, Sliders, Download, MoreHorizontal, ChevronDown } from 'lucide-react';
import { MOCK_CREATIONS, AI_MODELS } from '../../../data';

const VIDEO_MODES = [
  { id: 'text-to-video', label: 'Text to Video', icon: Wand2 },
  { id: 'image-to-video', label: 'Image to Video', icon: Image },
  { id: 'animation', label: 'AI Animation', icon: Play },
];

const DURATIONS = ['3s', '5s', '8s', '10s', '15s'];
const CAMERA_MOVES = ['Static', 'Pan Left', 'Pan Right', 'Zoom In', 'Zoom Out', 'Orbit', 'Dolly In', 'Crane Up'];
const VIDEO_STYLES = ['Cinematic', 'Documentary', 'Anime', 'Claymation', '3D Render', 'Vintage Film'];
const MOTION_EFFECTS = ['Smooth', 'Dynamic', 'Slow Motion', 'Timelapse', 'Hyperlapse'];

export default function AIVideoPage() {
  const [mode, setMode] = useState('text-to-video');
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('sora-v2');
  const [duration, setDuration] = useState('5s');
  const [cameraMove, setCameraMove] = useState('Static');
  const [videoStyle, setVideoStyle] = useState('Cinematic');
  const [motionEffect, setMotionEffect] = useState('Smooth');
  const [generating, setGenerating] = useState(false);

  const videoModels = AI_MODELS.filter(m => m.category === 'video');
  const videoCreations = MOCK_CREATIONS.filter(c => c.type === 'video' || c.type === 'animation');

  return (
    <div className="flex h-full min-h-0 animate-fade-in">
      {/* Left panel */}
      <div className="w-80 flex-shrink-0 border-r border-white/8 overflow-y-auto bg-[#060810]/50">
        <div className="p-5 space-y-5">
          <div>
            <h2 className="section-title text-sm mb-1">AI Video Studio</h2>
            <p className="text-white/40 text-xs">Create cinematic AI videos from text or images</p>
          </div>

          {/* Mode selector */}
          <div className="grid grid-cols-3 gap-1.5 p-1 glass rounded-xl">
            {VIDEO_MODES.map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg text-xs font-medium transition-all ${mode === m.id ? 'bg-purple-600 text-white' : 'text-white/50 hover:text-white'}`}
              >
                <m.icon className="w-4 h-4" />
                <span className="text-[10px]">{m.label}</span>
              </button>
            ))}
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
              {mode === 'text-to-video' ? 'Video Description' : mode === 'image-to-video' ? 'Animation Prompt' : 'Animation Style'}
            </label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={mode === 'text-to-video' ? 'A dramatic ocean storm with towering waves crashing against rocks...' : 'Describe the animation motion and style...'}
              rows={4}
              className="input-dark resize-none"
            />
          </div>

          {/* Image upload for image-to-video */}
          {mode !== 'text-to-video' && (
            <div>
              <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Source Image</label>
              <button className="w-full glass border border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-purple-500/40 transition-all">
                <Upload className="w-5 h-5 text-white/30" />
                <span className="text-xs text-white/40">Upload image to animate</span>
              </button>
            </div>
          )}

          {/* Model */}
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">AI Model</label>
            <div className="space-y-1.5">
              {videoModels.map(model => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all border ${selectedModel === model.id ? 'bg-purple-500/15 border-purple-500/40 text-white' : 'glass border-white/8 text-white/60 hover:text-white'}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${selectedModel === model.id ? 'bg-purple-400' : 'bg-white/20'}`} />
                    {model.name}
                    {model.badge && <span className="tag tag-purple text-[9px]">{model.badge}</span>}
                  </div>
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Duration
            </label>
            <div className="flex gap-2">
              {DURATIONS.map(d => (
                <button key={d} onClick={() => setDuration(d)} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${duration === d ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'glass border-white/8 text-white/50 hover:text-white'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Camera Movement */}
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" /> Camera Movement
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {CAMERA_MOVES.map(c => (
                <button key={c} onClick={() => setCameraMove(c)} className={`px-2 py-2 rounded-lg text-[10px] font-medium transition-all border ${cameraMove === c ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'glass border-white/8 text-white/40 hover:text-white'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Video Style */}
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Video Style</label>
            <div className="grid grid-cols-2 gap-1.5">
              {VIDEO_STYLES.map(s => (
                <button key={s} onClick={() => setVideoStyle(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${videoStyle === s ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'glass border-white/8 text-white/50 hover:text-white'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Motion Effects */}
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" /> Motion Effect
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {MOTION_EFFECTS.map(m => (
                <button key={m} onClick={() => setMotionEffect(m)} className={`px-2 py-2 rounded-lg text-[10px] font-medium transition-all border ${motionEffect === m ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'glass border-white/8 text-white/40 hover:text-white'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => { setGenerating(true); setTimeout(() => setGenerating(false), 4000); }}
            disabled={generating}
            className={`w-full btn-primary justify-center py-3.5 text-base rounded-xl ${generating ? 'opacity-75' : 'purple-glow'}`}
          >
            {generating ? (
              <><RefreshCw className="w-5 h-5 animate-spin" />Generating video...</>
            ) : (
              <><Video className="w-5 h-5" />Generate Video</>
            )}
          </button>
        </div>
      </div>

      {/* Right: Preview + Gallery */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Preview Player */}
        <div className="glass-card rounded-2xl overflow-hidden mb-6">
          <div className="relative aspect-video bg-[#0a0a14] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 border border-white/10">
                <Play className="w-7 h-7 text-white/30 ml-1" />
              </div>
              <p className="text-white/30 text-sm">{generating ? 'Generating your video...' : 'Your generated video will appear here'}</p>
              {generating && <div className="w-32 mx-auto mt-3 h-1 bg-white/10 rounded-full"><div className="h-1 bg-purple-500 rounded-full animate-pulse" style={{ width: '45%' }} /></div>}
            </div>
          </div>
          <div className="p-4 flex items-center justify-between border-t border-white/8">
            <div className="text-white/40 text-xs">No video selected</div>
            <div className="flex items-center gap-2">
              <button className="btn-ghost text-xs"><Download className="w-3.5 h-3.5" /> Download</button>
              <button className="btn-ghost text-xs">Share</button>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <h3 className="section-title text-sm mb-4">Video Library</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {videoCreations.map(c => (
            <div key={c.id} className="glass-card overflow-hidden cursor-pointer group">
              <div className="relative aspect-video">
                <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 glass px-2 py-0.5 rounded text-[10px] text-white/70">5s</div>
              </div>
              <div className="p-3">
                <p className="text-white text-xs font-medium truncate">{c.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-white/30 text-[11px]">{c.model}</span>
                  <button><MoreHorizontal className="w-4 h-4 text-white/30" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
