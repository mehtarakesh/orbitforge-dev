'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, AlertCircle, Play, BarChart3 } from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  type: 'epic' | 'feature' | 'story' | 'task';
  status: 'planning' | 'in-progress' | 'testing' | 'completed';
  progress: number;
  quality: number;
  parent_id?: string;
  children: Feature[];
}

const FeatureManagement: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatures();
    const interval = setInterval(fetchFeatures, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await fetch('/api/admin/features');
      const data = await response.json();
      setFeatures(data.features);
    } catch (error) {
      console.error('Failed to fetch features:', error);
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
      <h1 className="text-3xl font-bold">Features & Testing</h1>

      {/* Feature Tree */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Feature Tree</h2>
        <div className="space-y-2">
          {features.map((feature) => (
            <FeatureNode key={feature.id} feature={feature} level={0} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="font-bold mb-3">Feature Execution</h3>
          <button className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors mb-2">
            🚀 Auto-Start Next Feature
          </button>
          <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors mb-2">
            👁 View Progress
          </button>
          <button className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors mb-2">
            🎯 Assign Agent
          </button>
          <button className="w-full px-4 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm font-medium transition-colors">
            ⚡ Accelerate
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="font-bold mb-3">Testing Dashboard</h3>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span>Unit Tests:</span>
              <span className="text-green-400">245/250 (98%)</span>
            </div>
            <div className="flex justify-between">
              <span>Integration Tests:</span>
              <span className="text-green-400">42/45 (93%)</span>
            </div>
            <div className="flex justify-between">
              <span>E2E Tests:</span>
              <span className="text-yellow-400">18/20 (90%)</span>
            </div>
            <div className="flex justify-between">
              <span>Code Coverage:</span>
              <span className="text-green-400">87%</span>
            </div>
          </div>
          <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors mb-2">
            ▶ Run All Tests
          </button>
          <button className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm font-medium transition-colors">
            🔄 Failed Tests Only
          </button>
        </div>
      </div>
    </div>
  );
};

const FeatureNode: React.FC<{ feature: Feature; level: number }> = ({ feature, level }) => {
  const [expanded, setExpanded] = useState(level < 2);
  const statusColor = {
    'planning': 'text-gray-400',
    'in-progress': 'text-blue-400',
    'testing': 'text-yellow-400',
    'completed': 'text-green-400',
  }[feature.status];

  const typeIcon = {
    'epic': '📦',
    'feature': '⚙️',
    'story': '📖',
    'task': '✓',
  }[feature.type];

  return (
    <div>
      <div
        className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer transition-colors"
        style={{ marginLeft: `${level * 20}px` }}
      >
        {feature.children.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-0 hover:bg-gray-600 rounded transition-colors"
          >
            <div className="w-4 h-4 flex items-center justify-center text-xs">
              {expanded ? '▼' : '▶'}
            </div>
          </button>
        )}
        {feature.children.length === 0 && <div className="w-4 h-4" />}

        <span className="text-base">{typeIcon}</span>
        <div className="flex-1">
          <p className="text-sm font-medium">{feature.name}</p>
          <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
            <div
              className="h-1 rounded-full bg-blue-500"
              style={{ width: `${feature.progress}%` }}
            />
          </div>
        </div>
        <span className={`text-xs font-medium ${statusColor}`}>
          {feature.status}
        </span>
        <span className="text-xs font-medium text-gray-400 ml-2">
          {feature.progress}%
        </span>
      </div>

      {expanded && feature.children.map((child) => (
        <FeatureNode key={child.id} feature={child} level={level + 1} />
      ))}
    </div>
  );
};

export default FeatureManagement;
