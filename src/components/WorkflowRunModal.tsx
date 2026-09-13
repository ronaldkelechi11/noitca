import React, { useState, useEffect, useRef } from 'react';
import { 
  HiXMark, 
  HiArrowPath, 
  HiArrowDownTray, 
  HiCheckCircle, 
  HiXCircle, 
  HiMagnifyingGlass, 
  HiCommandLine, 
  HiClock,
  HiCpuChip,
  HiChevronRight
} from 'react-icons/hi2';
import { WorkflowNode, NodeConnection } from '../types/workflow';
import { resolveExecutionOrder, generateStepLogs, WorkflowRunStep } from '../utils/workflowRunner';

interface WorkflowRunModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflowName: string;
  nodes: WorkflowNode[];
  connections: NodeConnection[];
}

export const WorkflowRunModal: React.FC<WorkflowRunModalProps> = ({
  isOpen,
  onClose,
  workflowName,
  nodes,
  connections,
}) => {
  const [steps, setSteps] = useState<WorkflowRunStep[]>([]);
  const [selectedStepId, setSelectedStepId] = useState<string | 'all'>('all');
  const [runStatus, setRunStatus] = useState<'queued' | 'running' | 'success' | 'failed'>('queued');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [searchFilter, setSearchFilter] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  // Initialize and run the simulation whenever modal opens
  useEffect(() => {
    if (!isOpen) {
      clearInterval(timerRef.current);
      return;
    }

    startRunSimulation();

    return () => {
      clearInterval(timerRef.current);
    };
  }, [isOpen, nodes, connections]);

  // Auto-scroll terminal to bottom as logs arrive
  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [steps, autoScroll]);

  const startRunSimulation = () => {
    clearInterval(timerRef.current);
    setElapsedSeconds(0);
    setRunStatus('running');
    setSelectedStepId('all');

    // Timer ticking
    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 100);

    // Resolve execution steps
    const orderedNodes = resolveExecutionOrder(nodes, connections);

    const initialSteps: WorkflowRunStep[] = [
      {
        id: 'step-setup',
        title: 'Set up runner environment',
        type: 'setup',
        category: 'System',
        status: 'running',
        durationMs: 0,
        logs: [
          `[${new Date().toISOString()}] ##[group]Virtual Environment`,
          `[${new Date().toISOString()}] Operating System: Ubuntu 24.04.1 LTS`,
          `[${new Date().toISOString()}] Runner Image: ubuntu-24.04`,
          `[${new Date().toISOString()}] Image Version: 20260901.1.0`,
          `[${new Date().toISOString()}] Host Architecture: x86_64`,
          `[${new Date().toISOString()}] Runner Context: Local-First Daemon (noitca)`,
          `[${new Date().toISOString()}] ##[endgroup]`,
        ],
      },
      ...orderedNodes.map((node) => ({
        id: node.id,
        nodeId: node.id,
        title: node.title,
        type: node.type,
        category: node.category,
        status: 'pending' as const,
        durationMs: 0,
        logs: [],
      })),
      {
        id: 'step-teardown',
        title: 'Complete job & Post-run cleanup',
        type: 'teardown',
        category: 'System',
        status: 'pending',
        durationMs: 0,
        logs: [],
      },
    ];

    setSteps(initialSteps);

    // Step-by-step sequential progression simulation
    let currentStepIndex = 0;

    const executeNextStep = () => {
      if (currentStepIndex >= initialSteps.length) {
        clearInterval(timerRef.current);
        setRunStatus('success');
        return;
      }

      const step = initialSteps[currentStepIndex];

      setSteps(prev => prev.map((s, idx) => {
        if (idx === currentStepIndex) {
          let stepLogs = s.logs;
          if (step.id === 'step-setup') {
            // Already logged
          } else if (step.id === 'step-teardown') {
            const ts = new Date().toISOString();
            stepLogs = [
              `[${ts}] ##[group]Post-run summary`,
              `[${ts}] Cleaning up workspace /home/runner/work/noitca/noitca`,
              `[${ts}] Job completed successfully in ${((Date.now() - startTime) / 1000).toFixed(1)}s`,
              `[${ts}] All ${initialSteps.length} steps exited with status code 0 (SUCCESS)`,
              `[${ts}] ##[endgroup]`,
            ];
          } else {
            const targetNode = orderedNodes.find(n => n.id === step.id);
            if (targetNode) {
              stepLogs = generateStepLogs(targetNode, currentStepIndex - 1);
            }
          }

          return {
            ...s,
            status: 'running',
            logs: stepLogs,
          };
        }
        return s;
      }));

      // Realistic random duration between 400ms and 1100ms per step
      const stepDuration = Math.floor(Math.random() * 500) + 450;

      setTimeout(() => {
        setSteps(prev => prev.map((s, idx) => {
          if (idx === currentStepIndex) {
            return {
              ...s,
              status: 'success',
              durationMs: stepDuration,
            };
          }
          return s;
        }));

        currentStepIndex++;
        executeNextStep();
      }, stepDuration);
    };

    setTimeout(executeNextStep, 350);
  };

  if (!isOpen) return null;

  // Gather logs to display based on selection and filter
  const displayedLogs: { stepTitle: string; line: string }[] = [];

  steps.forEach(s => {
    if (selectedStepId === 'all' || selectedStepId === s.id) {
      s.logs.forEach(line => {
        if (!searchFilter || line.toLowerCase().includes(searchFilter.toLowerCase())) {
          displayedLogs.push({ stepTitle: s.title, line });
        }
      });
    }
  });

  const handleDownloadLogs = () => {
    const fullLogText = steps.flatMap(s => [
      `=== [STEP] ${s.title} (${s.status.toUpperCase()} - ${(s.durationMs / 1000).toFixed(1)}s) ===`,
      ...s.logs,
      ''
    ]).join('\n');

    const blob = new Blob([fullLogText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workflowName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-run.log`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 animate-fade-in">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-6xl h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="h-16 px-6 bg-black border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
              <HiCommandLine className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white tracking-tight">{workflowName}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                  Run #1
                </span>
                {runStatus === 'running' && (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 text-[10px] font-mono font-bold animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" />
                    <span>In progress</span>
                  </span>
                )}
                {runStatus === 'success' && (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 text-[10px] font-mono font-bold">
                    <HiCheckCircle className="w-3 h-3" />
                    <span>Workflow Succeeded</span>
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3 text-[11px] text-neutral-400 font-mono mt-0.5">
                <span className="flex items-center space-x-1">
                  <HiCpuChip className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Runner: ubuntu-latest</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <HiClock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Duration: {elapsedSeconds}s</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={startRunSimulation}
              disabled={runStatus === 'running'}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                runStatus === 'running'
                  ? 'bg-neutral-900 text-neutral-600 cursor-not-allowed border border-neutral-800'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-yellow-400 hover:text-yellow-300 border border-neutral-800 hover:border-yellow-400/40 cursor-pointer'
              }`}
              title="Re-run entire workflow"
            >
              <HiArrowPath className={`w-3.5 h-3.5 ${runStatus === 'running' ? 'animate-spin' : ''}`} />
              <span>Re-run Workflow</span>
            </button>

            <button
              onClick={handleDownloadLogs}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              title="Download entire log file (.log)"
            >
              <HiArrowDownTray className="w-3.5 h-3.5 text-neutral-400" />
              <span>Download Logs</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer ml-2"
              title="Close Console (Esc)"
            >
              <HiXMark className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content: Split Rail View */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Rail: Steps List */}
          <div className="w-80 bg-neutral-950 border-r border-neutral-900 flex flex-col shrink-0">
            <div className="p-3 border-b border-neutral-900 bg-black/40 flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider font-semibold">
                Jobs & Steps ({steps.length})
              </span>
              <button
                onClick={() => setSelectedStepId('all')}
                className={`text-[11px] font-mono px-2 py-0.5 rounded transition-colors ${
                  selectedStepId === 'all'
                    ? 'bg-yellow-400 text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                All Logs
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {steps.map((step, idx) => {
                const isSelected = selectedStepId === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setSelectedStepId(step.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-900 border border-yellow-400/40 text-white'
                        : 'hover:bg-neutral-900/60 text-neutral-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                      {step.status === 'success' && (
                        <HiCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {step.status === 'running' && (
                        <div className="w-3.5 h-3.5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin shrink-0" />
                      )}
                      {step.status === 'pending' && (
                        <div className="w-3 h-3 rounded-full border border-neutral-700 bg-neutral-800 shrink-0" />
                      )}
                      {step.status === 'failed' && (
                        <HiXCircle className="w-4 h-4 text-red-400 shrink-0" />
                      )}

                      <div className="truncate">
                        <div className="font-medium truncate text-white">{step.title}</div>
                        <div className="text-[10px] text-neutral-500 font-mono truncate">
                          {idx === 0 || idx === steps.length - 1 ? step.category : step.type}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 font-mono text-[10px] text-neutral-500 flex items-center space-x-1">
                      {step.durationMs > 0 && (
                        <span>{(step.durationMs / 1000).toFixed(1)}s</span>
                      )}
                      <HiChevronRight className="w-3 h-3 text-neutral-600" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Area: Terminal Logs Console */}
          <div className="flex-1 bg-black flex flex-col overflow-hidden">
            
            {/* Terminal Filter Toolbar */}
            <div className="h-10 px-4 bg-neutral-950 border-b border-neutral-900 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center space-x-2 flex-1 max-w-sm">
                <HiMagnifyingGlass className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Filter logs (e.g. error, commit, artifact)..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="bg-transparent border-none text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none w-full"
                />
                {searchFilter && (
                  <button
                    onClick={() => setSearchFilter('')}
                    className="text-neutral-500 hover:text-neutral-300 text-[10px]"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-3 text-[11px] font-mono text-neutral-400">
                <label className="flex items-center space-x-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoScroll}
                    onChange={(e) => setAutoScroll(e.target.checked)}
                    className="accent-yellow-400 rounded"
                  />
                  <span>Auto-scroll</span>
                </label>
                <span>|</span>
                <span>{displayedLogs.length} lines</span>
              </div>
            </div>

            {/* Terminal Log Output Window */}
            <div className="flex-1 p-4 font-mono text-xs text-neutral-300 overflow-y-auto space-y-1 select-text selection:bg-yellow-400 selection:text-black">
              {displayedLogs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-neutral-600 text-sm">
                  Waiting for step logs...
                </div>
              ) : (
                displayedLogs.map((item, idx) => {
                  const isGroup = item.line.includes('##[group]');
                  const isEndGroup = item.line.includes('##[endgroup]');
                  const isCommand = item.line.includes('[command]') || item.line.startsWith('$');
                  const isSuccess = item.line.includes('successful') || item.line.includes('SUCCESS') || item.line.includes('PASS');
                  const isError = item.line.includes('error') || item.line.includes('FAIL') || item.line.includes('Error');

                  if (isEndGroup) return null;

                  return (
                    <div 
                      key={idx} 
                      className={`leading-relaxed break-all flex items-start space-x-2 ${
                        isGroup
                          ? 'text-yellow-400 font-bold mt-2 pt-1 border-t border-neutral-900'
                          : isCommand
                          ? 'text-yellow-300 font-semibold'
                          : isSuccess
                          ? 'text-emerald-400 font-medium'
                          : isError
                          ? 'text-red-400 font-bold'
                          : 'text-neutral-300'
                      }`}
                    >
                      <span className="text-neutral-600 select-none text-[10px] w-8 shrink-0 text-right">
                        {idx + 1}
                      </span>
                      <span>
                        {isGroup ? item.line.replace('##[group]', '▼ ') : item.line}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
