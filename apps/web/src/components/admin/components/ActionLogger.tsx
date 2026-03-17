'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Clock, Filter, Download } from 'lucide-react';

interface ActionLog {
  id: string;
  action_name: string;
  status: 'completed' | 'failed' | 'running';
  started_at: string;
  completed_at: string;
  duration_ms: number;
  triggered_by: string;
  result?: string;
  error_message?: string;
}

const ActionLogger: React.FC = () => {
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'failed' | 'running'>('all');

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredLogs(logs);
    } else {
      setFilteredLogs(logs.filter((log) => log.status === filter));
    }
  }, [filter, logs]);

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/admin/logs');
      const data = await response.json();
      setLogs(data.logs);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Action Logs</h1>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Logs
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'completed', 'failed', 'running'] as const).map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === filterOption
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {filterOption}
          </button>
        ))}
      </div>

      {/* Logs Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-700 border-b border-gray-600">
                <th className="px-4 py-3 text-left font-medium">Action</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Started At</th>
                <th className="px-4 py-3 text-left font-medium">Duration</th>
                <th className="px-4 py-3 text-left font-medium">Triggered By</th>
                <th className="px-4 py-3 text-left font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <LogRow key={log.id} log={log} />
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <p>No logs found</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Actions"
          value={logs.length}
          color="blue"
        />
        <SummaryCard
          label="Completed"
          value={logs.filter((l) => l.status === 'completed').length}
          color="green"
        />
        <SummaryCard
          label="Failed"
          value={logs.filter((l) => l.status === 'failed').length}
          color="red"
        />
        <SummaryCard
          label="Success Rate"
          value={`${(
            (logs.filter((l) => l.status === 'completed').length / logs.length) *
            100
          ).toFixed(1)}%`}
          color="purple"
        />
      </div>
    </div>
  );
};

const LogRow: React.FC<{ log: ActionLog }> = ({ log }) => {
  const statusIcon = {
    completed: <CheckCircle2 className="w-4 h-4 text-green-400" />,
    failed: <AlertCircle className="w-4 h-4 text-red-400" />,
    running: <Clock className="w-4 h-4 text-yellow-400 animate-spin" />,
  }[log.status];

  const statusText = {
    completed: 'Completed',
    failed: 'Failed',
    running: 'Running',
  }[log.status];

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
      <td className="px-4 py-3">
        <p className="font-medium">{log.action_name}</p>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {statusIcon}
          <span className="text-xs">{statusText}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-xs text-gray-400">
        {new Date(log.started_at).toLocaleString()}
      </td>
      <td className="px-4 py-3 text-xs text-gray-400">
        {log.duration_ms ? `${(log.duration_ms / 1000).toFixed(2)}s` : 'In progress'}
      </td>
      <td className="px-4 py-3 text-xs text-gray-400">
        {log.triggered_by}
      </td>
      <td className="px-4 py-3">
        <button
          title={log.error_message || log.result || ''}
          className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs hover:bg-blue-600/30 transition-colors"
        >
          View
        </button>
      </td>
    </tr>
  );
};

const SummaryCard: React.FC<{
  label: string;
  value: string | number;
  color: string;
}> = ({ label, value, color }) => {
  const colorClass = {
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    green: 'bg-green-500/10 border-green-500/30 text-green-400',
    red: 'bg-red-500/10 border-red-500/30 text-red-400',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
  }[color] || 'bg-gray-700/50 border-gray-600/50 text-gray-400';

  return (
    <div className={`rounded-lg p-4 border ${colorClass}`}>
      <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

export default ActionLogger;
