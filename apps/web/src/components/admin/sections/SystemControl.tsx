'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Database, Server, Zap, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import ProgressMonitor from '../components/ProgressMonitor';
import { executeAction } from '../utils/actionExecutor';

interface Service {
  id: string;
  port: number;
  name: string;
  status: 'running' | 'stopped' | 'error';
  cpu: number;
  ram: number;
  lastUpdate: string;
}

const SystemControl: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [databaseStatus, setDatabaseStatus] = useState<string>('unknown');
  const [loading, setLoading] = useState(true);
  const [executingAction, setExecutingAction] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    fetchServices();
    const interval = setInterval(fetchServices, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/services');
      const data = await response.json();
      setServices(data.services);
      setDatabaseStatus(data.database_status);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const handleExecuteScript = async (scriptName: string, script: string) => {
    setExecutingAction(scriptName);
    setLogs([]);
    setProgressData({ progress: 0, status: 'running' });

    try {
      await executeAction(scriptName, script, {
        onProgress: (progress: number) => {
          setProgressData((prev: any) => ({ ...prev, progress }));
        },
        onLog: (message: string) => {
          setLogs((prev) => [...prev, message]);
        },
      });

      setProgressData({ progress: 100, status: 'completed' });
      setTimeout(() => {
        setExecutingAction(null);
        fetchServices();
      }, 2000);
    } catch (error) {
      setProgressData({ progress: 0, status: 'error', error: String(error) });
    }
  };

  const handleServiceControl = async (serviceId: string, action: 'start' | 'stop' | 'restart') => {
    setExecutingAction(`${serviceId}-${action}`);
    setLogs([]);
    setProgressData({ progress: 0, status: 'running' });

    try {
      const response = await fetch(`/api/admin/services/${serviceId}/${action}`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error(`Failed to ${action} service`);

      setProgressData({ progress: 100, status: 'completed' });
      setTimeout(() => {
        setExecutingAction(null);
        fetchServices();
      }, 1000);
    } catch (error) {
      setProgressData({ progress: 0, status: 'error', error: String(error) });
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
      <h1 className="text-3xl font-bold">System Control</h1>

      {/* Progress Monitor */}
      {executingAction && (
        <ProgressMonitor 
          status={progressData?.status || 'running'}
          progress={progressData?.progress || 0}
          logs={logs}
          onClose={() => setExecutingAction(null)}
        />
      )}

      {/* Database Management */}
      <Section
        icon={<Database className="w-5 h-5" />}
        title="Database Management"
      >
        <div className="space-y-3">
          <StatusRow
            status={databaseStatus}
            label="PostgreSQL"
          />

          <ActionButton
            label="🔧 Setup PostgreSQL"
            onClick={() => handleExecuteScript('setup-postgres', 'setup-database')}
            disabled={executingAction !== null}
          />
          <ActionButton
            label="📊 View Schema"
            onClick={() => handleExecuteScript('view-schema', 'view-database-schema')}
            disabled={executingAction !== null}
          />
          <ActionButton
            label="🔄 Backup Database"
            onClick={() => handleExecuteScript('backup-db', 'backup-database')}
            disabled={executingAction !== null}
          />
          <ActionButton
            label="↩️ Restore from Backup"
            onClick={() => handleExecuteScript('restore-db', 'restore-database')}
            disabled={executingAction !== null}
          />
          <ActionButton
            label="🧹 Cleanup Old Logs"
            onClick={() => handleExecuteScript('cleanup-logs', 'cleanup-old-logs')}
            disabled={executingAction !== null}
          />
          <ActionButton
            label="📈 View Metrics"
            onClick={() => handleExecuteScript('db-metrics', 'view-database-metrics')}
            disabled={executingAction !== null}
          />
        </div>
      </Section>

      {/* Service Management */}
      <Section
        icon={<Server className="w-5 h-5" />}
        title="Service Management"
      >
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <ActionButton
              label="🚀 Start All Services"
              onClick={() => handleExecuteScript('start-all', 'start-all-services')}
              disabled={executingAction !== null}
              variant="success"
            />
            <ActionButton
              label="⏹️ Stop All Services"
              onClick={() => handleExecuteScript('stop-all', 'stop-all-services')}
              disabled={executingAction !== null}
              variant="danger"
            />
            <ActionButton
              label="🔄 Restart All Services"
              onClick={() => handleExecuteScript('restart-all', 'restart-all-services')}
              disabled={executingAction !== null}
            />
          </div>

          <p className="text-gray-400 text-sm font-medium mt-6 mb-4">Per-Service Controls:</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onControl={(action) => handleServiceControl(service.id, action)}
                disabled={executingAction !== null}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Orchestrator Control */}
      <Section
        icon={<Zap className="w-5 h-5" />}
        title="Orchestrator Control"
      >
        <div className="space-y-3">
          <ActionButton
            label="▶ Trigger Cycle Now"
            onClick={() => handleExecuteScript('trigger-cycle', 'trigger-orchestrator-cycle')}
            disabled={executingAction !== null}
            variant="success"
          />
          <ActionButton
            label="📋 View Recent Cycles"
            onClick={() => handleExecuteScript('view-cycles', 'view-recent-cycles')}
            disabled={executingAction !== null}
          />
          <ActionButton
            label="🔧 Configure Cycle Timing"
            onClick={() => handleExecuteScript('config-timing', 'configure-cycle-timing')}
            disabled={executingAction !== null}
          />
          <ActionButton
            label="⚙️ Configure Health Check Rules"
            onClick={() => handleExecuteScript('config-health', 'configure-health-checks')}
            disabled={executingAction !== null}
          />
        </div>
      </Section>
    </div>
  );
};

const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({
  icon,
  title,
  children,
}) => (
  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
      {icon}
      {title}
    </h2>
    {children}
  </div>
);

const StatusRow: React.FC<{ status: string; label: string }> = ({ status, label }) => {
  const isHealthy = status === 'running' || status === 'connected';
  return (
    <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isHealthy ? 'bg-green-500' : status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
          }`}
        />
        <span className="text-xs font-medium capitalize">{status}</span>
      </div>
    </div>
  );
};

const ActionButton: React.FC<{
  label: string;
  onClick: () => void;
  disabled: boolean;
  variant?: 'primary' | 'success' | 'danger';
}> = ({ label, onClick, disabled, variant = 'primary' }) => {
  const variantClass = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    success: 'bg-green-600 hover:bg-green-700',
    danger: 'bg-red-600 hover:bg-red-700',
  }[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
        disabled
          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
          : `${variantClass} text-white`
      }`}
    >
      {label}
    </button>
  );
};

