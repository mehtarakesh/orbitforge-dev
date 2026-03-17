'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Workspace {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  subscription_tier: string;
  usage_generations_count: number;
  usage_deployments_count: number;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchWorkspaces();
  }, [token, router]);

  const fetchWorkspaces = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/workspaces`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch workspaces');
      }
      
      const data = await res.json();
      setWorkspaces(data);
      
      // Auto-redirect to first workspace if exists
      if (data.length > 0) {
        router.push(`/dashboard/${data[0].id}`);
      }
    } catch (err: any) {
      // If no workspaces, show create option
      if (err.message.includes('Failed to fetch')) {
        setError('Could not connect to API. Make sure the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/api/v1/workspaces`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newWorkspaceName }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Failed to create workspace');
      }
      
      const workspace = await res.json();
      setShowCreateModal(false);
      setNewWorkspaceName('');
      fetchWorkspaces();
      router.push(`/dashboard/${workspace.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" style={{ width: 40, height: 40 }}></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Workspaces</h1>
          <p className="text-gray-600">Manage your workspaces and projects</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          Create Workspace
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          {error}
        </div>
      )}

      {workspaces.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-2xl">🏢</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">No workspaces yet</h2>
          <p className="text-gray-600 mb-6">Create your first workspace to start building apps</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            Create Workspace
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((workspace) => (
            <Link
              key={workspace.id}
              href={`/dashboard/${workspace.id}`}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="card-content">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{workspace.name}</h3>
                    <p className="text-sm text-gray-500">@{workspace.slug}</p>
                  </div>
                  <span className="badge badge-primary">
                    {workspace.subscription_tier}
                  </span>
                </div>
                {workspace.description && (
                  <p className="text-sm text-gray-600 mt-2">{workspace.description}</p>
                )}
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <span>📦 {workspace.usage_generations_count} generations</span>
                  <span>🚀 {workspace.usage_deployments_count} deployments</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card w-full max-w-md mx-4">
            <div className="card-header">
              <h2 className="card-title">Create Workspace</h2>
            </div>
            <form onSubmit={createWorkspace}>
              <div className="card-content">
                <div className="form-group">
                  <label className="label">Workspace Name</label>
                  <input
                    type="text"
                    className="input"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    placeholder="My Awesome Workspace"
                    required
                    autoFocus
                  />
                </div>
              </div>
              <div className="card-footer flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
