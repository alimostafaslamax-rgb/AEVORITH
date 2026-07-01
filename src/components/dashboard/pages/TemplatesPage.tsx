import { useState } from 'react';
import { Search, Sparkles, Users, ArrowRight } from 'lucide-react';
import { TEMPLATES } from '../../../data';

const CATEGORIES = ['All', 'AI Art', 'Social Media', 'Marketing', 'Characters', 'Product Design', 'Cinematic Scenes'];

interface TemplatesPageProps {
  onNavigate: (page: import('../../../types').Page) => void;
}

export default function TemplatesPage({ onNavigate }: TemplatesPageProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = TEMPLATES.filter(t => {
    const matchesCat = category === 'All' || t.category === category;
    const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h1 className="section-title text-2xl">Templates</h1>
        </div>
        <p className="text-white/40 text-sm">Start with a professionally crafted template</p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-dark pl-9"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${category === cat ? 'bg-purple-600 border-purple-600 text-white' : 'glass border-white/8 text-white/50 hover:text-white hover:border-white/20'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(template => (
          <div key={template.id} className="glass-card overflow-hidden group cursor-pointer">
            <div className="relative h-48">
              <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="tag tag-purple text-[10px]">{template.category}</span>
              </div>
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => onNavigate('ai-image')}
                  className="btn-primary text-sm gap-2 scale-90 group-hover:scale-100 transition-transform"
                >
                  <Sparkles className="w-4 h-4" />
                  Use Template
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-white font-semibold text-sm mb-1">{template.name}</h3>
              <p className="text-white/40 text-xs leading-relaxed mb-3">{template.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-white/30 text-xs">
                  <Users className="w-3.5 h-3.5" />
                  {template.uses.toLocaleString()} uses
                </div>
                <button
                  onClick={() => onNavigate('ai-image')}
                  className="flex items-center gap-1 text-purple-400 text-xs font-medium hover:text-purple-300 transition-colors"
                >
                  Use <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-white/15 mx-auto mb-3" />
          <p className="text-white/40">No templates found</p>
        </div>
      )}
    </div>
  );
}
