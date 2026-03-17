'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Zap, 
  Settings, 
  FileText, 
  ImageIcon, 
  Package, 
  TrendingUp, 
  BookOpen,
  AlertCircle,
  Menu,
  X
} from 'lucide-react';
import SystemControl from './sections/SystemControl';
import AgentEvolutionDashboard from './sections/AgentEvolutionDashboard';
import FeatureManagement from './sections/FeatureManagement';
import ImageManagementEpic from './sections/ImageManagementEpic';
import ProductsDashboard from './sections/ProductsDashboard';
import AnalyticsDashboard from './sections/AnalyticsDashboard';
import DocumentationCenter from './sections/DocumentationCenter';
import QuickActions from './sections/QuickActions';
import Overview from './sections/Overview';
import ActionLogger from './components/ActionLogger';

type TabType = 'overview' | 'agents' | 'system' | 'features' | 'images' | 'products' | 'analytics' | 'docs' | 'actions' | 'logs';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [systemHealth, setSystemHealth] = useState<any>(null);

  useEffect(() => {
    // Fetch system health periodically
    const fetchHealth = async () => {
      try {
        const response = await fetch('/api/admin/health');
        const data = await response.json();
        setSystemHealth(data);
      } catch (error) {
        console.error('Failed to fetch system health:', error);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'agents', label: 'Agents & Evolution', icon: Zap },
    { id: 'system', label: 'System Control', icon: Settings },
    { id: 'features', label: 'Features & Testing', icon: FileText },
    { id: 'images', label: 'Image Management', icon: ImageIcon },
    { id: 'products', label: 'Products Database', icon: Package },
    { id: 'analytics', label: 'Analytics & Metrics', icon: TrendingUp },
    { id: 'docs', label: 'Documentation', icon: BookOpen },
    { id: 'actions', label: 'Quick Actions', icon: Zap },
    { id: 'logs', label: 'Action Logs', icon: AlertCircle },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-gray-800 border-r border-gray-700 transition-all duration-300 overflow-hidden`}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Zap className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold">DealForecaster</h1>
          </div>
          <h2 className="text-sm font-semibold text-gray-400 mb-4">ADMIN DASHBOARD</h2>
          
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Status Bar */}
        {systemHealth && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-700 bg-gray-800 p-4">
            <p className="text-xs text-gray-400 mb-2">System Status</p>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  systemHealth.healthy ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-xs">
                {systemHealth.services_running}/{systemHealth.total_services} services
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
          <div className="flex items-center justify-between p-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-400">System Administrator</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 max-w-7xl mx-auto">
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'agents' && <AgentEvolutionDashboard />}
          {activeTab === 'system' && <SystemControl />}
          {activeTab === 'features' && <FeatureManagement />}
          {activeTab === 'images' && <ImageManagementEpic />}
          {activeTab === 'products' && <ProductsDashboard />}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'docs' && <DocumentationCenter />}
          {activeTab === 'actions' && <QuickActions />}
          {activeTab === 'logs' && <ActionLogger />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
