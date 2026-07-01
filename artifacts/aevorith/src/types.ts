export type Page =
  | 'home'
  | 'ai-image'
  | 'ai-video'
  | 'ai-chat'
  | '3d-generator'
  | 'my-creations'
  | 'templates'
  | 'models'
  | 'tools'
  | 'tool-detail'
  | 'api-access'
  | 'pricing'
  | 'settings';

export type View = 'landing' | 'tools-showcase' | 'dashboard';

export interface Creation {
  id: string;
  type: 'image' | 'video' | '3d' | 'animation';
  title: string;
  thumbnail: string;
  prompt: string;
  model: string;
  createdAt: string;
  liked: boolean;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'image' | 'video' | 'creative';
  icon: string;
  badge?: string;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  category: 'image' | 'video' | 'animation';
  speed: number;
  quality: number;
  badge?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  uses: number;
}

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'update';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface SearchResult {
  type: 'creation' | 'tool' | 'template' | 'model';
  title: string;
  description: string;
  action: string;
}
