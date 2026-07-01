import { useState } from 'react';
import { Cpu, Zap, Star, CheckCircle2, Search } from 'lucide-react';
import { AI_MODELS } from '../../../data';
import type { AIModel } from '../../../types';

const CATEGORIES = ['All', 'Image', 'Video', 'Animation'] as const;

function SpeedBar({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(10)].map((_, i) => (
        <div key={i} className={`h-1.5 flex-1 rounded-full ${i < value ? 'bg-blue-400' : 'bg-white/10'}`} />
      ))}
    </div>
  );
}

function QualityBar({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(10)].map((_, i) => (
        <div key={i} className={`h-1.5 flex-1 rounded-full ${i < value ? 'bg-purple-400' : 'bg-white/10'}`} />
      ))}
    </div>
  );
}

export default function ModelsPage() {
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('All');
  const [selected, setSelected] = useState('flux-ultra');
  const [search, setSearch] = useState('');

  const filtered = AI_MODELS.filter(m => {
    const matchesCat = category === 'All' || m.category.toLowerCase() === category.toLowerCase();
    const matchesSearch = !search || m.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const selectedModel = AI_MODELS.find(m => m.id === selected);

  const categoryColor = (cat: AIModel['category']) => {
    if (cat === 'image') return 'tag-purple';
    if (cat === 'video') return 'tag-blue';
    return 'tag-green';
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Model list */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            <h1 className="section-title text-2xl">AI Models</h1>
          </div>
          <p className="text-white/40 text-sm mb-6">Select the AI model that best suits your creative needs</p>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input type="text" placeholder="Search models..." value={search} onChange={e => setSearch(e.target.value)} className="input-dark pl-9" />
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap mb-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${category === cat ? 'bg-purple-600 border-purple-600 text-white' : 'glass border-white/8 text-white/50 hover:text-white'}`}
              >
                {cat} Models
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map(model => (
              <div
                key={model.id}
                onClick={() => setSelected(model.id)}
                className={`glass-card p-4 cursor-pointer transition-all ${selected === model.id ? 'border-purple-500/50 bg-purple-500/8' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${selected === model.id ? 'bg-purple-500/20 border border-purple-500/40' : 'bg-white/5 border border-white/10'}`}>
                    <Cpu className={`w-5 h-5 ${selected === model.id ? 'text-purple-400' : 'text-white/40'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold text-sm">{model.name}</h3>
                      {model.badge && <span className="tag tag-purple text-[9px]">{model.badge}</span>}
                      <span className={`tag text-[9px] ${categoryColor(model.category)}`}>{model.category}</span>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed mb-3">{model.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white/40 text-[11px] flex items-center gap-1"><Zap className="w-3 h-3 text-blue-400" /> Speed</span>
                          <span className="text-blue-400 text-[11px] font-medium">{model.speed}/10</span>
                        </div>
                        <SpeedBar value={model.speed} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white/40 text-[11px] flex items-center gap-1"><Star className="w-3 h-3 text-purple-400" /> Quality</span>
                          <span className="text-purple-400 text-[11px] font-medium">{model.quality}/10</span>
                        </div>
                        <QualityBar value={model.quality} />
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {selected === model.id ? (
                      <CheckCircle2 className="w-5 h-5 text-purple-400" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-white/20" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected model detail */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="glass-card p-5 sticky top-0">
            <h3 className="section-title text-sm mb-4">Selected Model</h3>
            {selectedModel && (
              <>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-700/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
                  <Cpu className="w-8 h-8 text-purple-400" />
                </div>
                <h4 className="text-white font-bold text-center mb-1">{selectedModel.name}</h4>
                {selectedModel.badge && <div className="flex justify-center mb-3"><span className="tag tag-purple text-[10px]">{selectedModel.badge}</span></div>}
                <p className="text-white/50 text-xs text-center leading-relaxed mb-5">{selectedModel.description}</p>

                <div className="space-y-4 mb-5">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-white/50 text-xs">Speed</span>
                      <span className="text-blue-400 text-xs font-semibold">{selectedModel.speed}/10</span>
                    </div>
                    <SpeedBar value={selectedModel.speed} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-white/50 text-xs">Quality</span>
                      <span className="text-purple-400 text-xs font-semibold">{selectedModel.quality}/10</span>
                    </div>
                    <QualityBar value={selectedModel.quality} />
                  </div>
                </div>

                <div className="space-y-2 mb-5">
                  {[
                    { label: 'Category', value: selectedModel.category },
                    { label: 'Cost per image', value: selectedModel.quality >= 9 ? '4 credits' : '2 credits' },
                    { label: 'Max resolution', value: selectedModel.category === 'image' ? '2048×2048' : 'N/A' },
                    { label: 'Avg. generation', value: selectedModel.speed >= 8 ? '< 10s' : selectedModel.speed >= 5 ? '15-30s' : '30-60s' },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between">
                      <span className="text-white/40 text-xs">{row.label}</span>
                      <span className="text-white/80 text-xs font-medium capitalize">{row.value}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full btn-primary justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                  Use This Model
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