const ServiceCard: React.FC<{
  service: Service;
  onControl: (action: 'start' | 'stop' | 'restart') => void;
  disabled: boolean;
}> = ({ service, onControl, disabled }) => {
  const isRunning = service.status === 'running';

  return (
    <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="font-medium text-sm">
            {service.port} | {service.name}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {isRunning ? '✓ Running' : '✗ Offline'} • CPU: {service.cpu}% • RAM: {service.ram}MB
          </p>
        </div>
        <div
          className={`w-2 h-2 rounded-full ${
            isRunning ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onControl('start')}
          disabled={disabled || isRunning}
          className="flex-1 p-2 bg-green-600/20 text-green-400 rounded text-xs font-medium hover:bg-green-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Play className="w-3 h-3 inline mr-1" />
          Start
        </button>
        <button
          onClick={() => onControl('stop')}
          disabled={disabled || !isRunning}
          className="flex-1 p-2 bg-red-600/20 text-red-400 rounded text-xs font-medium hover:bg-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Pause className="w-3 h-3 inline mr-1" />
          Stop
        </button>
        <button
          onClick={() => onControl('restart')}
          disabled={disabled}
          className="flex-1 p-2 bg-blue-600/20 text-blue-400 rounded text-xs font-medium hover:bg-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RotateCcw className="w-3 h-3 inline mr-1" />
          Restart
        </button>
      </div>
    </div>
  );
};

export default SystemControl;
