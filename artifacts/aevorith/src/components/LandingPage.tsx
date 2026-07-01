import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Video, Image, Cpu, Box, ChevronRight, Star, Play, ArrowRight, Check, Globe, Shield, Users, TrendingUp, Menu, X } from 'lucide-react';

interface LandingPageProps {
  onNavigate?: never;
}

const NAV_LINKS = ['Features', 'Showcase', 'Pricing', 'API'];

const STATS = [
  { value: '10M+', label: 'Creations Generated' },
  { value: '500K+', label: 'Active Creators' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'User Rating' },
];

const FEATURES = [
  { icon: Image, title: 'AI Image Generation', description: 'Generate stunning, photorealistic images from text prompts using the world\'s most advanced image models.', color: 'from-purple-500 to-pink-500', badge: 'Most Popular' },
  { icon: Video, title: 'AI Video Creation', description: 'Transform ideas into cinematic videos with physics-accurate motion and consistent character rendering.', color: 'from-blue-500 to-cyan-500', badge: 'New' },
  { icon: Sparkles, title: 'Image Animation', description: 'Breathe life into static images with fluid, looping animations powered by diffusion models.', color: 'from-emerald-500 to-teal-500' },
  { icon: Box, title: '3D Generation', description: 'Create detailed 3D models and assets from text or images, ready for games, AR, and product design.', color: 'from-orange-500 to-amber-500', badge: 'Beta' },
  { icon: Cpu, title: 'AI Chat Assistant', description: 'Get creative assistance, prompt engineering help, and AI-powered writing from your personal AI partner.', color: 'from-rose-500 to-pink-500' },
  { icon: Zap, title: 'Style Transfer', description: 'Apply any artistic style to your images instantly using neural style transfer at scale.', color: 'from-violet-500 to-purple-500' },
];

