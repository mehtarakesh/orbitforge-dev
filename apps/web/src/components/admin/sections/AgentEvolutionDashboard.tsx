'use client';

import React, { useEffect, useState } from 'react';
import { Zap, TrendingUp, Award, BarChart3 } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'error';
  iterations: number;
  quality_score: number;
  skills: string[];
  evolution: any[];
}

const AgentEvolutionDashboard: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/admin/agents');
      const data = await response.json();
      setAgents(data.agents);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
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
      <h1 className="text-3xl font-bold">Agents & Evolution</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {/* Evolution Timeline */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Evolution Timeline
        </h2>
        <div className="space-y-4">
          {agents.map((agent) => (
            <EvolutionTimeline key={agent.id} agent={agent} />
          ))}
        </div>
      </div>

      {/* Skill Progression */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-green-400" />
          Skill Progression
        </h2>
        <div className="space-y-4">
          {agents.map((agent) => (
            <div key={agent.id} className="border-t border-gray-700 pt-4 first:border-t-0 first:pt-0">
              <p className="font-medium mb-2">{agent.name}</p>
              <div className="flex flex-wrap gap-2">
                {agent.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AgentCard: React.FC<{ agent: Agent }> = ({ agent }) => {
  const statusColor = {
    active: 'bg-green-600/20 text-green-400',
    idle: 'bg-yellow-600/20 text-yellow-400',
    error: 'bg-red-600/20 text-red-400',
  }[agent.status];

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg">{agent.name}</h3>
          <p className="text-sm text-gray-400">{agent.role}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {agent.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-400 mb-1">Iterations</p>
          <p className="text-2xl font-bold">{agent.iterations}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Quality Score</p>
          <p className="text-2xl font-bold text-blue-400">{agent.quality_score.toFixed(1)}/10</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-2">Skills</p>
        <div className="flex flex-wrap gap-1">
          {agent.skills.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
              {skill}
            </span>
          ))}
          {agent.skills.length > 3 && (
            <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
              +{agent.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 px-3 py-2 bg-blue-600/20 text-blue-400 rounded text-xs font-medium hover:bg-blue-600/30 transition-colors">
          Timeline
        </button>
        <button className="flex-1 px-3 py-2 bg-purple-600/20 text-purple-400 rounded text-xs font-medium hover:bg-purple-600/30 transition-colors">
          Stats
        </button>
        <button className="flex-1 px-3 py-2 bg-green-600/20 text-green-400 rounded text-xs font-medium hover:bg-green-600/30 transition-colors">
          Assign
        </button>
      </div>
    </div>
  );
};

const EvolutionTimeline: React.FC<{ agent: Agent }> = ({ agent }) => {
  return (
    <div className="border-l-2 border-blue-600/30 pl-4 py-2">
      <p className="font-medium text-sm mb-2">{agent.name}</p>
      <div className="flex flex-wrap gap-2">
        {agent.evolution.map((step, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="px-3 py-1 bg-blue-600/10 text-blue-400 text-xs rounded border border-blue-600/30">
              v{step.version}
            </div>
            {idx < agent.evolution.length - 1 && (
              <div className="text-gray-500 text-sm">→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentEvolutionDashboard;
