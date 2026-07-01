import type { Creation, AIModel, Template, Notification } from './types';

export const MOCK_CREATIONS: Creation[] = [
  { id: '1', type: 'image', title: 'Cyberpunk City Nightscape', thumbnail: 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg?auto=compress&cs=tinysrgb&w=400', prompt: 'Neon-lit cyberpunk city at night, rain reflections', model: 'Flux Ultra', createdAt: '2 hours ago', liked: true },
  { id: '2', type: 'image', title: 'Ancient Forest Spirit', thumbnail: 'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=400', prompt: 'Mystical ancient forest spirit glowing green', model: 'Stable Diffusion XL', createdAt: '4 hours ago', liked: false },
  { id: '3', type: 'image', title: 'Galactic Warrior Portrait', thumbnail: 'https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg?auto=compress&cs=tinysrgb&w=400', prompt: 'Futuristic galactic warrior in cosmic armor', model: 'Flux Pro', createdAt: '6 hours ago', liked: true },
  { id: '4', type: 'image', title: 'Crystal Cave Interior', thumbnail: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400', prompt: 'Crystal cave with purple glowing minerals', model: 'DALL-E 3', createdAt: '1 day ago', liked: false },
  { id: '5', type: 'video', title: 'Ocean Storm Timelapse', thumbnail: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=400', prompt: 'Dramatic ocean storm waves crashing', model: 'Sora v2', createdAt: '1 day ago', liked: true },
  { id: '6', type: 'video', title: 'Northern Lights Dance', thumbnail: 'https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg?auto=compress&cs=tinysrgb&w=400', prompt: 'Aurora borealis dancing across night sky', model: 'Runway Gen-3', createdAt: '2 days ago', liked: false },
  { id: '7', type: '3d', title: 'Futuristic Helmet 3D', thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400', prompt: 'Sci-fi combat helmet with LED accents', model: 'TripoSR', createdAt: '3 days ago', liked: true },
  { id: '8', type: 'animation', title: 'Particle Galaxy Loop', thumbnail: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=400', prompt: 'Swirling particle galaxy infinite loop', model: 'AnimateDiff', createdAt: '3 days ago', liked: false },
];

export const AI_MODELS: AIModel[] = [
  { id: 'flux-ultra', name: 'Flux Ultra', description: 'Highest quality image generation with exceptional detail and photorealism', category: 'image', speed: 3, quality: 10, badge: 'Best' },
  { id: 'flux-pro', name: 'Flux Pro', description: 'Professional-grade image generation balancing speed and quality', category: 'image', speed: 6, quality: 9 },
  { id: 'flux-dev', name: 'Flux Dev', description: 'Fast development model for rapid prototyping and iteration', category: 'image', speed: 9, quality: 7, badge: 'Fast' },
  { id: 'sdxl', name: 'Stable Diffusion XL', description: 'Open-source flagship with extensive style control and customization', category: 'image', speed: 7, quality: 8 },
  { id: 'dalle3', name: 'DALL-E 3', description: 'OpenAI\'s latest with superior text rendering and prompt adherence', category: 'image', speed: 5, quality: 9 },
  { id: 'midjourney-v6', name: 'Midjourney v6', description: 'Aesthetic-focused model renowned for artistic and creative outputs', category: 'image', speed: 4, quality: 10, badge: 'Popular' },
  { id: 'sora-v2', name: 'Sora v2', description: 'World-class video generation with physics-accurate motion', category: 'video', speed: 2, quality: 10, badge: 'New' },
  { id: 'runway-gen3', name: 'Runway Gen-3', description: 'Professional video generation with consistent character rendering', category: 'video', speed: 5, quality: 9 },
  { id: 'pika-2', name: 'Pika 2.0', description: 'Creative video synthesis with dynamic motion effects', category: 'video', speed: 7, quality: 8 },
  { id: 'kling', name: 'Kling AI', description: 'Chinese video model with smooth, cinematic output quality', category: 'video', speed: 6, quality: 8 },
  { id: 'animatediff', name: 'AnimateDiff', description: 'Transforms static images into fluid looping animations', category: 'animation', speed: 8, quality: 8, badge: 'Popular' },
  { id: 'stable-video', name: 'Stable Video Diffusion', description: 'Stabilized animation from single images with temporal consistency', category: 'animation', speed: 7, quality: 8 },
];

export const TEMPLATES: Template[] = [
  { id: '1', name: 'Cyberpunk Portrait', description: 'High-contrast neon portrait with futuristic cyberpunk aesthetics', category: 'AI Art', thumbnail: 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg?auto=compress&cs=tinysrgb&w=400', uses: 12840 },
  { id: '2', name: 'Instagram Product Shot', description: 'Clean studio-style product photography with gradient backgrounds', category: 'Social Media', thumbnail: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400', uses: 9200 },
  { id: '3', name: 'Movie Poster Template', description: 'Cinematic poster layout with dramatic lighting and typography', category: 'Cinematic Scenes', thumbnail: 'https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg?auto=compress&cs=tinysrgb&w=400', uses: 7600 },
  { id: '4', name: 'Fantasy Character Sheet', description: 'Full character concept art with weapon and ability showcase', category: 'Characters', thumbnail: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=400', uses: 18300 },
  { id: '5', name: 'Ad Banner Collection', description: 'Marketing-ready banner set with brand-consistent layouts', category: 'Marketing', thumbnail: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400', uses: 5400 },
  { id: '6', name: 'Product Concept Design', description: 'Consumer product visualization with clean technical renders', category: 'Product Design', thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400', uses: 4100 },
  { id: '7', name: 'Ethereal Landscape', description: 'Dreamlike landscape vistas with atmospheric lighting', category: 'AI Art', thumbnail: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400', uses: 22100 },
  { id: '8', name: 'Social Story Pack', description: 'Vertical story format with dynamic composition templates', category: 'Social Media', thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400', uses: 11700 },
];

export const NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'success', title: 'Generation Complete', message: 'Your "Cyberpunk City" image has been generated successfully.', time: '2 min ago', read: false },
  { id: '2', type: 'success', title: 'Video Ready', message: '"Ocean Storm Timelapse" video is ready to download.', time: '15 min ago', read: false },
  { id: '3', type: 'update', title: 'New Model Available', message: 'Flux Ultra v2 is now available with improved quality.', time: '1 hour ago', read: false },
  { id: '4', type: 'info', title: 'Credits Renewed', message: 'Your monthly 1,000 credits have been refreshed.', time: '2 days ago', read: true },
  { id: '5', type: 'update', title: 'New Feature: 3D Animation', message: 'You can now animate your 3D models with AI.', time: '3 days ago', read: true },
];

export const IMAGE_STYLES = [
  { id: 'photorealistic', name: 'Photorealistic', preview: 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 'anime', name: 'Anime', preview: 'https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 'oil-painting', name: 'Oil Painting', preview: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 'digital-art', name: 'Digital Art', preview: 'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 'sketch', name: 'Sketch', preview: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 'cyberpunk', name: 'Cyberpunk', preview: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=100' },
];
