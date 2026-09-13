export type NodeCategory = 
  | 'Triggers'
  | 'Repository'
  | 'Environment'
  | 'Commands'
  | 'Quality'
  | 'Docker'
  | 'Deployment'
  | 'Logic'
  | 'Verification'
  | 'Notifications';

export type FlowOrientation = 'vertical' | 'horizontal';

export interface NodeConfig {
  branch?: string;
  repository?: string;
  runtimeVersion?: string;
  command?: string;
  artifactName?: string;
  artifactPath?: string;
  dockerImage?: string;
  dockerTag?: string;
  sshHost?: string;
  sshUser?: string;
  sshPort?: number;
  healthUrl?: string;
  expectedStatus?: number;
  condition?: string;
  envVars?: Record<string, string>;
  secrets?: Record<string, string>;
  [key: string]: any;
}

export interface WorkflowNode {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  category: NodeCategory;
  x: number;
  y: number;
  iconType: string;
  badge?: string;
  badgeColor?: string;
  config: NodeConfig;
}

export interface NodeConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
}

export interface WorkflowState {
  nodes: WorkflowNode[];
  connections: NodeConnection[];
}
