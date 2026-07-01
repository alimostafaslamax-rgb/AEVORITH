import { useState } from 'react';
import { Box, Upload, RotateCcw, Download, Layers, Wand2, RefreshCw, Image } from 'lucide-react';

const MATERIAL_OPTIONS = ['Metallic', 'Matte', 'Glass', 'Wood', 'Stone', 'Plastic', 'Fabric', 'Holographic'];
const EXPORT_FORMATS = ['GLB', 'OBJ', 'FBX', 'USD', 'GLTF', 'STL'];
const MODES = [
  { id: 'text', label: 'Text to 3D', icon: Wand2 },
  { id: 'image', label: 'Image to 3D', icon: Image },
];

const SAMPLE_OBJECTS = [
  { name: 'Futuristic Helmet', thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=300', polys: '42K', time: '2 hours ago' },
  { name: 'Crystal Sword', thumbnail: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=300', polys: '18K', time: '1 day ago' },
  { name: 'Space Capsule', thumbnail: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=300', polys: '65K', time: '2 days ago' },
];

export default function ThreeDPage() {
  const [mode, setMode] = useState('text');
  const [prompt, setPrompt] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('Metallic');
  const [exportFormat, setExportFormat] = useState('GLB');
  const [generating, setGenerating] = useState(false);

  return (
    <div className="flex h-full min-h-0 animate-fade-in">
      {/* Left controls */}
      <div className="w-80 flex-shrink-0 border-r border-white/8 overflow-y-auto bg-[#060810]/50">
        <div className="p-5 space-y-5">
          <div>
            <h2 className="section-title text-sm mb-1">3D Generator</h2>
            <p className="text-white/40 text-xs">Create 3D assets from text or images with AI</p>
          </div>

          {/* Mode */}
          <div className="grid grid-cols-2 gap-1.5 p-1 glass rounded-xl">
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === m.id ? 'bg-purple-600 text-white' : 'text-white/50 hover:text-white'}`}
              >
                <m.icon className="w-4 h-4" />
                {m.label}
              </button>
            ))}
          </div>

          {mode === 'text' ? (
            <div>
              <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Object Description</label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="A futuristic combat helmet with glowing LED patterns and visor..."
                rows={4}
                className="input-dark resize-none"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Reference Image</label>
              <button className="w-full glass border border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-purple-500/40 transition-all">
                <Upload className="w-6 h-6 text-white/30" />
                <span className="text-sm text-white/40">Upload image to convert to 3D</span>
                <span className="text-xs text-white/25">PNG, JPG, WebP supported</span>
              </button>
            </div>
          )}

          {/* Materials */}
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Material
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {MATERIAL_OPTIONS.map(mat => (
                <button
                  key={mat}
                  onClick={() => setSelectedMaterial(mat)}
                  className={`px-2 py-2 rounded-lg text-[10px] font-medium transition-all border ${selectedMaterial === mat ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'glass border-white/8 text-white/40 hover:text-white'}`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* Export Format */}
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export Format
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {EXPORT_FORMATS.map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setExportFormat(fmt)}
                  className={`px-2 py-2 rounded-lg text-xs font-medium transition-all border ${exportFormat === fmt ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'glass border-white/8 text-white/50 hover:text-white'}`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => { setGenerating(true); setTimeout(() => setGenerating(false), 5000); }}
            disabled={generating}
            className={`w-full btn-primary justify-center py-3.5 text-base rounded-xl ${generating ? 'opacity-75' : 'purple-glow'}`}
          >
            {generating ? (
              <><RefreshCw className="w-5 h-5 animate-spin" />Generating 3D...</>
            ) : (
              <><Box className="w-5 h-5" />Generate 3D Model</>
            )}
          </button>

          {generating && (
            <div className="glass-card p-4 rounded-xl">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-white/60">Generating geometry...</span>
                <span className="text-purple-400">45%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-purple-500 to-violet-400 h-1.5 rounded-full transition-all duration-1000" style={{ width: '45%' }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3D Viewport */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Viewport */}
        <div className="flex-1 glass-card m-4 mb-0 rounded-2xl overflow-hidden relative flex items-center justify-center bg-[#080b14]">
          {/* Grid background */}
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(147,51,234,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="text-center relative z-10">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-700/20 border border-purple-500/30 flex items-center justify-center">
                <Box className="w-10 h-10 text-purple-400/50" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500/40 rounded-full blur-sm" />
            </div>
            <p className="text-white/30 text-sm">3D Preview will render here</p>
            <p className="text-white/15 text-xs mt-1">Generate a model to view it in 3D</p>
          </div>

          {/* Viewport controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {[RotateCcw, Download].map((Icon, i) => (
              <button key={i} className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors border border-white/8">
                <Icon className="w-4 h-4 text-white/50" />
              </button>
            ))}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <div className="flex gap-2">
              {['Wireframe', 'Solid', 'Material'].map(view => (
                <button key={view} className="glass px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white transition-colors border border-white/8">
                  {view}
                </button>
              ))}
            </div>
            <button className="btn-primary text-xs py-1.5 px-3 gap-1.5">
              <Download className="w-3.5 h-3.5" />
              Export {exportFormat}
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="p-4">
          <h3 className="section-title text-sm mb-3">Recent 3D Models</h3>
          <div className="grid grid-cols-3 gap-3">
            {SAMPLE_OBJECTS.map(obj => (
              <div key={obj.name} className="glass-card overflow-hidden cursor-pointer group">
                <div className="relative h-28">
                  <img src={obj.thumbnail} alt={obj.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2">
                    <span className="tag tag-purple text-[9px]">{obj.polys} polys</span>
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="text-white text-xs font-medium truncate">{obj.name}</p>
                  <p className="text-white/30 text-[11px]">{obj.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
