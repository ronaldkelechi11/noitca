export type NodeCategory = 
  | 'Triggers'
  | 'Repository'
  | 'Git'
  | 'Artifacts'
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
  repositoryUrl?: string;
  targetPath?: string;
  credentialsToken?: string;
  fetchDepth?: number;
  submodules?: boolean | string;
  fetchTags?: boolean;
  branchName?: string;
  sourceBranch?: string;
  targetBranch?: string;
  createIfMissing?: boolean;
  commitSha?: string;
  message?: string;
  authorName?: string;
  authorEmail?: string;
  files?: string;
  forcePush?: boolean;
  pushTags?: boolean;
  tagName?: string;
  annotationMessage?: string;
  releaseName?: string;
  generateNotes?: boolean;
  isDraft?: boolean;
  isPrerelease?: boolean;
  runtimeVersion?: string;
  command?: string;
  artifactName?: string;
  artifactPath?: string;
  destinationPath?: string;
  retentionDays?: number;
  ifNoFilesFound?: string;
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
