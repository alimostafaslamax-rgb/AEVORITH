import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import HomePage from './pages/HomePage';
import AIImagePage from './pages/AIImagePage';
import AIVideoPage from './pages/AIVideoPage';
import AIChatPage from './pages/AIChatPage';
import ThreeDPage from './pages/ThreeDPage';
import MyCreationsPage from './pages/MyCreationsPage';
import TemplatesPage from './pages/TemplatesPage';
import ModelsPage from './pages/ModelsPage';
import ToolsPage from './pages/ToolsPage';
import APIAccessPage from './pages/APIAccessPage';
import PricingPage from './pages/PricingPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from '../../pages/NotFoundPage';
import type { Page } from '../../types';

const PAGE_FROM_PATH: Record<string, Page> = {
  '/dashboard': 'home',
  '/dashboard/ai-image': 'ai-image',
  '/dashboard/ai-video': 'ai-video',
  '/dashboard/ai-chat': 'ai-chat',
  '/dashboard/3d-generator': '3d-generator',
  '/dashboard/my-creations': 'my-creations',
  '/dashboard/templates': 'templates',
  '/dashboard/models': 'models',
  '/dashboard/tools': 'tools',
  '/dashboard/api-access': 'api-access',
  '/dashboard/pricing': 'pricing',
  '/dashboard/settings': 'settings',
};

const PATH_FROM_PAGE: Record<Page, string> = {
  'home': '/dashboard',
  'ai-image': '/dashboard/ai-image',
  'ai-video': '/dashboard/ai-video',
  'ai-chat': '/dashboard/ai-chat',
  '3d-generator': '/dashboard/3d-generator',
  'my-creations': '/dashboard/my-creations',
  'templates': '/dashboard/templates',
  'models': '/dashboard/models',
  'tools': '/dashboard/tools',
  'tool-detail': '/dashboard/tools',
  'api-access': '/dashboard/api-access',
  'pricing': '/dashboard/pricing',
  'settings': '/dashboard/settings',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentPage: Page = PAGE_FROM_PATH[location.pathname] ?? 'home';

  const handleNavigate = (page: Page) => {
    navigate(PATH_FROM_PAGE[page] ?? '/dashboard');
    setMobileMenuOpen(false);
  };

  const handleLandingNavigate = () => navigate('/');

  const needsFullHeight = ['ai-image', 'ai-video', 'ai-chat', '3d-generator', 'settings'].includes(currentPage);

  return (
    <div className="flex h-screen bg-[#050709] overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex-shrink-0 h-full">
            <Sidebar
              currentPage={currentPage}
              onNavigate={handleNavigate}
              collapsed={false}
              onCollapse={() => {}}
              mobile
              onClose={() => setMobileMenuOpen(false)}
            />
          </div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav
          onNavigate={handleNavigate}
          onLandingNavigate={handleLandingNavigate}
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          mobileMenuOpen={mobileMenuOpen}
        />

        <main className={`flex-1 overflow-auto ${needsFullHeight ? 'flex flex-col' : ''}`}>
          <Routes>
            <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
            <Route path="/ai-image" element={<AIImagePage />} />
            <Route path="/ai-video" element={<AIVideoPage />} />
            <Route path="/ai-chat" element={<AIChatPage />} />
            <Route path="/3d-generator" element={<ThreeDPage />} />
            <Route path="/my-creations" element={<MyCreationsPage />} />
            <Route path="/templates" element={<TemplatesPage onNavigate={handleNavigate} />} />
            <Route path="/models" element={<ModelsPage />} />
            <Route path="/tools" element={<ToolsPage onNavigate={handleNavigate} />} />
            <Route path="/api-access" element={<APIAccessPage />} />
            <Route path="/pricing" element={<PricingPage onNavigate={handleNavigate} />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
