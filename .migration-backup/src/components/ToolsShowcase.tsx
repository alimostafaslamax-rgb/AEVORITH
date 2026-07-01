import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Image, Video, Box, Cpu, Zap, Wand2, Layers, Scissors, TrendingUp, Users, Play, Star } from 'lucide-react';

interface ToolsShowcaseProps {
  onNavigate?: never;
}

const ALL_TOOLS = [
  { icon: Image, name: 'AI Image Generator', desc: 'Generate stunning images from text with industry-leading AI models.', category: 'Image', color: 'from-purple-500 to-pink-500', badge: 'Popular', users: '320K' },
  { icon: TrendingUp, name: 'Image Enhancer', desc: 'Upscale and enhance any image with AI-powered super-resolution.', category: 'Image', color: 'from-blue-500 to-cyan-500', users: '120K' },
  { icon: Scissors, name: 'Background Remover', desc: 'Instantly remove backgrounds from any image with precision AI.', category: 'Image', color: 'from-emerald-500 to-teal-500', badge: 'New', users: '240K' },
  { icon: Layers, name: 'AI Upscaler', desc: 'Upscale images up to 8x while preserving every fine detail.', category: 'Image', color: 'from-orange-500 to-amber-500', users: '95K' },
  { icon: Wand2, name: 'Style Transfer', desc: 'Apply any artistic style to photos using neural networks.', category: 'Image', color: 'from-rose-500 to-pink-500', users: '78K' },
  { icon: Sparkles, name: 'Face Enhancement', desc: 'AI-powered facial retouching and skin texture refinement.', category: 'Image', color: 'from-violet-500 to-purple-500', users: '155K' },
  { icon: Play, name: 'Image Animator', desc: 'Animate still images with realistic motion and dynamics.', category: 'Video', color: 'from-cyan-500 to-blue-500', badge: 'Beta', users: '62K' },
  { icon: Video, name: 'AI Video Generator', desc: 'Create cinematic videos from text descriptions.', category: 'Video', color: 'from-indigo-500 to-violet-500', users: '88K' },
  { icon: Zap, name: 'Video Enhancer', desc: 'Upscale and stabilize videos with temporal AI models.', category: 'Video', color: 'from-amber-500 to-orange-500', users: '43K' },
  { icon: Cpu, name: 'Prompt Generator', desc: 'Generate optimized prompts for any AI model automatically.', category: 'Creative', color: 'from-green-500 to-emerald-500', users: '210K' },
  { icon: Users, name: 'Character Creator', desc: 'Design consistent AI characters for games, stories, and art.', category: 'Creative', color: 'from-pink-500 to-rose-500', users: '135K' },
  { icon: Box, name: '3D Generator', desc: 'Generate 3D assets from text or image inputs.', category: '3D', color: 'from-teal-500 to-cyan-500', badge: 'Beta', users: '31K' },
];

const CATEGORIES = ['All', 'Image', 'Video', 'Creative', '3D'];

export default function ToolsShowcase({ onNavigate: _onNavigate }: ToolsShowcaseProps) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#050709]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-purple-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-violet-900/15 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="glass border-b border-white/8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="btn-ghost">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="h-5 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-bold text-white">AEVORITH</span>
            </div>
          </div>
          <button onClick={() => navigate('/dashboard')} className="btn-primary text-sm">
            Launch Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="tag tag-purple mb-4">AI Tools</div>
          <h1 className="font-display font-black text-5xl md:text-6xl mb-4">
            <span className="gradient-text">AI Tool Showcase</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Explore every AI tool available on the AEVORITH platform. Built for creators, studios, and developers.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-2 flex-wrap justify-center mb-12">
          {CATEGORIES.map(cat => (
            <button key={cat} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${cat === 'All' ? 'bg-purple-600 text-white' : 'glass text-white/60 hover:text-white hover:bg-white/10'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {ALL_TOOLS.map((tool) => (
            <div key={tool.name} className="glass-card p-6 cursor-pointer group" onClick={() => navigate('/dashboard')}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} p-0.5`}>
                  <div className="w-full h-full rounded-[10px] bg-[#0a0a14] flex items-center justify-center">
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {tool.badge && <span className="tag tag-purple text-[10px]">{tool.badge}</span>}
                  <span className="tag tag-blue text-[10px]">{tool.category}</span>
                </div>
              </div>
              <h3 className="font-display font-bold text-white mb-2">{tool.name}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">{tool.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-white/30 text-xs">
                  <Users className="w-3.5 h-3.5" />
                  {tool.users} users
                </div>
                <div className="flex items-center gap-1 text-yellow-400 text-xs">
                  <Star className="w-3.5 h-3.5 fill-yellow-400" />
                  4.9
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="glass-strong rounded-3xl p-12 text-center neon-border">
          <h2 className="section-title text-3xl mb-3">Ready to create?</h2>
          <p className="text-white/50 mb-8">All these tools are available inside the AEVORITH dashboard.</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary text-base px-8 py-4 rounded-xl purple-glow">
            <Sparkles className="w-5 h-5" />
            Open Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
