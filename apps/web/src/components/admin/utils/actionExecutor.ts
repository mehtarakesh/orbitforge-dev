// Action execution utility for admin dashboard

export interface ExecuteOptions {
  onProgress?: (progress: number) => void;
  onLog?: (message: string) => void;
}

export async function executeAction(
  actionName: string,
  scriptName: string,
  options: ExecuteOptions = {}
): Promise<any> {
  const { onProgress, onLog } = options;

  try {
    onLog?.(`Starting: ${actionName}`);
    onProgress?.(10);

    const response = await fetch('/api/admin/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action_name: actionName,
        script_name: scriptName,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Execution failed');
    }

    onProgress?.(50);
    onLog?.(`Processing: ${actionName}`);

    const data = await response.json();

    onProgress?.(90);
    onLog?.(`Completed: ${actionName}`);

    return data;
  } catch (error) {
    onLog?.(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

export async function executeServiceControl(
  serviceId: string,
  action: 'start' | 'stop' | 'restart'
): Promise<any> {
  const response = await fetch(`/api/admin/services/${serviceId}/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || `Failed to ${action} service`);
  }

  return response.json();
}
