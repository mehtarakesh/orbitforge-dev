'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Workspace {
  id: number;
  name: string;
  slug: string;
  subscription_tier: string;
  usage_generations_count: number;
  usage_preview_minutes: number;
  usage_deployments_count: number;
}

interface Project {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  template_id: string | null;
  current_version_id: number | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export default function WorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.workspaceId;
  
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [token, workspaceId, router]);

  const fetchData = async () => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      const [wsRes, projRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/workspaces/${workspaceId}`, { headers }),
        fetch(`${API_URL}/api/v1/workspaces/${workspaceId}/projects`, { headers }),
      ]);

      if (!wsRes.ok) throw new Error('Failed to fetch workspace');
      
      const wsData = await wsRes.json();
      setWorkspace(wsData);

      if (projRes.ok) {
        const projData = await projRes.json();
        setProjects(projData);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/api/v1/workspaces/${workspaceId}/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: newProjectName,
          description: newProjectDesc 
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Failed to create project');
      }
      
      const project = await res.json();
      setShowCreateModal(false);
      setNewProjectName('');
      setNewProjectDesc('');
      fetchData();
      router.push(`/dashboard/${workspaceId}/projects/${project.id}`);
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
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
          <span>/</span>
          <span>{workspace?.name}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{workspace?.name}</h1>
            <p className="text-gray-600">@{workspace?.slug} · <span className="badge badge-primary">{workspace?.subscription_tier}</span></p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            + New Project
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <div className="card-content text-center">
            <div className="text-3xl font-bold text-primary">{workspace?.usage_generations_count || 0}</div>
            <div className="text-sm text-gray-600">Generations</div>
          </div>
        </div>
        <div className="card">
          <div className="card-content text-center">
            <div className="text-3xl font-bold text-primary">{workspace?.usage_preview_minutes?.toFixed(0) || 0}</div>
            <div className="text-sm text-gray-600">Preview Minutes</div>
          </div>
        </div>
        <div className="card">
          <div className="card-content text-center">
            <div className="text-3xl font-bold text-primary">{workspace?.usage_deployments_count || 0}</div>
            <div className="text-sm text-gray-600">Deployments</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          {error}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Projects</h2>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-2xl">📁</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
          <p className="text-gray-600 mb-6">Create your first project to start building</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/${workspaceId}/projects/${project.id}`}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="card-content">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{project.name}</h3>
                    <p className="text-sm text-gray-500">@{project.slug}</p>
                  </div>
                  {project.template_id && (
                    <span className="badge badge-success">{project.template_id}</span>
                  )}
                </div>
                {project.description && (
                  <p className="text-sm text-gray-600 mt-2">{project.description}</p>
                )}
                <div className="mt-4 text-xs text-gray-500">
                  Created {new Date(project.created_at).toLocaleDateString()}
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
              <h2 className="card-title">Create New Project</h2>
            </div>
            <form onSubmit={createProject}>
              <div className="card-content">
                <div className="form-group">
                  <label className="label">Project Name</label>
                  <input
                    type="text"
                    className="input"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="My Awesome App"
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label className="label">Description (optional)</label>
                  <textarea
                    className="input"
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                    placeholder="A brief description of your project"
                    rows={3}
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
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
