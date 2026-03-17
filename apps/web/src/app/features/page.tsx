'use client';

import { useEffect, useState } from 'react';

interface Feature {
  id: string;
  epicId: string;
  name: string;
  description: string;
  priority: string;
  status: string;
  agent?: string;
  progress?: number;
  qualityScore?: number;
  cycles?: number;
}

interface Epic {
  id: string;
  name: string;
  description: string;
  status: string;
}

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEpic, setSelectedEpic] = useState<string>('all');
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuresRes, epicsRes] = await Promise.all([
          fetch('http://localhost:9000/api/features'),
          fetch('http://localhost:9000/api/epics')
        ]);
        
        const featuresData = await featuresRes.json();
        const epicsData = await epicsRes.json();
        
        setFeatures(Array.isArray(featuresData) ? featuresData : featuresData.features || []);
        setEpics(Array.isArray(epicsData) ? epicsData : epicsData.epics || []);
        setLastUpdate(new Date().toLocaleTimeString());
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const filteredFeatures = selectedEpic === 'all' 
    ? features 
    : features.filter(f => f.epicId === selectedEpic);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inProgress':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/50';
      case 'backlog':
        return 'bg-slate-500/20 text-slate-300 border border-slate-500/50';
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50';
      case 'blocked':
        return 'bg-red-500/20 text-red-300 border border-red-500/50';
      default:
        return 'bg-slate-500/20 text-slate-300 border border-slate-500/50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-400';
      case 'high':
        return 'text-orange-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-slate-400';
    }
  };

  const stats = {
    total: features.length,
    inProgress: features.filter(f => f.status === 'inProgress').length,
    completed: features.filter(f => f.status === 'completed').length,
    backlog: features.filter(f => f.status === 'backlog').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-white">Feature Progress Tracker</h1>
            <div className="text-sm text-slate-400">Last updated: {lastUpdate}</div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <StatCard label="Total" value={stats.total} color="text-blue-400" />
            <StatCard label="In Progress" value={stats.inProgress} color="text-yellow-400" />
            <StatCard label="Completed" value={stats.completed} color="text-emerald-400" />
            <StatCard label="Backlog" value={stats.backlog} color="text-slate-400" />
            <StatCard label="Completion" value={`${Math.round((stats.completed / stats.total) * 100)}%`} color="text-purple-400" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Epic Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Filter by Epic</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedEpic('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedEpic === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              All Features ({stats.total})
            </button>
            {epics.map(epic => (
              <button
                key={epic.id}
                onClick={() => setSelectedEpic(epic.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedEpic === epic.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {epic.name} ({features.filter(f => f.epicId === epic.id).length})
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading features...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFeatures.map(feature => (
              <div key={feature.id} className="bg-slate-800 border border-slate-700 rounded-lg p-5 hover:border-slate-600 transition-colors">
                <div className="mb-3">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-bold text-lg flex-1">{feature.name}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${getPriorityColor(feature.priority)}`}>
                      {feature.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </div>

                <div className="space-y-3 mb-4">
                  {/* Status Badge */}
                  <div>
                    <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${getStatusColor(feature.status)}`}>
                      {feature.status === 'inProgress' ? '⏳ In Progress' : 
                       feature.status === 'completed' ? '✓ Completed' : 
                       feature.status === 'blocked' ? '✗ Blocked' : '📋 Backlog'}
                    </span>
                  </div>

                  {/* Metrics */}
                  {(feature.progress !== undefined || feature.qualityScore !== undefined || feature.cycles !== undefined) && (
                    <div className="space-y-2 text-xs">
                      {feature.progress !== undefined && (
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-slate-400">Progress</span>
                            <span className="text-slate-300">{feature.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded h-1.5">
                            <div 
                              className="bg-blue-500 h-1.5 rounded" 
                              style={{ width: `${feature.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      {feature.qualityScore !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Quality Score</span>
                          <span className="text-slate-300">{feature.qualityScore.toFixed(2)}/10</span>
                        </div>
                      )}
                      {feature.cycles !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Evolution Cycles</span>
                          <span className="text-slate-300">{feature.cycles}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Agent Assigned */}
                {feature.agent && (
                  <div className="pt-3 border-t border-slate-700">
                    <p className="text-slate-400 text-xs">Assigned to: <span className="text-slate-300 font-medium">{feature.agent}</span></p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
