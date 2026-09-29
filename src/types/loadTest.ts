export type WorkflowType = 'github-actions' | 'load-test';

export type LoadTestCategory =
  | 'Target Server'
  | 'Traffic Profile'
  | 'User Journey'
  | 'SLA & Assertions'
  | 'AI Agent Strategy';

export interface LoadTestConfig {
  baseUrl?: string;
  virtualUsers?: number;
  rampUpSeconds?: number;
  durationSeconds?: number;
  requestsPerSecond?: number;
  httpMethod?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpointPath?: string;
  headers?: Record<string, string>;
  body?: string;
  expectedStatus?: number;
  maxP95LatencyMs?: number;
  maxErrorPercentage?: number;
  aiPrompt?: string;
  aiModelProvider?: 'openrouter' | 'ollama' | 'gemini' | 'openai' | 'anthropic' | 'laya';
  aiApiKey?: string;
  aiCustomEndpoint?: string;
  thinkTimeMs?: number;
  [key: string]: any;
}

export interface LoadTestMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  rps: number;
  minLatencyMs: number;
  avgLatencyMs: number;
  maxLatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  statusCodes: Record<string, number>;
  estimatedCostUsd: number;
  cpuUsagePct: number;
  memoryUsageMb: number;
  slaPassed: boolean;
}
