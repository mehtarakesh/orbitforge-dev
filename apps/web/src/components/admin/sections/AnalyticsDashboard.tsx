'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, LineChart } from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/admin/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
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
      <h1 className="text-3xl font-bold">Analytics & Metrics</h1>

      {/* Quality Trends */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Quality Trends
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Quality Score Over Time</p>
            <div className="h-32 bg-gray-700 rounded flex items-end justify-around p-4">
              {[7.2, 7.5, 7.8, 8.1, 8.3, 8.4, 8.5].map((score, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-blue-500 rounded-t mx-1"
                  style={{ height: `${(score / 10) * 100}%` }}
                  title={`${score}/10`}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-gray-700/50 rounded">
              <p className="text-gray-400">Current</p>
              <p className="text-xl font-bold text-green-400">{metrics?.current_quality || 8.5}/10</p>
            </div>
            <div className="p-3 bg-gray-700/50 rounded">
              <p className="text-gray-400">Average</p>
              <p className="text-xl font-bold text-blue-400">{metrics?.average_quality || 8.1}/10</p>
            </div>
            <div className="p-3 bg-gray-700/50 rounded">
              <p className="text-gray-400">Trend</p>
              <p className="text-xl font-bold text-green-400">+0.3 📈</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Performance */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          Agent Performance
        </h2>
        <div className="space-y-3">
          {metrics?.agents?.map((agent: any) => (
            <AgentMetricRow key={agent.id} agent={agent} />
          ))}
        </div>
      </div>

      {/* Feature Health */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Feature Health</h2>
        <div className="space-y-3">
          {metrics?.features?.map((feature: any) => (
            <FeatureHealthRow key={feature.id} feature={feature} />
          ))}
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="font-bold mb-4">System Resources</h3>
          <div className="space-y-3 text-sm">
            <MetricRow label="Database Size" value={metrics?.db_size || '2.5 GB'} />
            <MetricRow label="API Response" value={metrics?.api_response || '145ms'} />
            <MetricRow label="CPU Usage" value={metrics?.cpu_usage || '24%'} />
            <MetricRow label="Memory Usage" value={metrics?.memory_usage || '3.2 GB'} />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="font-bold mb-4">Performance</h3>
          <div className="space-y-3 text-sm">
            <MetricRow label="Avg Response Time" value={metrics?.avg_response || '245ms'} />
            <MetricRow label="Error Rate" value={metrics?.error_rate || '0.3%'} />
            <MetricRow label="Uptime" value={metrics?.uptime || '99.8%'} />
            <MetricRow label="Cache Hit Rate" value={metrics?.cache_hit || '94%'} />
          </div>
        </div>
      </div>
    </div>
  );
};

const AgentMetricRow: React.FC<{ agent: any }> = ({ agent }) => (
  <div className="p-3 bg-gray-700/50 rounded">
    <div className="flex items-center justify-between mb-2">
      <p className="font-medium text-sm">{agent.name}</p>
      <p className="text-xs font-medium text-blue-400">{agent.quality}/10</p>
    </div>
    <div className="w-full bg-gray-600 rounded-full h-1">
      <div
        className="h-1 rounded-full bg-blue-500"
        style={{ width: `${(agent.quality / 10) * 100}%` }}
      />
    </div>
    <p className="text-xs text-gray-400 mt-2">
      {agent.iterations} iterations • {agent.improvement}% improvement
    </p>
  </div>
);

const FeatureHealthRow: React.FC<{ feature: any }> = ({ feature }) => {
  const healthColors: Record<string, string> = {
    'on-track': 'text-green-400',
    'at-risk': 'text-yellow-400',
    'behind': 'text-red-400',
  };
  const healthColor = healthColors[feature.health] || 'text-gray-400';

  return (
    <div className="p-3 bg-gray-700/50 rounded">
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium text-sm">{feature.name}</p>
        <span className={`text-xs font-medium ${healthColor}`}>{feature.health}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <p className="text-gray-400">Completion</p>
          <p className="font-semibold">{feature.completion}%</p>
        </div>
        <div>
          <p className="text-gray-400">Quality</p>
          <p className="font-semibold">{feature.quality}/10</p>
        </div>
        <div>
          <p className="text-gray-400">Coverage</p>
          <p className="font-semibold">{feature.coverage}%</p>
        </div>
      </div>
    </div>
  );
};

const MetricRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-400">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

export default AnalyticsDashboard;
