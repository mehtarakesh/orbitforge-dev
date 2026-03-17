'use client';

import React, { useState, useEffect } from 'react';
import { Package, BarChart3, Settings } from 'lucide-react';

const ProductsDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Products Database</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatBox label="Total Products" value={stats?.total_products || 0} />
        <StatBox label="With Images" value={`${stats?.with_images || 0} (${stats?.image_percentage || 0}%)`} />
        <StatBox label="Next Sync" value={stats?.next_sync || 'Unknown'} />
      </div>

      {/* Data Generation */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Data Generation
        </h2>
        <div className="space-y-3">
          <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
            📊 Generate 10K Products
          </button>
          <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
            📊 Generate 100K Products
          </button>
          <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
            📊 Generate 1M Products
          </button>
          {stats?.generation_status && (
            <div className="mt-4 p-4 bg-gray-700 rounded">
              <p className="text-xs text-gray-400 mb-2">Generation Status</p>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${stats.generation_progress || 0}%` }}
                />
              </div>
              <p className="text-xs text-gray-300 mt-2">
                {stats.generation_progress || 0}% - ETA: {stats.generation_eta || 'calculating...'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Scrapers */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Data Scrapers
        </h2>
        <div className="space-y-3">
          {['Amazon', 'Walmart', 'eBay'].map((source) => (
            <ScraperControl key={source} source={source} />
          ))}
        </div>
      </div>

      {/* Attributes */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Attribute Mapping</h2>
        <p className="text-sm text-gray-300 mb-4">100+ Attributes configured</p>
        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
            ✏️ Edit Attributes
          </button>
          <button className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm font-medium transition-colors">
            🔄 Validate Data
          </button>
          <button className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors">
            📊 Quality Report
          </button>
        </div>
      </div>
    </div>
  );
};

const StatBox: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const ScraperControl: React.FC<{ source: string }> = ({ source }) => (
  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
    <div>
      <p className="font-medium text-sm">{source}</p>
      <p className="text-xs text-gray-400">30 min interval</p>
    </div>
    <div className="flex gap-2">
      <button className="px-3 py-1 bg-green-600/20 text-green-400 rounded text-xs font-medium hover:bg-green-600/30 transition-colors">
        Start
      </button>
      <button className="px-3 py-1 bg-red-600/20 text-red-400 rounded text-xs font-medium hover:bg-red-600/30 transition-colors">
        Stop
      </button>
      <button className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded text-xs font-medium hover:bg-blue-600/30 transition-colors">
        Run Now
      </button>
    </div>
  </div>
);

export default ProductsDashboard;
