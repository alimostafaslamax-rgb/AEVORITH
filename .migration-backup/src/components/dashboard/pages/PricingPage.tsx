import { Check, Sparkles, Zap, Building2, Star } from 'lucide-react';
import type { Page } from '../../../types';

interface PricingPageProps {
  onNavigate: (page: Page) => void;
}

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for trying out AEVORITH',
    credits: '50 credits',
    color: 'text-white/60',
    features: [
      { text: '50 image generations/month', included: true },
      { text: '5 video generations/month', included: true },
      { text: 'Standard quality output', included: true },
      { text: 'Basic AI models', included: true },
      { text: 'Community support', included: true },
      { text: 'Basic templates (50+)', included: true },
      { text: 'HD quality output', included: false },
      { text: '3D generation', included: false },
      { text: 'Priority generation queue', included: false },
      { text: 'API access', included: false },
    ],
    cta: 'Current Plan',
    disabled: true,
    highlighted: false,
  },
  {
    id: 'creator',
    name: 'Creator',
    price: '$19',
    period: '/month',
    description: 'For serious creative professionals',
    credits: '1,000 credits',
    color: 'text-purple-400',
    features: [
      { text: '1,000 image generations/month', included: true },
      { text: '100 video generations/month', included: true },
      { text: 'HD quality output', included: true },
      { text: 'All standard AI models', included: true },
      { text: '3D generation access', included: true },
      { text: 'Priority generation queue', included: true },
      { text: 'Premium templates (500+)', included: true },
      { text: 'API access (100 req/day)', included: true },
      { text: 'Email support', included: true },
      { text: 'Custom model fine-tuning', included: false },
    ],
    cta: 'Upgrade to Creator',
    disabled: false,
    highlighted: true,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$49',
    period: '/month',
    description: 'For studios and power users',
    credits: '5,000 credits',
    color: 'text-blue-400',
    features: [
      { text: '5,000 image generations/month', included: true },
      { text: '500 video generations/month', included: true },
      { text: '4K quality output', included: true },
      { text: 'All AI models incl. exclusive', included: true },
      { text: 'Unlimited 3D generation', included: true },
      { text: 'Fastest generation queue', included: true },
      { text: 'All templates + community', included: true },
      { text: 'Full API access (1K req/day)', included: true },
      { text: 'Priority support 24/7', included: true },
      { text: 'Custom model fine-tuning', included: true },
    ],
    cta: 'Upgrade to Pro',
    disabled: false,
    highlighted: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large teams and organizations',
    credits: 'Unlimited credits',
    color: 'text-amber-400',
    features: [
      { text: 'Unlimited generations', included: true },
      { text: 'Unlimited video generation', included: true },
      { text: 'Maximum quality outputs', included: true },
      { text: 'All models + custom models', included: true },
      { text: 'White-label solution', included: true },
      { text: 'Dedicated infrastructure', included: true },
      { text: 'SLA guarantee (99.9%)', included: true },
      { text: 'Unlimited API access', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Custom integrations', included: true },
    ],
    cta: 'Contact Sales',
    disabled: false,
    highlighted: false,
  },
];

const ADD_ONS = [
  { name: 'Extra Credits Pack', price: '$9', desc: '500 additional credits, never expire', icon: Zap },
  { name: 'Premium Models Access', price: '$14/mo', desc: 'Unlock all exclusive AI models', icon: Star },
  { name: 'Storage Expansion', price: '$4/mo', desc: '100GB cloud storage for creations', icon: Sparkles },
];

export default function PricingPage({ onNavigate: _onNavigate }: PricingPageProps) {
  return (
    <div className="p-6 animate-fade-in">
      <div className="text-center mb-10">
        <div className="tag tag-purple mx-auto mb-3">Pricing</div>
        <h1 className="section-title text-3xl mb-2">Choose Your Plan</h1>
        <p className="text-white/50">Upgrade anytime. Cancel anytime. No hidden fees.</p>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-12">
        {PLANS.map(plan => (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-2xl p-6 ${
              plan.highlighted
                ? 'bg-gradient-to-b from-purple-900/40 to-purple-950/20 border-2 border-purple-500/50 shadow-[0_0_40px_rgba(147,51,234,0.2)]'
                : 'glass-card'
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="tag tag-purple px-4 py-1 text-xs">Current Recommendation</span>
              </div>
            )}

            <div className="mb-5">
              <h3 className="font-display font-bold text-lg text-white mb-0.5">{plan.name}</h3>
              <p className="text-white/40 text-xs mb-3">{plan.description}</p>
              <div className="flex items-baseline gap-1">
                <span className={`text-3xl font-display font-black ${plan.color}`}>{plan.price}</span>
                <span className="text-white/30 text-sm">{plan.period}</span>
              </div>
              <div className="mt-1.5 text-xs font-semibold text-white/50">{plan.credits}/month</div>
            </div>

            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map(feature => (
                <li key={feature.text} className={`flex items-start gap-2 text-xs ${feature.included ? 'text-white/70' : 'text-white/25 line-through'}`}>
                  <Check className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${feature.included ? 'text-green-400' : 'text-white/20'}`} />
                  {feature.text}
                </li>
              ))}
            </ul>

            <button
              onClick={plan.id !== 'free' ? () => {} : undefined}
              disabled={plan.disabled}
              className={
                plan.highlighted
                  ? 'btn-primary justify-center w-full'
                  : plan.disabled
                  ? 'btn-ghost justify-center w-full opacity-50 cursor-not-allowed'
                  : plan.id === 'enterprise'
                  ? 'btn-secondary justify-center w-full border-amber-500/30 text-amber-300'
                  : 'btn-secondary justify-center w-full'
              }
            >
              {plan.id === 'enterprise' && <Building2 className="w-4 h-4" />}
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Add-ons */}
      <div className="mb-10">
        <h2 className="section-title text-lg mb-4">Add-ons</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ADD_ONS.map(addon => (
            <div key={addon.name} className="glass-card p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center flex-shrink-0">
                <addon.icon className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm">{addon.name}</div>
                <div className="text-white/40 text-xs mt-0.5">{addon.desc}</div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-purple-400 font-bold text-sm">{addon.price}</div>
                <button className="text-xs text-white/50 hover:text-white mt-1 transition-colors">Add</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="section-title text-lg mb-4">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { q: 'Do credits roll over?', a: 'Credits reset monthly. Unused credits do not carry over, but Add-on credit packs never expire.' },
            { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. You retain access until the end of your billing period.' },
            { q: 'What counts as 1 credit?', a: 'One standard-quality image generation = 1 credit. HD = 2 credits. Video = 6–10 credits depending on duration.' },
            { q: 'Is there a free trial?', a: 'All new accounts start with 50 free credits to explore the platform before upgrading.' },
          ].map(faq => (
            <div key={faq.q} className="glass-card p-4">
              <h4 className="text-white font-semibold text-sm mb-2">{faq.q}</h4>
              <p className="text-white/50 text-xs leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
