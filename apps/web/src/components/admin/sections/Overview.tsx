'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Users, Zap, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const Overview: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Activity className="w-6 h-6" />}
          title="Total Iterations"
          value={stats?.total_iterations || 0}
          subtitle="All time"
          color="blue"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Avg Quality Score"
          value={`${(stats?.avg_quality_score || 0).toFixed(1)}/10`}
          subtitle="Current"
          color="green"
        />
        <StatCard
          icon={<Users className="w-6 h-6" />}
          title="Agents Online"
          value={stats?.agents_online || 0}
          subtitle="Active now"
          color="purple"
        />
        <StatCard
          icon={<Zap className="w-6 h-6" />}
          title="Issues Resolved"
          value={stats?.issues_resolved_today || 0}
          subtitle="Today"
          color="yellow"
        />
      </div>

      {/* System Health */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          System Health
        </h2>
        <div className="space-y-3">
          {stats?.services?.map((service: any) => (
            <ServiceStatus key={service.port} service={service} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-2">
          {stats?.recent_activity?.map((activity: any, idx: number) => (
            <ActivityItem key={idx} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
}> = ({ icon, title, value, subtitle, color }) => {
  const colorClass = {
    blue: 'bg-blue-500/10 border-blue-500/30',
    green: 'bg-green-500/10 border-green-500/30',
    purple: 'bg-purple-500/10 border-purple-500/30',
    yellow: 'bg-yellow-500/10 border-yellow-500/30',
  }[color] || 'bg-gray-700/50 border-gray-600/50';

  const iconClass = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    yellow: 'text-yellow-400',
  }[color] || 'text-gray-400';

  return (
    <div className={`rounded-lg p-4 border ${colorClass}`}>
      <div className={`${iconClass} mb-3`}>{icon}</div>
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className="text-gray-500 text-xs mt-2">{subtitle}</p>
    </div>
  );
};

const ServiceStatus: React.FC<{ service: any }> = ({ service }) => {
  const isHealthy = service.status === 'running';

  return (
    <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
      <div className="flex items-center gap-3">
        <div
          className={`w-2 h-2 rounded-full ${
            isHealthy ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <div>
          <p className="font-medium text-sm">{service.port} | {service.name}</p>
          <p className="text-xs text-gray-400">
            {isHealthy ? 'Running' : 'Offline'} • CPU: {service.cpu}% • RAM: {service.ram}MB
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-blue-400">{service.last_update}</p>
      </div>
    </div>
  );
};

const ActivityItem: React.FC<{ activity: any }> = ({ activity }) => {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-700/50 rounded">
      {activity.type === 'success' && (
        <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
      )}
      {activity.type === 'error' && (
        <AlertCircle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
      )}
      {activity.type === 'pending' && (
        <Clock className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
      )}
      <div className="flex-1">
        <p className="text-sm font-medium">{activity.message}</p>
        <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
      </div>
    </div>
  );
};

export default Overview;
