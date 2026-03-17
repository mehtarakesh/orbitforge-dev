'use client';

import { useEffect, useState } from 'react';

interface ServiceStatus {
  name: string;
  port: number;
  url: string;
  status: 'running' | 'stopped' | 'error';
  data?: any;
}

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const checkServices = async () => {
      const serviceList: ServiceStatus[] = [
        { name: 'Evidence Tracker', port: 8800, url: 'http://localhost:8800/api/dashboard-summary', status: 'running' },
        { name: 'Implementation Tracker', port: 9000, url: 'http://localhost:9000/api/overview', status: 'running' },
        { name: 'Orchestrator Dashboard', port: 8094, url: 'http://localhost:8094/health', status: 'running' },
        { name: 'Evolution Engine', port: 9270, url: 'http://localhost:9270/health', status: 'running' },
        { name: 'Data Pipeline', port: 9271, url: 'http://localhost:9271/health', status: 'running' },
        { name: 'Metrics Engine', port: 9272, url: 'http://localhost:9272/health', status: 'running' },
      ];

      const updatedServices = await Promise.all(
        serviceList.map(async (service) => {
          try {
            const response = await fetch(service.url, { 
              mode: 'cors',
              headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
              const data = await response.json();
              return { ...service, status: 'running' as const, data };
            } else {
              return { ...service, status: 'error' as const };
            }
          } catch (error) {
            return { ...service, status: 'stopped' as const };
          }
        })
      );

      setServices(updatedServices);
      setLastUpdate(new Date().toLocaleTimeString());
    };

    checkServices();
    const interval = setInterval(checkServices, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  const runningCount = services.filter(s => s.status === 'running').length;
  const systemHealth = (runningCount / services.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-4xl font-bold text-white mb-4">System Status</h1>
          
          {/* Health Indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${systemHealth === 100 ? 'bg-emerald-500' : systemHealth > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
              <span className="text-slate-300">
                {runningCount}/{services.length} Services Running
              </span>
            </div>
            <span className="text-sm text-slate-400">Last checked: {lastUpdate}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            label="System Health" 
            value={`${Math.round(systemHealth)}%`} 
            color={systemHealth === 100 ? 'text-emerald-400' : systemHealth > 50 ? 'text-yellow-400' : 'text-red-400'}
          />
          <StatCard label="Running Services" value={runningCount} color="text-blue-400" />
          <StatCard label="Total Services" value={services.length} color="text-slate-400" />
          <StatCard label="Web App Port" value="3000" color="text-purple-400" />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {services.map((service) => (
            <ServiceCard key={service.port} service={service} />
          ))}
        </div>

        {/* Instructions */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mt-8">
          <h2 className="text-lg font-bold text-white mb-4">All Available URLs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
            <UrlEntry label="Web App" url="http://localhost:3000" />
            <UrlEntry label="Admin Dashboard" url="http://localhost:3000/admin" />
            <UrlEntry label="Evidence Tracker" url="http://localhost:8800" />
            <UrlEntry label="Implementation Tracker" url="http://localhost:9000" />
            <UrlEntry label="Orchestrator" url="http://localhost:8094" />
            <UrlEntry label="Evolution Engine" url="http://localhost:9270" />
            <UrlEntry label="Data Pipeline" url="http://localhost:9271" />
            <UrlEntry label="Metrics Engine" url="http://localhost:9272" />
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mt-8">
          <h2 className="text-lg font-bold text-white mb-4">Service Metrics</h2>
          <div className="space-y-4">
            {services.map((service) => (
              service.status === 'running' && service.data && (
                <div key={service.port} className="bg-slate-700/50 rounded p-4">
                  <p className="text-white font-medium mb-2">{service.name}</p>
                  <pre className="text-xs text-slate-300 overflow-auto bg-slate-900/50 p-2 rounded">
                    {JSON.stringify(service.data, null, 2).slice(0, 300)}...
                  </pre>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: ServiceStatus }) {
  const statusColor = 
    service.status === 'running' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' :
    service.status === 'error' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300' :
    'bg-red-500/20 border-red-500/50 text-red-300';

  const statusIcon = 
    service.status === 'running' ? '✓' :
    service.status === 'error' ? '⚠' : '✗';

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-bold text-lg">{service.name}</h3>
          <p className="text-slate-400 text-sm">Port {service.port}</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded border ${statusColor}`}>
          <span className="font-bold">{statusIcon}</span>
          <span className="capitalize text-xs font-medium">{service.status}</span>
        </div>
      </div>

      {service.data && (
        <div className="bg-slate-700/50 rounded p-3 text-xs text-slate-300 space-y-1">
          {Object.entries(service.data).slice(0, 4).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-slate-400">{key}:</span>
              <span className="text-slate-200">{String(value).slice(0, 30)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <a 
          href={service.url.replace('/api/dashboard-summary', '').replace('/api/overview', '').replace('/health', '')} 
          target="_blank"
          className="flex-1 text-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
        >
          Visit Service
        </a>
        <a 
          href={service.url} 
          target="_blank"
          className="flex-1 text-center px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded transition-colors"
        >
          API Endpoint
        </a>
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

function UrlEntry({ label, url }: { label: string; url: string }) {
  return (
    <div className="bg-slate-700/50 rounded p-3">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <a href={url} target="_blank" className="text-blue-400 hover:text-blue-300 break-all">
        {url}
      </a>
    </div>
  );
}