const PRICING_PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for exploring AI creativity',
    credits: '50 credits/month',
    features: ['50 image generations', '5 video generations', 'Standard quality', 'Community support', 'Basic templates'],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Creator',
    price: '$19',
    period: '/month',
    description: 'For serious creative professionals',
    credits: '1,000 credits/month',
    features: ['1,000 image generations', '100 video generations', 'HD quality output', '3D generation access', 'Priority generation', 'Premium templates', 'API access (limited)', 'Email support'],
    cta: 'Start Creating',
    highlighted: true,
  },
  {
    name: 'Professional',
    price: '$49',
    period: '/month',
    description: 'For studios and power users',
    credits: '5,000 credits/month',
    features: ['5,000 image generations', '500 video generations', '4K quality output', 'All AI models', 'Batch generation', 'Custom model fine-tuning', 'Full API access', 'Priority support'],
    cta: 'Go Professional',
    highlighted: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large teams and organizations',
    credits: 'Unlimited credits',
    features: ['Unlimited generations', 'White-label solution', 'Custom AI models', 'Dedicated infrastructure', 'SLA guarantee', 'Custom integrations', 'Dedicated support', 'Team management'],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const GALLERY_IMAGES = [
  { url: 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg?auto=compress&cs=tinysrgb&w=600', label: 'Cyberpunk Cityscape' },
  { url: 'https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg?auto=compress&cs=tinysrgb&w=600', label: 'Galactic Warrior' },
  { url: 'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=600', label: 'Forest Spirit' },
  { url: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=600', label: 'Crystal Cave' },
  { url: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=600', label: 'Particle Galaxy' },
  { url: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600', label: 'Futuristic Helmet' },
];

export default function LandingPage({ onNavigate: _onNavigate }: LandingPageProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#050709] overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-violet-900/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-800/10 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass border-b border-white/8 py-3' : 'py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white tracking-tight">AEVORITH</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <button key={link} className="btn-ghost text-sm">{link}</button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="btn-ghost text-sm">Sign In</button>
            <button onClick={() => navigate('/dashboard')} className="btn-primary text-sm">
              Get Started Free
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button className="md:hidden btn-ghost" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden glass-strong border-t border-white/8 px-6 py-4 space-y-2">
            {NAV_LINKS.map(link => (
              <button key={link} className="sidebar-item w-full">{link}</button>
            ))}
            <div className="pt-2 space-y-2">
              <button onClick={() => navigate('/dashboard')} className="btn-secondary w-full justify-center">Sign In</button>
              <button onClick={() => navigate('/dashboard')} className="btn-primary w-full justify-center">Get Started Free</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 border border-purple-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-white/70">Next-Generation AI Platform — Now Live</span>
            <ChevronRight className="w-3 h-3 text-white/40" />
          </div>

          <h1 className="font-display font-black text-6xl md:text-8xl leading-none mb-6">
            <span className="text-white">Create with</span>
            <br />
            <span className="gradient-text">Infinite AI Power</span>
          </h1>

          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create images, videos, and intelligent visuals with next-generation AI.
            Join 500,000+ creators shaping the future of digital content.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary text-base px-8 py-4 rounded-xl text-lg font-semibold purple-glow"
            >
              <Sparkles className="w-5 h-5" />
              Start Creating Free
            </button>
            <button
              onClick={() => navigate('/tools')}
              className="btn-secondary text-base px-8 py-4 rounded-xl text-lg font-semibold"
            >
              <Play className="w-5 h-5" />
              Explore Tools
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-20">
            {STATS.map((stat) => (
              <div key={stat.value} className="glass rounded-2xl p-4">
                <div className="text-2xl font-display font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-white/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero gallery strip */}
        <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden">
          <div className="flex gap-4 animate-[marquee_30s_linear_infinite] whitespace-nowrap">
            {[...GALLERY_IMAGES, ...GALLERY_IMAGES].map((img, i) => (
              <div key={i} className="inline-block w-48 h-56 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
                <img src={img.url} alt={img.label} className="w-full h-full object-cover opacity-60" />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050709] via-transparent to-transparent" />
        </div>
      </section>

      {/* Features */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="tag tag-purple mb-4">Capabilities</div>
            <h2 className="section-title text-4xl md:text-5xl mb-4">Everything You Need to Create</h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              One platform. Every AI creative tool. Unlimited possibilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="glass-card p-6 relative overflow-hidden group cursor-pointer" onClick={() => navigate('/dashboard')}>
                {feature.badge && (
                  <span className="absolute top-4 right-4 tag tag-purple text-[10px]">{feature.badge}</span>
                )}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-0.5 mb-4`}>
                  <div className="w-full h-full rounded-[10px] bg-[#0a0a14] flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                <div className="mt-4 flex items-center gap-1 text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Try it now <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Showcase */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="tag tag-blue mb-4">Gallery</div>
            <h2 className="section-title text-4xl md:text-5xl mb-4">AI-Generated Masterpieces</h2>
            <p className="text-white/50 text-lg">Created by our community using AEVORITH</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY_IMAGES.map((img, i) => (
              <div
                key={img.url}
                className={`relative group overflow-hidden rounded-2xl border border-white/8 cursor-pointer ${i === 0 || i === 4 ? 'md:row-span-2' : ''}`}
                style={{ height: i === 0 || i === 4 ? 'auto' : '240px' }}
                onClick={() => navigate('/dashboard')}
              >
                <img
                  src={img.url}
                  alt={img.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{ minHeight: '240px' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-medium text-sm">{img.label}</p>
                  <p className="text-white/60 text-xs">Generated with AEVORITH</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah K.', role: 'Digital Artist', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100', quote: 'AEVORITH transformed my creative workflow. I now produce 10x more content with stunning quality.' },
              { name: 'Marcus Chen', role: 'Game Developer', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100', quote: 'The 3D generation feature saved our studio months of work. Unbelievable quality from simple prompts.' },
              { name: 'Elena Ross', role: 'Creative Director', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100', quote: 'We use AEVORITH for all our campaign visuals now. The brand consistency and speed are unmatched.' },
            ].map((testimonial) => (
              <div key={testimonial.name} className="glass-card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-white font-medium text-sm">{testimonial.name}</div>
                    <div className="text-white/40 text-xs">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-32 relative" id="pricing">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="tag tag-green mb-4">Pricing</div>
            <h2 className="section-title text-4xl md:text-5xl mb-4">Simple, Transparent Pricing</h2>
            <p className="text-white/50 text-lg">Start free, scale as you grow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 flex flex-col ${
                  plan.highlighted
                    ? 'bg-gradient-to-b from-purple-900/40 to-purple-950/20 border-2 border-purple-500/50 shadow-[0_0_40px_rgba(147,51,234,0.2)]'
                    : 'glass-card'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="tag tag-purple px-4 py-1 text-xs">Most Popular</span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-display font-bold text-lg text-white mb-1">{plan.name}</h3>
                  <p className="text-white/40 text-xs mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-display font-black text-white">{plan.price}</span>
                    <span className="text-white/40 text-sm">{plan.period}</span>
                  </div>
                  <div className="mt-2 text-xs text-purple-300 font-medium">{plan.credits}</div>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-white/60">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/dashboard')}
                  className={plan.highlighted ? 'btn-primary justify-center' : 'btn-secondary justify-center'}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="glass-strong rounded-3xl p-12 neon-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent" />
            <div className="relative z-10">
              <Globe className="w-12 h-12 text-purple-400 mx-auto mb-6" />
              <h2 className="section-title text-4xl md:text-5xl mb-4">
                Start Creating Today
              </h2>
              <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
                Join over 500,000 creators already using AEVORITH to push the boundaries of AI creativity.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={() => navigate('/dashboard')} className="btn-primary text-base px-8 py-4 rounded-xl purple-glow">
                  <Sparkles className="w-5 h-5" />
                  Launch Platform
                </button>
                <button className="btn-secondary text-base px-8 py-4 rounded-xl">
                  <Shield className="w-5 h-5" />
                  View Documentation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-display font-bold text-lg text-white">AEVORITH</span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                Create images, videos, and intelligent visuals with next-generation AI.
              </p>
              <div className="flex items-center gap-3 mt-6">
                {[Users, TrendingUp, Globe, Shield].map((Icon, i) => (
                  <div key={i} className="w-9 h-9 glass rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                    <Icon className="w-4 h-4 text-white/50" />
                  </div>
                ))}
              </div>
            </div>

            {[
              { title: 'Product', links: ['AI Image', 'AI Video', 'AI Chat', '3D Generator', 'Templates', 'Models'] },
              { title: 'Developers', links: ['API Access', 'Documentation', 'SDKs', 'Webhooks', 'Status'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press', 'Contact', 'Legal'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(link => (
                    <li key={link}>
                      <button className="text-white/40 text-sm hover:text-white/70 transition-colors">{link}</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-sm">2024 AEVORITH. All rights reserved.</p>
            <div className="flex items-center gap-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(link => (
                <button key={link} className="text-white/30 text-sm hover:text-white/60 transition-colors">{link}</button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
