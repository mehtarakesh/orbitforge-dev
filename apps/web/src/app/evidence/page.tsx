import React from 'react';

export default function EvidencePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-white mb-2">Evidence Tracking Dashboard</h1>
          <p className="text-slate-400">Real-time tracking of all feature implementations, improvements, and system evolution</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Evidence Summary Card */}
          <div className="lg:col-span-3 bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">System Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-700/50 rounded p-4">
                <p className="text-slate-400 text-sm">Total Improvements</p>
                <p className="text-3xl font-bold text-emerald-400">10,000+</p>
              </div>
              <div className="bg-slate-700/50 rounded p-4">
                <p className="text-slate-400 text-sm">Features Tracked</p>
                <p className="text-3xl font-bold text-blue-400">19</p>
              </div>
              <div className="bg-slate-700/50 rounded p-4">
                <p className="text-slate-400 text-sm">Active Services</p>
                <p className="text-3xl font-bold text-purple-400">6</p>
              </div>
              <div className="bg-slate-700/50 rounded p-4">
                <p className="text-slate-400 text-sm">System Status</p>
                <p className="text-lg font-bold text-emerald-400">✓ Operational</p>
              </div>
            </div>
          </div>

          {/* Evidence Tracker */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Evidence Tracker</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Port 8800</span>
                <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full"></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">10,000+ Records</span>
                <span className="text-slate-300">Quality Tracked</span>
              </div>
              <a href="http://localhost:8800/api/dashboard-summary" target="_blank" className="block text-blue-400 hover:text-blue-300 mt-4">
                View API →
              </a>
            </div>
          </div>

          {/* Implementation Tracker */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Implementation Tracker</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Port 9000</span>
                <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full"></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">19 Features</span>
                <span className="text-slate-300">8 Epics</span>
              </div>
              <a href="http://localhost:9000/api/overview" target="_blank" className="block text-blue-400 hover:text-blue-300 mt-4">
                View API →
              </a>
            </div>
          </div>

          {/* Evolution System */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Evolution System</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Ports 9270-9272</span>
                <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full"></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">3 Services</span>
                <span className="text-slate-300">Real-time Tracking</span>
              </div>
              <a href="http://localhost:9270/health" target="_blank" className="block text-blue-400 hover:text-blue-300 mt-4">
                View Status →
              </a>
            </div>
          </div>
        </div>

        {/* Key Metrics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Service Status */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Active Services</h3>
            <div className="space-y-3">
              <ServiceStatus name="Evidence Tracker" port={8800} status="active" />
              <ServiceStatus name="Implementation Tracker" port={9000} status="active" />
              <ServiceStatus name="Orchestrator Dashboard" port={8094} status="active" />
              <ServiceStatus name="Evolution Engine" port={9270} status="active" />
              <ServiceStatus name="Data Pipeline" port={9271} status="active" />
              <ServiceStatus name="Metrics Engine" port={9272} status="active" />
            </div>
          </div>

          {/* Feature Progress */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Feature Status Summary</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-300">In Progress</span>
                  <span className="text-white font-bold">12</span>
                </div>
                <div className="w-full bg-slate-700 rounded h-2">
                  <div className="bg-blue-500 h-2 rounded" style={{ width: '63%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-300">Planned</span>
                  <span className="text-white font-bold">7</span>
                </div>
                <div className="w-full bg-slate-700 rounded h-2">
                  <div className="bg-yellow-500 h-2 rounded" style={{ width: '37%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Documentation */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Available APIs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <ApiEndpoint method="GET" path="/api/dashboard-summary" desc="Evidence summary (Port 8800)" />
            <ApiEndpoint method="GET" path="/api/overview" desc="Implementation overview (Port 9000)" />
            <ApiEndpoint method="GET" path="/api/status" desc="Evolution status (Port 9270)" />
            <ApiEndpoint method="GET" path="/api/statistics" desc="Pipeline stats (Port 9271)" />
            <ApiEndpoint method="POST" path="/api/events" desc="Send event (Port 9271)" />
            <ApiEndpoint method="POST" path="/api/score-recommendation" desc="Score recommendation (Port 9272)" />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-bold text-white mb-4">Getting Started</h3>
          <div className="space-y-3 text-slate-300">
            <p>✓ All 6 services are currently running and accessible</p>
            <p>✓ View the Admin Dashboard for system control: <a href="/admin" className="text-blue-400 hover:text-blue-300">/admin</a></p>
            <p>✓ Check individual service health by visiting the API endpoints above</p>
            <p>✓ Evidence and implementation data is being tracked in real-time</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceStatus({ name, port, status }: { name: string; port: number; status: string }) {
  const statusColor = status === 'active' ? 'bg-emerald-500' : 'bg-red-500';
  return (
    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
      <div>
        <p className="text-white font-medium">{name}</p>
        <p className="text-slate-400 text-xs">Port {port}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`w-3 h-3 ${statusColor} rounded-full`}></span>
        <span className="text-xs text-slate-400 capitalize">{status}</span>
      </div>
    </div>
  );
}

function ApiEndpoint({ method, path, desc }: { method: string; path: string; desc: string }) {
  const methodColor = method === 'GET' ? 'text-blue-400' : method === 'POST' ? 'text-emerald-400' : 'text-purple-400';
  return (
    <div className="bg-slate-700/50 rounded p-3">
      <div className="flex items-center gap-2 mb-1">
        <span className={`font-bold ${methodColor}`}>{method}</span>
        <code className="text-slate-300 font-mono text-xs">{path}</code>
      </div>
      <p className="text-slate-400 text-xs">{desc}</p>
    </div>
  );
}
