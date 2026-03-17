'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Clock } from 'lucide-react';

const DocumentationCenter: React.FC = () => {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const response = await fetch('/api/admin/docs');
      const data = await response.json();
      setDocs(data.docs);
    } catch (error) {
      console.error('Failed to fetch docs:', error);
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
      <h1 className="text-3xl font-bold">Documentation Center</h1>

      {/* Auto-Generated Docs */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          Auto-Generated Documentation
        </h2>
        <p className="text-sm text-gray-300 mb-4">
          Every feature is documented automatically with full evolution history and decision logs.
        </p>
        <div className="space-y-3">
          {docs.map((doc, idx) => (
            <DocCard key={idx} doc={doc} />
          ))}
        </div>
      </div>

      {/* Agent Thinking */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Agent Thinking & Analysis</h2>
        <p className="text-sm text-gray-300 mb-4">
          Full internal monologue of agents showing analysis → decision → result.
        </p>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
          💭 View Agent Thoughts
        </button>
      </div>

      {/* User Journeys */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">User Journeys</h2>
        <p className="text-sm text-gray-300 mb-4">
          Real user paths through the application with success rates and bottleneck analysis.
        </p>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
          👥 View All Journeys
        </button>
      </div>

      {/* API Documentation */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-green-400" />
          API Documentation
        </h2>
        <p className="text-sm text-gray-300 mb-4">
          Auto-generated from code with request/response examples and error handling guides.
        </p>
        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors">
          📚 View API Docs
        </button>
      </div>
    </div>
  );
};

const DocCard: React.FC<{ doc: any }> = ({ doc }) => (
  <div className="p-4 bg-gray-700/50 rounded border border-gray-600 hover:border-blue-600 transition-colors cursor-pointer">
    <div className="flex items-start justify-between mb-2">
      <h3 className="font-medium">{doc.name}</h3>
      <span className="text-xs text-gray-400">{doc.date}</span>
    </div>
    <p className="text-sm text-gray-300 mb-3">{doc.description}</p>
    <div className="flex flex-wrap gap-2 mb-3">
      {doc.versions?.map((version: string, idx: number) => (
        <span key={idx} className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded">
          {version}
        </span>
      ))}
    </div>
    <div className="flex gap-2">
      <button className="flex-1 px-3 py-2 bg-blue-600/20 text-blue-400 rounded text-xs font-medium hover:bg-blue-600/30 transition-colors">
        📄 View
      </button>
      <button className="flex-1 px-3 py-2 bg-green-600/20 text-green-400 rounded text-xs font-medium hover:bg-green-600/30 transition-colors">
        📥 Export PDF
      </button>
    </div>
  </div>
);

export default DocumentationCenter;
