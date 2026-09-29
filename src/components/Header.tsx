import React from 'react';
import { 
  HiCodeBracket, 
  HiArrowUturnLeft, 
  HiArrowUturnRight, 
  HiDocumentDuplicate, 
  HiClipboardDocument, 
  HiArrowsPointingOut, 
  HiArrowsPointingIn,
  HiCheckCircle,
  HiExclamationTriangle,
  HiBars3,
  HiCommandLine,
  HiSparkles,
  HiChartBar
} from 'react-icons/hi2';
import { FlowOrientation } from '../types/workflow';
import { WorkflowType } from '../types/loadTest';

interface HeaderProps {
  workflowName: string;
  onWorkflowNameChange: (name: string) => void;
  workflowType: WorkflowType;
  onWorkflowTypeChange: (type: WorkflowType) => void;
  onExportYaml: () => void;
  onExportScript?: () => void;
  onOpenAnalytics?: () => void;
  onOpenAiAssistant?: () => void;
  onResetTemplate: () => void;
  onClearCanvas: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onCopySelected: () => void;
  onPasteCopied: () => void;
  canCopy: boolean;
  canPaste: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  orientation: FlowOrientation;
  onToggleOrientation: () => void;
  nodeCount: number;
  connectionCount: number;
  hasTrigger: boolean;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onToggleLandingPage?: () => void;
  onRunWorkflow?: () => void;
  onSaveNoitca?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  workflowName,
  onWorkflowNameChange,
  workflowType,
  onWorkflowTypeChange,
  onExportYaml,
  onExportScript,
  onOpenAnalytics,
  onOpenAiAssistant,
  onResetTemplate,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onCopySelected,
  onPasteCopied,
  canCopy,
  canPaste,
  isFullscreen,
  onToggleFullscreen,
  orientation,
  nodeCount,
  connectionCount,
  hasTrigger,
  isSidebarOpen,
  onToggleSidebar,
  onToggleLandingPage,
}) => {
  return (
    <div className="flex flex-col bg-black border-b border-neutral-800/80 z-30 shrink-0 font-sans">
      {/* Top Status Bar */}
      <div className="h-7 bg-neutral-950 border-b border-neutral-900 px-4 sm:px-6 flex items-center justify-between text-[11px] font-mono text-neutral-400">
        <div className="flex items-center space-x-4">
          {/* Workflow Mode Indicator */}
          <div className="flex items-center space-x-1">
            <span className="text-neutral-500 font-bold">MODE:</span>
            <button
              onClick={() => onWorkflowTypeChange(workflowType === 'github-actions' ? 'load-test' : 'github-actions')}
              className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase font-mono border transition-all cursor-pointer ${
                workflowType === 'load-test'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20'
              }`}
              title="Click to switch between GitHub Actions CI/CD and Load Testing Studio"
            >
              {workflowType === 'load-test' ? '🚀 LOAD TEST STUDIO' : '⚙️ GITHUB ACTIONS CI/CD'}
            </button>
          </div>

          <div className="w-[1px] h-3 bg-neutral-800" />

          {/* Pipeline Validation Status */}
          {hasTrigger || workflowType === 'load-test' ? (
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <HiCheckCircle className="w-3.5 h-3.5" />
              <span className="font-semibold">{workflowType === 'load-test' ? 'Load Test Ready' : 'Pipeline Valid'}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-amber-400">
              <HiExclamationTriangle className="w-3.5 h-3.5" />
              <span>Missing Trigger Node</span>
            </div>
          )}

          <div className="w-[1px] h-3 bg-neutral-800" />

          {/* Graph Stats */}
          <div className="flex items-center space-x-3 text-neutral-300">
            <span><strong className="text-yellow-400">{nodeCount}</strong> Nodes</span>
            <span><strong className="text-yellow-400">{connectionCount}</strong> Edges</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Orientation Mode Status */}
          <span className="text-neutral-400">
            Flow: <strong className="text-yellow-400 capitalize">{orientation}</strong>
          </span>

          <div className="w-[1px] h-3 bg-neutral-800" />

          {/* Fullscreen Toggle */}
          <button
            onClick={onToggleFullscreen}
            className="flex items-center space-x-1 text-neutral-300 hover:text-yellow-400 transition-colors cursor-pointer"
            title="Toggle Fullscreen (Press F)"
          >
            {isFullscreen ? (
              <>
                <HiArrowsPointingIn className="w-3.5 h-3.5" />
                <span>Exit Fullscreen [F]</span>
              </>
            ) : (
              <>
                <HiArrowsPointingOut className="w-3.5 h-3.5" />
                <span>Fullscreen [F]</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <header className="h-14 px-4 sm:px-6 flex items-center justify-between">
        {/* Brand, Logo & Sidebar Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isSidebarOpen
                ? 'bg-neutral-900 border-neutral-800 text-yellow-400 hover:bg-neutral-800'
                : 'bg-yellow-400 border-yellow-400 text-black font-bold hover:bg-yellow-300'
            }`}
            title={isSidebarOpen ? 'Close Sidebar (Press B)' : 'Open Sidebar (Press B)'}
          >
            <HiBars3 className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleLandingPage}
            className="flex items-center space-x-1.5 hover:opacity-85 transition-opacity cursor-pointer"
            title="Return to Landing Page"
          >
            <img
              src="/logo.png"
              alt="noitca"
              className="h-8 w-auto object-contain"
            />
          </button>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => onWorkflowNameChange(e.target.value)}
            className="bg-transparent text-lg font-bold text-white focus:outline-none focus:ring-1 focus:ring-yellow-400 rounded px-1.5 py-0.5 hover:bg-neutral-900 transition-colors"
          />
        </div>

        {/* Control Toolbar */}
        <div className="flex items-center space-x-2">

          {/* AI Scenario Agent Button */}
          {onOpenAiAssistant && (
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center space-x-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Generate Load Test Scenario with AI Agent"
            >
              <HiSparkles className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>AI Scenario Agent</span>
            </button>
          )}

          {/* Load Test Analytics Debug Button */}
          {workflowType === 'load-test' && onOpenAnalytics && (
            <button
              onClick={onOpenAnalytics}
              className="flex items-center space-x-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Open Analytics & Debug Preview Panel"
            >
              <HiChartBar className="w-4 h-4 text-emerald-400" />
              <span>Analytics Preview</span>
            </button>
          )}

          {/* Undo / Redo Group */}
          <div className="flex items-center space-x-1 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-1.5 rounded transition-colors ${
                canUndo 
                  ? 'text-neutral-200 hover:text-yellow-400 hover:bg-neutral-800 cursor-pointer' 
                  : 'text-neutral-600 cursor-not-allowed'
              }`}
              title="Undo (⌘Z / Ctrl+Z)"
            >
              <HiArrowUturnLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={`p-1.5 rounded transition-colors ${
                canRedo 
                  ? 'text-neutral-200 hover:text-yellow-400 hover:bg-neutral-800 cursor-pointer' 
                  : 'text-neutral-600 cursor-not-allowed'
              }`}
              title="Redo (⌘⇧Z / Ctrl+Y)"
            >
              <HiArrowUturnRight className="w-4 h-4" />
            </button>
          </div>

          {/* Copy / Paste Group */}
          <div className="flex items-center space-x-1 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
            <button
              onClick={onCopySelected}
              disabled={!canCopy}
              className={`p-1.5 rounded transition-colors ${
                canCopy 
                  ? 'text-neutral-200 hover:text-yellow-400 hover:bg-neutral-800 cursor-pointer' 
                  : 'text-neutral-600 cursor-not-allowed'
              }`}
              title="Copy Selected Node (⌘C / Ctrl+C)"
            >
              <HiDocumentDuplicate className="w-4 h-4" />
            </button>
            <button
              onClick={onPasteCopied}
              disabled={!canPaste}
              className={`p-1.5 rounded transition-colors ${
                canPaste 
                  ? 'text-neutral-200 hover:text-yellow-400 hover:bg-neutral-800 cursor-pointer' 
                  : 'text-neutral-600 cursor-not-allowed'
              }`}
              title="Paste Node (⌘V / Ctrl+V)"
            >
              <HiClipboardDocument className="w-4 h-4" />
            </button>
          </div>

          {/* Reset */}
          <button
            onClick={onResetTemplate}
            className="flex items-center space-x-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-yellow-500/30 transition-colors cursor-pointer"
            title="Reset to default pipeline"
          >
            <span>Reset</span>
          </button>

          {/* Export Script / YAML Button */}
          {workflowType === 'load-test' && onExportScript ? (
            <button
              onClick={onExportScript}
              className="flex items-center space-x-1.5 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-lg shadow-yellow-500/20"
              title="Export Standalone Bash Load Test Script (.sh)"
            >
              <HiCommandLine className="w-4 h-4" />
              <span>Export Bash Script (.sh)</span>
            </button>
          ) : (
            <button
              onClick={onExportYaml}
              className="flex items-center space-x-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-800 hover:border-yellow-500/40 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Export compiled GitHub Actions YAML"
            >
              <HiCodeBracket className="w-3.5 h-3.5 text-yellow-400" />
              <span>Export YAML</span>
            </button>
          )}

        </div>
      </header>
    </div>
  );
};
