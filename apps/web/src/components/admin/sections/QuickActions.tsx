'use client';

import React, { useState } from 'react';
import { Zap, Send } from 'lucide-react';
import ProgressMonitor from '../components/ProgressMonitor';
import { executeAction } from '../utils/actionExecutor';

const QuickActions: React.FC = () => {
  const [executingAction, setExecutingAction] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedAgent, setSelectedAgent] = useState('frontend-agent');
  const [selectedTask, setSelectedTask] = useState('build-image-upload');
  const [selectedPriority, setSelectedPriority] = useState('high');

  const handleAction = async (actionName: string, scriptName: string) => {
    setExecutingAction(actionName);
    setLogs([]);
    setProgressData({ progress: 0, status: 'running' });

    try {
      await executeAction(actionName, scriptName, {
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
      }, 2000);
    } catch (error) {
      setProgressData({ progress: 0, status: 'error', error: String(error) });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Quick Actions</h1>

      {/* Progress Monitor */}
      {executingAction && (
        <ProgressMonitor
          status={progressData?.status || 'running'}
          progress={progressData?.progress || 0}
          logs={logs}
          onClose={() => setExecutingAction(null)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Deployments & System */}
        <div className="space-y-4">
          <ActionCard
            title="Deploy Latest Feature"
            description="Deploys newest feature with all tests passing"
            meta="Quality: 9.2/10"
            onClick={() => handleAction('deploy-feature', 'deploy-latest')}
            disabled={executingAction !== null}
            variant="success"
          />

          <ActionCard
            title="Full System Sync"
            description="Sync DB + Services + Features"
            meta="Duration: 10 minutes"
            onClick={() => handleAction('system-sync', 'sync-all')}
            disabled={executingAction !== null}
          />

          <ActionCard
            title="Generate Daily Report"
            description="What happened in last 24 hours"
            meta="Generate & Download"
            onClick={() => handleAction('daily-report', 'generate-report')}
            disabled={executingAction !== null}
          />
        </div>

        {/* Column 2: Checks & Emergency */}
        <div className="space-y-4">
          <ActionCard
            title="Run All Quality Checks"
            description="Tests, Coverage, Performance"
            meta="Duration: 15 minutes"
            onClick={() => handleAction('quality-checks', 'run-checks')}
            disabled={executingAction !== null}
          />

          <ActionCard
            title="Emergency Fix"
            description="Something broken? Emergency rollback"
            meta="🚨 SOS Button"
            onClick={() => handleAction('emergency-fix', 'rollback')}
            disabled={executingAction !== null}
            variant="danger"
          />

          <ActionCard
            title="Health Status Check"
            description="Check all services and components"
            meta="Real-time status"
            onClick={() => handleAction('health-check', 'check-health')}
            disabled={executingAction !== null}
          />
        </div>

        {/* Column 3: Manual Agent Dispatch */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 h-fit">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Manual Agent Dispatch
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Assign Agent</label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="frontend-agent">Frontend Agent</option>
                <option value="backend-agent">Backend Agent</option>
                <option value="api-agent">API Agent</option>
                <option value="data-agent">Data Agent</option>
                <option value="test-agent">Test Agent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Task</label>
              <select
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="build-image-upload">Build Image Upload</option>
                <option value="fix-database-issue">Fix Database Issue</option>
                <option value="optimize-api">Optimize API</option>
                <option value="write-tests">Write Tests</option>
                <option value="refactor-code">Refactor Code</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Priority</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <button
              onClick={() => handleAction('dispatch-agent', 'dispatch-agent')}
              disabled={executingAction !== null}
              className="w-full px-4 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionCard: React.FC<{
  title: string;
  description: string;
  meta: string;
  onClick: () => void;
  disabled: boolean;
  variant?: 'primary' | 'success' | 'danger';
}> = ({ title, description, meta, onClick, disabled, variant = 'primary' }) => {
  const variantClass = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    success: 'bg-green-600 hover:bg-green-700',
    danger: 'bg-red-600 hover:bg-red-700',
  }[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left p-4 rounded-lg border border-gray-700 transition-all ${
        disabled
          ? 'bg-gray-700 cursor-not-allowed opacity-50'
          : `bg-gray-800 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-600/20`
      }`}
    >
      <h4 className="font-bold mb-1">{title}</h4>
      <p className="text-sm text-gray-300 mb-3">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{meta}</span>
        <div
          className={`px-3 py-1 rounded text-xs font-medium text-white ${variantClass}`}
        >
          Execute
        </div>
      </div>
    </button>
  );
};

export default QuickActions;
