import { useState } from 'react';
import { Code2, Copy, Eye, EyeOff, Plus, RefreshCw, TrendingUp, Clock, CheckCircle2, ExternalLink } from 'lucide-react';

const ENDPOINTS = [
  { method: 'POST', path: '/v1/images/generate', description: 'Generate an image from a text prompt', credits: 2 },
  { method: 'POST', path: '/v1/videos/generate', description: 'Generate a video from a text prompt', credits: 8 },
  { method: 'POST', path: '/v1/images/enhance', description: 'Enhance and upscale an image', credits: 1 },
  { method: 'POST', path: '/v1/images/remove-background', description: 'Remove background from an image', credits: 1 },
  { method: 'POST', path: '/v1/3d/generate', description: 'Generate a 3D model from text or image', credits: 6 },
  { method: 'GET', path: '/v1/models', description: 'List all available AI models', credits: 0 },
  { method: 'GET', path: '/v1/generations/{id}', description: 'Get the status of a generation', credits: 0 },
];

const USAGE_STATS = [
  { label: 'Total Requests', value: '1,284', change: '+12% vs last month', color: 'text-blue-400' },
  { label: 'Credits Used', value: '4,210', change: '790 remaining', color: 'text-purple-400' },
  { label: 'Avg. Latency', value: '2.4s', change: 'p99: 8.1s', color: 'text-green-400' },
  { label: 'Success Rate', value: '99.7%', change: 'Last 30 days', color: 'text-emerald-400' },
];

const SAMPLE_CODE = `import requests

api_key = "ak-xxxxxxxxxxxxxxxxxxxxxxxx"

response = requests.post(
    "https://api.aevorith.ai/v1/images/generate",
    headers={"Authorization": f"Bearer {api_key}"},
    json={
        "prompt": "A cyberpunk city at night, neon lights",
        "model": "flux-ultra",
        "width": 1024,
        "height": 1024,
        "quality": "high"
    }
)

result = response.json()
print(result["image_url"])`;

