import { useState } from 'react';
import { Image, Video, Sparkles, Wand2, Layers, Scissors, TrendingUp, Users, Zap, ChevronRight, Box, Cpu } from 'lucide-react';
import type { Page } from '../../../types';

interface ToolsPageProps {
  onNavigate: (page: Page) => void;
}

interface Tool {
  id: string;
  icon: React.ElementType;
  name: string;
  description: string;
  category: string;
  badge?: string;
  color: string;
  credits: string;
  page: Page;
}

const TOOLS: Tool[] = [
  { id: '1', icon: Image, name: 'AI Image Generator', description: 'Generate stunning, photorealistic images from text prompts using state-of-the-art models.', category: 'Image', color: 'from-purple-500 to-pink-500', credits: '2–4 credits', page: 'ai-image', badge: 'Popular' },
  { id: '2', icon: TrendingUp, name: 'Image Enhancer', description: 'AI super-resolution that upscales and sharpens images up to 8× without quality loss.', category: 'Image', color: 'from-blue-500 to-cyan-500', credits: '1 credit', page: 'ai-image' },
  { id: '3', icon: Scissors, name: 'Background Remover', description: 'Precision AI background removal in seconds. Export as PNG with transparency.', category: 'Image', color: 'from-emerald-500 to-teal-500', credits: '1 credit', page: 'ai-image', badge: 'New' },
  { id: '4', icon: Layers, name: 'AI Upscaler', description: 'Upscale photos, illustrations, or AI generations up to 8× original resolution.', category: 'Image', color: 'from-orange-500 to-amber-500', credits: '2 credits', page: 'ai-image' },
  { id: '5', icon: Wand2, name: 'Style Transfer', description: 'Apply any artistic style to your photos using neural style transfer technology.', category: 'Image', color: 'from-rose-500 to-pink-500', credits: '2 credits', page: 'ai-image' },
  { id: '6', icon: Users, name: 'Face Enhancement', description: 'AI-powered facial retouching with skin texture refinement and natural-looking results.', category: 'Image', color: 'from-violet-500 to-purple-500', credits: '2 credits', page: 'ai-image' },
  { id: '7', icon: Sparkles, name: 'Image Animator', description: 'Transform static images into fluid, looping animations with controllable motion.', category: 'Video', color: 'from-cyan-500 to-blue-500', credits: '5 credits', page: 'ai-video', badge: 'Beta' },
  { id: '8', icon: Video, name: 'AI Video Generator', description: 'Create high-quality videos from text descriptions with cinematic quality.', category: 'Video', color: 'from-indigo-500 to-violet-500', credits: '8 credits', page: 'ai-video' },
  { id: '9', icon: Zap, name: 'Video Enhancer', description: 'Upscale and stabilize videos with temporal AI consistency models.', category: 'Video', color: 'from-amber-500 to-orange-500', credits: '6 credits', page: 'ai-video' },
  { id: '10', icon: Image, name: 'Video Effects', description: 'Apply cinematic color grading, visual effects, and filters to your videos.', category: 'Video', color: 'from-pink-500 to-rose-500', credits: '3 credits', page: 'ai-video' },
  { id: '11', icon: Cpu, name: 'Prompt Generator', description: 'Auto-generate optimized AI prompts for any model, style, or subject.', category: 'Creative', color: 'from-green-500 to-emerald-500', credits: '0 credits', page: 'ai-chat', badge: 'Free' },
  { id: '12', icon: Users, name: 'Character Creator', description: 'Design consistent AI characters with customizable traits for games and stories.', category: 'Creative', color: 'from-pink-500 to-rose-500', credits: '3 credits', page: 'ai-image' },
  { id: '13', icon: Sparkles, name: 'AI Designer', description: 'Generate complete design compositions with layout, typography, and visuals.', category: 'Creative', color: 'from-purple-500 to-indigo-500', credits: '4 credits', page: 'ai-image' },
  { id: '14', icon: Wand2, name: 'Concept Creator', description: 'Generate iterative concept variations from a single idea or reference image.', category: 'Creative', color: 'from-teal-500 to-cyan-500', credits: '3 credits', page: 'ai-image' },
  { id: '15', icon: Box, name: '3D Generator', description: 'Generate detailed 3D models from text or image inputs in multiple formats.', category: '3D', color: 'from-orange-500 to-red-500', credits: '6 credits', page: '3d-generator', badge: 'Beta' },
];

const CATEGORIES = ['All', 'Image', 'Video', 'Creative', '3D'];

export default function ToolsPage({ onNavigate }: ToolsPageProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  const filtered = TOOLS.filter(t => activeCategory === 'All' || t.category === activeCategory);

  const groupedByCategory = CATEGORIES.slice(1).reduce((acc, cat) => {
    const tools = filtered.filter(t => t.category === cat);
    if (tools.length > 0) acc[cat] = tools;
    return acc;
  }, {} as Record<string, Tool[]>);

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <Wand2 className="w-5 h-5 text-purple-400" />
        <h1 className="section-title text-2xl">AI Tools Center</h1>
      </div>
      <p className="text-white/40 text-sm mb-8">All creative AI tools in one place</p>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${activeCategory === cat ? 'bg-purple-600 border-purple-600 text-white' : 'glass border-white/8 text-white/50 hover:text-white hover:border-white/20'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Render all or by group */}
      {activeCategory === 'All' ? (
        Object.entries(groupedByCategory).map(([cat, tools]) => (
          <div key={cat} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="section-title text-lg">{cat} Tools</h2>
              <span className="tag tag-purple text-[10px]">{tools.length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tools.map(tool => (
                <ToolCard key={tool.id} tool={tool} hovered={hoveredTool === tool.id} onHover={setHoveredTool} onClick={() => onNavigate(tool.page)} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(tool => (
            <ToolCard key={tool.id} tool={tool} hovered={hoveredTool === tool.id} onHover={setHoveredTool} onClick={() => onNavigate(tool.page)} />
          ))}
        </div>
      )}
    </div>
  );
}

function ToolCard({ tool, hovered, onHover, onClick }: { tool: Tool; hovered: boolean; onHover: (id: string | null) => void; onClick: () => void }) {
  return (
    <div
      className="glass-card p-5 cursor-pointer group"
      onMouseEnter={() => onHover(tool.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} p-0.5`}>
          <div className="w-full h-full rounded-[10px] bg-[#0a0a14] flex items-center justify-center">
            <tool.icon className="w-6 h-6 text-white" />
          </div>
        </div>
        {tool.badge && <span className="tag tag-purple text-[10px]">{tool.badge}</span>}
      </div>
      <h3 className="text-white font-semibold text-sm mb-1.5">{tool.name}</h3>
      <p className="text-white/40 text-xs leading-relaxed mb-4">{tool.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-white/25 text-[11px]">{tool.credits}</span>
        <div className={`flex items-center gap-1 text-purple-400 text-xs font-medium transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          Open <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
