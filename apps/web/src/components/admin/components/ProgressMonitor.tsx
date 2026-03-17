'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface ProgressMonitorProps {
  status: 'running' | 'completed' | 'error';
  progress: number;
  logs: string[];
  onClose: () => void;
}

const ProgressMonitor: React.FC<ProgressMonitorProps> = ({ status, progress, logs, onClose }) => {
  const isCompleted = status === 'completed';
  const isError = status === 'error';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-2xl max-h-96 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {status === 'running' && <Clock className="w-5 h-5 text-yellow-400 animate-spin" />}
            {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-400" />}
            {isError && <AlertCircle className="w-5 h-5 text-red-400" />}
            <h3 className="font-bold">
              {status === 'running' && 'Processing...'}
              {isCompleted && 'Completed!'}
              {isError && 'Error'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="p-4 border-b border-gray-700">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isError ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">{progress}% complete</p>
        </div>

        {/* Logs */}
        <div className="flex-1 overflow-auto p-4 space-y-1">
          {logs.map((log, idx) => (
            <p key={idx} className="text-xs font-mono text-gray-300">
              {log}
            </p>
          ))}
          {logs.length === 0 && (
            <p className="text-xs text-gray-500 italic">Waiting for output...</p>
          )}
        </div>

        {/* Actions */}
        {(isCompleted || isError) && (
          <div className="p-4 border-t border-gray-700 flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressMonitor;