export default function APIAccessPage() {
  const [showKey, setShowKey] = useState(false);
  const [keyCopied, setKeyCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'keys' | 'docs' | 'usage'>('overview');

  const apiKey = 'ak-7f4b9e2c1d8a3f6e0b5c7d9e2a4f1b8d';
  const maskedKey = 'ak-' + '•'.repeat(28);

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <Code2 className="w-5 h-5 text-purple-400" />
        <h1 className="section-title text-2xl">API Access</h1>
      </div>
      <p className="text-white/40 text-sm mb-6">Integrate AEVORITH AI into your applications</p>

      {/* Tabs */}
      <div className="flex gap-1 glass rounded-xl p-1 w-fit mb-8">
        {(['overview', 'keys', 'docs', 'usage'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-purple-600 text-white' : 'text-white/50 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {USAGE_STATS.map(stat => (
              <div key={stat.label} className="stat-card">
                <div className={`text-2xl font-display font-bold ${stat.color} mb-0.5`}>{stat.value}</div>
                <div className="text-white/60 text-sm font-medium">{stat.label}</div>
                <div className="text-white/30 text-xs mt-1">{stat.change}</div>
              </div>
            ))}
          </div>

          {/* API Key */}
          <div className="glass-card p-5">
            <h3 className="section-title text-sm mb-4">Your API Key</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-3 glass rounded-xl px-4 py-3 border border-white/8 font-mono text-sm">
                <span className="text-white/70 flex-1 truncate">{showKey ? apiKey : maskedKey}</span>
              </div>
              <button onClick={() => setShowKey(!showKey)} className="btn-ghost p-2.5">
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={copyKey} className={`btn-secondary text-sm gap-1.5 px-4 ${keyCopied ? 'border-green-500/50 text-green-400' : ''}`}>
                {keyCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {keyCopied ? 'Copied!' : 'Copy'}
              </button>
              <button className="btn-ghost p-2.5"><RefreshCw className="w-4 h-4" /></button>
            </div>
            <p className="text-white/30 text-xs mt-3">Keep your API key secure. Never share it publicly or commit it to version control.</p>
          </div>

          {/* Sample code */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title text-sm">Quick Start</h3>
              <div className="flex gap-2">
                {['Python', 'Node.js', 'cURL'].map((lang, i) => (
                  <button key={lang} className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${i === 0 ? 'bg-purple-600 border-purple-600 text-white' : 'glass border-white/10 text-white/50 hover:text-white'}`}>
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            <pre className="text-sm text-white/70 font-mono bg-black/30 rounded-xl p-4 overflow-x-auto leading-relaxed">
              <code>{SAMPLE_CODE}</code>
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'docs' && (
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h3 className="section-title text-sm mb-4">API Endpoints</h3>
            <div className="space-y-3">
              {ENDPOINTS.map(ep => (
                <div key={ep.path} className="flex items-center gap-4 p-3 glass rounded-xl border border-white/6 hover:border-white/12 transition-colors">
                  <span className={`tag text-[10px] flex-shrink-0 font-mono ${ep.method === 'POST' ? 'tag-purple' : 'tag-blue'}`}>{ep.method}</span>
                  <code className="text-white/80 text-sm font-mono flex-1 truncate">{ep.path}</code>
                  <span className="text-white/40 text-xs hidden md:block flex-1 truncate">{ep.description}</span>
                  <span className="text-white/30 text-xs flex-shrink-0">{ep.credits > 0 ? `${ep.credits} cr` : 'Free'}</span>
                  <ExternalLink className="w-4 h-4 text-white/20 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'keys' && (
        <div className="space-y-4">
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title text-sm">API Keys</h3>
              <button className="btn-primary text-sm gap-1.5">
                <Plus className="w-4 h-4" />
                New Key
              </button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Production Key', created: 'Jun 1, 2024', lastUsed: '2 hours ago', requests: 1284 },
                { name: 'Development Key', created: 'May 15, 2024', lastUsed: '1 day ago', requests: 342 },
              ].map(key => (
                <div key={key.name} className="flex items-center gap-4 p-4 glass rounded-xl border border-white/8">
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">{key.name}</div>
                    <div className="text-white/40 text-xs mt-0.5">Created {key.created} · Last used {key.lastUsed}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm font-semibold">{key.requests.toLocaleString()}</div>
                    <div className="text-white/30 text-xs">requests</div>
                  </div>
                  <button className="btn-ghost text-xs text-red-400 hover:text-red-300">Revoke</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'usage' && (
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h3 className="section-title text-sm mb-4">Request Limits</h3>
            <div className="space-y-4">
              {[
                { label: 'Requests per minute', used: 28, limit: 60, color: 'bg-blue-400' },
                { label: 'Requests per hour', used: 284, limit: 1000, color: 'bg-purple-400' },
                { label: 'Credits per month', used: 4210, limit: 5000, color: 'bg-emerald-400' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-white/60 text-sm">{item.label}</span>
                    <span className="text-white text-sm font-mono">{item.used.toLocaleString()} / {item.limit.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full transition-all`} style={{ width: `${(item.used / item.limit) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <h3 className="section-title text-sm">Recent Activity</h3>
            </div>
            <div className="space-y-2">
              {[
                { endpoint: 'POST /v1/images/generate', status: 200, latency: '2.1s', time: '2 min ago' },
                { endpoint: 'GET /v1/generations/abc123', status: 200, latency: '0.1s', time: '5 min ago' },
                { endpoint: 'POST /v1/images/enhance', status: 200, latency: '1.4s', time: '12 min ago' },
                { endpoint: 'POST /v1/videos/generate', status: 200, latency: '18.2s', time: '1 hour ago' },
                { endpoint: 'POST /v1/images/generate', status: 422, latency: '0.3s', time: '2 hours ago' },
              ].map((req, i) => (
                <div key={i} className="flex items-center gap-4 p-3 glass rounded-xl border border-white/6">
                  <span className={`tag text-[10px] font-mono flex-shrink-0 ${req.status === 200 ? 'tag-green' : 'tag-pink'}`}>{req.status}</span>
                  <code className="text-white/70 text-xs flex-1 truncate font-mono">{req.endpoint}</code>
                  <span className="text-white/40 text-xs flex-shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />{req.latency}
                  </span>
                  <span className="text-white/25 text-xs flex-shrink-0">{req.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
