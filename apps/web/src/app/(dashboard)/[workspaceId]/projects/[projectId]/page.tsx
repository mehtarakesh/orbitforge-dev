'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Project {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  template_id: string | null;
  current_version_id: number | null;
  is_archived: boolean;
  created_at: string;
}

interface GenerationJob {
  id: number;
  prompt: string;
  status: string;
  created_at: string;
  completed_at: string | null;
}

export default function ProjectPage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.workspaceId;
  const projectId = params.projectId;
  
  const [project, setProject] = useState<Project | null>(null);
  const [generations, setGenerations] = useState<GenerationJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
    
    // Poll for generation status
    const interval = setInterval(() => {
      if (generating) {
        fetchGenerations();
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [token, workspaceId, projectId, router, generating]);

  const fetchData = async () => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      const [projRes, genRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/workspaces/${workspaceId}/projects/${projectId}`, { headers }),
        fetch(`${API_URL}/api/v1/workspaces/${workspaceId}/projects/${projectId}/generations`, { headers }),
      ]);

      if (!projRes.ok) throw new Error('Failed to fetch project');
      
      const projData = await projRes.json();
      setProject(projData);

      if (genRes.ok) {
        const genData = await genRes.json();
        setGenerations(genData);
        
        // Check if there's an active generation
        const activeGen = genData.find((g: GenerationJob) => 
          ['pending', 'planning', 'generating', 'validating', 'fixing'].includes(g.status)
        );
        if (activeGen) {
          setGenerating(true);
          setGenerationStatus(activeGen.status);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenerations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/workspaces/${workspaceId}/projects/${projectId}/generations`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setGenerations(data);
        
        const activeGen = data.find((g: GenerationJob) => 
          ['pending', 'planning', 'generating', 'validating', 'fixing'].includes(g.status)
        );
        
        if (!activeGen && generating) {
          setGenerating(false);
          setGenerationStatus(null);
          setShowGenerateModal(false);
        } else if (activeGen) {
          setGenerationStatus(activeGen.status);
        }
      }
    } catch (err: any) {
      console.error('Error fetching generations:', err);
    }
  };

  const startGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setGenerationStatus('pending');
    
    try {
      const res = await fetch(`${API_URL}/api/v1/workspaces/${workspaceId}/projects/${projectId}/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Failed to start generation');
      }
      
      const job = await res.json();
      setGenerations(prev => [job, ...prev]);
      setPrompt('');
      
      // Keep polling until complete
      pollGeneration(job.id);
    } catch (err: any) {
      setError(err.message);
      setGenerating(false);
    }
  };

  const pollGeneration = async (jobId: number) => {
    const poll = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/workspaces/${workspaceId}/projects/${projectId}/generations/${jobId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        if (res.ok) {
          const job = await res.json();
          setGenerationStatus(job.status);
          
          if (['completed', 'failed', 'cancelled'].includes(job.status)) {
            setGenerating(false);
            fetchData();
          } else {
            setTimeout(poll, 3000);
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    };
    
    setTimeout(poll, 3000);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { class: string; label: string }> = {
      pending: { class: 'badge-warning', label: 'Pending' },
      planning: { class: 'badge-primary', label: 'Planning' },
      generating: { class: 'badge-primary', label: 'Generating' },
      validating: { class: 'badge-primary', label: 'Validating' },
      fixing: { class: 'badge-primary', label: 'Fixing' },
      completed: { class: 'badge-success', label: 'Completed' },
      failed: { class: 'badge-error', label: 'Failed' },
      cancelled: { class: 'badge-error', label: 'Cancelled' },
    };
    
    const { class: badgeClass, label } = statusMap[status] || { class: 'badge-primary', label: status };
    return <span className={`badge ${badgeClass}`}>{label}</span>;
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
          <Link href={`/dashboard/${workspaceId}`} className="hover:text-gray-700">{project?.name}</Link>
          <span>/</span>
          <span>Generations</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{project?.name}</h1>
            <p className="text-gray-600">{project?.description || 'No description'}</p>
          </div>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="btn btn-primary"
            disabled={generating}
          >
            {generating ? 'Generating...' : 'Generate App'}
          </button>
        </div>
      </div>

      {generating && (
        <div className="card mb-6 border-primary">
          <div className="card-content">
            <div className="flex items-center gap-4">
              <div className="spinner" style={{ width: 24, height: 24 }}></div>
              <div>
                <div className="font-medium">Generating your application...</div>
                <div className="text-sm text-gray-600 capitalize">Status: {generationStatus}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ 
                    width: generationStatus === 'pending' ? '10%' : 
                           generationStatus === 'planning' ? '25%' :
                           generationStatus === 'generating' ? '50%' :
                           generationStatus === 'validating' ? '75%' :
                           generationStatus === 'fixing' ? '90%' : '100%'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-4">
          {error}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Generation History</h2>

      {generations.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">No generations yet</h2>
          <p className="text-gray-600 mb-6">Describe your app and let AI build it for you</p>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="btn btn-primary"
          >
            Generate Your First App
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {generations.map((gen) => (
            <div key={gen.id} className="card">
              <div className="card-content">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{gen.prompt}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>ID: {gen.id}</span>
                      <span>Created: {new Date(gen.created_at).toLocaleString()}</span>
                      {gen.completed_at && (
                        <span>Completed: {new Date(gen.completed_at).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(gen.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card w-full max-w-2xl mx-4">
            <div className="card-header">
              <h2 className="card-title">Generate Application</h2>
              <p className="card-description">Describe what you want to build</p>
            </div>
            <form onSubmit={startGeneration}>
              <div className="card-content">
                <div className="form-group">
                  <label className="label">What do you want to build?</label>
                  <textarea
                    className="input"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A SaaS dashboard with user authentication, analytics charts, and a billing page"
                    rows={6}
                    required
                    autoFocus
                    disabled={generating}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Be as descriptive as possible for better results
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Example prompts:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• "A blog with markdown support, comments, and newsletter signup"</li>
                    <li>• "An e-commerce store with product catalog, cart, and checkout"</li>
                    <li>• "A CRM with leads, deals pipeline, and contact management"</li>
                  </ul>
                </div>
              </div>
              <div className="card-footer flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="btn btn-secondary flex-1"
                  disabled={generating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                  disabled={generating || !prompt.trim()}
                >
                  {generating ? (
                    <span className="flex items-center gap-2">
                      <span className="spinner" style={{ width: 16, height: 16 }}></span>
                      Generating...
                    </span>
                  ) : (
                    'Generate App'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
