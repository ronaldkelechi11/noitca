import React, { useState, useEffect } from 'react';
import {
  HiXMark,
  HiPlay,
  HiStop,
  HiCpuChip,
  HiArrowTrendingUp,
  HiCurrencyDollar,
  HiShieldCheck,
  HiClock,
  HiServer,
  HiSignal,
  HiCommandLine
} from 'react-icons/hi2';
import { WorkflowNode, NodeConnection } from '../types/workflow';

interface LoadTestAnalyticsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  workflowName: string;
  nodes: WorkflowNode[];
  connections: NodeConnection[];
  onOpenScriptExport: () => void;
}

export const LoadTestAnalyticsPanel: React.FC<LoadTestAnalyticsPanelProps> = ({
  isOpen,
  onClose,
  workflowName,
  nodes,
  onOpenScriptExport,
}) => {
  const [isRunningSim, setIsRunningSim] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  // Extract config from nodes
  const targetNode = nodes.find(n => n.category === 'Target Server' || n.config.baseUrl);
  const baseUrl = targetNode?.config.baseUrl || 'https://api.example.com';

  const trafficNode = nodes.find(n => n.category === 'Traffic Profile' || n.config.virtualUsers);
  const virtualUsers = trafficNode?.config.virtualUsers || 50;
  const rampUp = trafficNode?.config.rampUpSeconds || 5;
  const duration = trafficNode?.config.durationSeconds || 30;

  const slaNode = nodes.find(n => n.category === 'SLA & Assertions');
  const maxP95 = slaNode?.config.maxP95LatencyMs || 500;
  const maxErrPct = slaNode?.config.maxErrorPercentage || 2.0;

  const httpNodes = nodes.filter(n => n.category === 'User Journey' || n.config.httpMethod);

  // Compute calculated metrics preview
  const estimatedRps = Math.round(virtualUsers * (1000 / 200));
  const estimatedTotalReqs = estimatedRps * duration;
  const estimatedP95 = Math.round(80 + (virtualUsers * 2.5));
  const estimatedErrRate = virtualUsers > 150 ? 2.4 : 0.2;
  const isSlaPassed = estimatedP95 <= maxP95 && estimatedErrRate <= maxErrPct;

  // Cost Estimation calculation (AWS / GCP Webserver sizing for given RPS)
  const requiredServerCores = Math.max(1, Math.ceil(estimatedRps / 500));
  const hourlyCostUsd = requiredServerCores * 0.048; // ~$0.048/hr per core instance
  const monthlyCostUsd = hourlyCostUsd * 730;

  // Live Simulation Trigger
  useEffect(() => {
    let timer: any;
    if (isRunningSim) {
      setProgress(0);
      setLogs([
        `[${new Date().toLocaleTimeString()}] 🚀 Initializing Noitca Load Test Engine...`,
        `[${new Date().toLocaleTimeString()}] Target: ${baseUrl}`,
        `[${new Date().toLocaleTimeString()}] Concurrency: ${virtualUsers} Virtual User Threads`,
        `[${new Date().toLocaleTimeString()}] Spawning background curl HTTP request workers...`
      ]);

      const intervalMs = (duration * 1000) / 100;
      let step = 0;

      timer = setInterval(() => {
        step++;
        setProgress(step);

        if (step === 20) {
          setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 📈 Traffic ramp-up complete (${rampUp}s). Operating at full concurrency.`]);
        } else if (step === 50) {
          setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 📊 Intermediate Stats: ${Math.round(estimatedRps * (duration * 0.5))} reqs processed | p95 latency: ${estimatedP95}ms`]);
        } else if (step === 80) {
          setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🔍 Verifying SLA assertions against p95 threshold (${maxP95}ms)...`]);
        } else if (step >= 100) {
          clearInterval(timer);
          setIsRunningSim(false);
          setLogs(prev => [
            ...prev,
            `[${new Date().toLocaleTimeString()}] ✅ Load test completed successfully!`,
            `[${new Date().toLocaleTimeString()}] 🏆 SLA Status: ${isSlaPassed ? 'PASSED' : 'FAILED'}`
          ]);
        }
      }, intervalMs);
    }

    return () => clearInterval(timer);
  }, [isRunningSim, duration, baseUrl, virtualUsers, rampUp, estimatedRps, estimatedP95, maxP95, isSlaPassed]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in font-sans">
      <div className="bg-black border border-neutral-800 rounded-2xl w-full max-w-5xl flex flex-col h-[700px] shadow-2xl overflow-hidden shadow-emerald-500/10">

        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <HiCpuChip className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">{workflowName}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                  ANALYTICS PREVIEW & DEBUG
                </span>
              </div>
              <p className="text-xs text-neutral-400">Target Server Load & Real-Time Performance Analytics Dashboard</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenScriptExport}
              className="px-3.5 py-1.5 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-yellow-400 border border-yellow-500/30 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <HiCommandLine className="w-4 h-4" />
              <span>Export Bash Script</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            >
              <HiXMark className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-neutral-950/60">

          {/* Key KPI Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

            {/* User Threshold / Concurrency */}
            <div className="p-4 bg-black border border-neutral-800 rounded-xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>User Threshold</span>
                <HiServer className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black font-mono text-white">{virtualUsers}</span>
                <span className="text-xs text-neutral-400 ml-1">VUsers</span>
              </div>
              <div className="mt-2 text-[10px] text-neutral-500 font-mono">
                Ramp-Up: {rampUp}s | Duration: {duration}s
              </div>
            </div>

            {/* Throughput RPS */}
            <div className="p-4 bg-black border border-neutral-800 rounded-xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Est. Throughput</span>
                <HiArrowTrendingUp className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black font-mono text-cyan-400">{estimatedRps}</span>
                <span className="text-xs text-neutral-400 ml-1">req/sec</span>
              </div>
              <div className="mt-2 text-[10px] text-neutral-500 font-mono">
                Total Reqs: ~{estimatedTotalReqs.toLocaleString()}
              </div>
            </div>

            {/* p95 Latency */}
            <div className="p-4 bg-black border border-neutral-800 rounded-xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>p95 Latency</span>
                <HiClock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black font-mono text-amber-300">{estimatedP95}</span>
                <span className="text-xs text-neutral-400 ml-1">ms</span>
              </div>
              <div className="mt-2 text-[10px] text-neutral-500 font-mono">
                Max Allowed: {maxP95}ms
              </div>
            </div>

            {/* SLA Status */}
            <div className={`p-4 bg-black border rounded-xl flex flex-col justify-between ${
              isSlaPassed ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-rose-500/40 bg-rose-950/10'
            }`}>
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>SLA Gate</span>
                <HiShieldCheck className={`w-4 h-4 ${isSlaPassed ? 'text-emerald-400' : 'text-rose-400'}`} />
              </div>
              <div className="mt-2">
                <span className={`text-xl font-black font-mono ${isSlaPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isSlaPassed ? 'PASSED' : 'FAILED'}
                </span>
              </div>
              <div className="mt-2 text-[10px] text-neutral-500 font-mono">
                Error Rate: {estimatedErrRate}% (Max {maxErrPct}%)
              </div>
            </div>

          </div>

          {/* Webserver Load & Cost Estimation Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Cloud Server Sizing & Cost Analysis */}
            <div className="p-4 bg-black border border-neutral-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <div className="flex items-center space-x-2">
                  <HiCurrencyDollar className="w-4 h-4 text-yellow-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Webserver Sizing & Cost Estimation</h4>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">AWS / GCP Tier</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[11px]">Req. Compute Cores</span>
                  <span className="font-mono font-bold text-white text-sm">{requiredServerCores} CPU Cores</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Recommended Tier</span>
                  <span className="font-mono font-bold text-yellow-400 text-sm">c6i.{requiredServerCores > 2 ? 'xlarge' : 'large'}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Hourly Server Cost</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">${hourlyCostUsd.toFixed(3)} / hr</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Est. Monthly Cost</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">${monthlyCostUsd.toFixed(2)} / mo</span>
                </div>
              </div>
            </div>

            {/* Target Endpoints Journey Steps */}
            <div className="p-4 bg-black border border-neutral-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <div className="flex items-center space-x-2">
                  <HiSignal className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">User Journey HTTP Sequence ({httpNodes.length})</h4>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">{baseUrl}</span>
              </div>

              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {httpNodes.map((node) => (
                  <div key={node.id} className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                        {node.config.httpMethod || 'GET'}
                      </span>
                      <span className="font-mono font-medium text-neutral-200">{node.config.endpointPath || '/'}</span>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono">Think: {node.config.thinkTimeMs || 100}ms</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Live Debug Simulation Terminal Log */}
          <div className="p-4 bg-black border border-neutral-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HiCommandLine className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Live Load Test Simulator Console</h4>
              </div>

              <div className="flex items-center space-x-2">
                {isRunningSim ? (
                  <button
                    onClick={() => setIsRunningSim(false)}
                    className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <HiStop className="w-3.5 h-3.5" />
                    <span>Stop Simulation</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsRunningSim(true)}
                    className="px-3.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    <HiPlay className="w-3.5 h-3.5" />
                    <span>Run Simulated Test</span>
                  </button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {isRunningSim && (
              <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {/* Terminal Window */}
            <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-3 font-mono text-xs text-neutral-300 h-40 overflow-y-auto space-y-1">
              {logs.length === 0 ? (
                <span className="text-neutral-600 italic">Click "Run Simulated Test" above to initiate a preview test execution run...</span>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="leading-relaxed font-mono">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between text-xs">
          <span className="text-neutral-400 font-mono">Zero-dependency script ready for Linux / macOS / WSL</span>
          <button
            onClick={onOpenScriptExport}
            className="px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-lg shadow-lg shadow-yellow-500/20 transition-all cursor-pointer flex items-center space-x-2"
          >
            <HiCommandLine className="w-4 h-4" />
            <span>Generate Executable Bash Script (.sh)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
