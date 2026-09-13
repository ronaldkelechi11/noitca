import { WorkflowNode, NodeConnection, FlowOrientation } from '../types/workflow';

export interface NoitcaFilePayload {
  $schema?: string;
  app: 'noitca';
  version: string;
  name: string;
  savedAt: string;
  orientation: FlowOrientation;
  nodeCount: number;
  connectionCount: number;
  nodes: WorkflowNode[];
  connections: NodeConnection[];
}

/**
 * Sanitizes a string into a safe filename
 */
export function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'workflow';
}

/**
 * Saves current workflow to local disk as a .noitca file
 */
export function saveAsNoitcaFile(
  name: string,
  nodes: WorkflowNode[],
  connections: NodeConnection[],
  orientation: FlowOrientation
): void {
  const payload: NoitcaFilePayload = {
    $schema: 'https://noitca.dev/schemas/workflow-v1.json',
    app: 'noitca',
    version: '1.0',
    name: name.trim() || 'Untitled Workflow',
    savedAt: new Date().toISOString(),
    orientation,
    nodeCount: nodes.length,
    connectionCount: connections.length,
    nodes,
    connections,
  };

  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const filename = `${sanitizeFilename(name)}.noitca`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parses and validates a loaded .noitca or .json file
 */
export async function loadFromNoitcaFile(file: File): Promise<{
  name: string;
  orientation: FlowOrientation;
  nodes: WorkflowNode[];
  connections: NodeConnection[];
}> {
  const text = await file.text();
  let data: any;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON file format.');
  }

  if (!data || typeof data !== 'object') {
    throw new Error('Malformed .noitca file: Expected a JSON object.');
  }

  if (!Array.isArray(data.nodes)) {
    throw new Error('Malformed .noitca file: Missing valid "nodes" array.');
  }

  const orientation: FlowOrientation = data.orientation === 'horizontal' ? 'horizontal' : 'vertical';
  const name = typeof data.name === 'string' && data.name.trim() ? data.name.trim() : file.name.replace(/\.(noitca|json)$/i, '');
  const nodes: WorkflowNode[] = data.nodes;
  const connections: NodeConnection[] = Array.isArray(data.connections) ? data.connections : [];

  return {
    name,
    orientation,
    nodes,
    connections,
  };
}
