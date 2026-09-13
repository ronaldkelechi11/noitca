import React from 'react';
import { 
  HiCodeBracket, 
  HiTrash, 
  HiArrowPath, 
  HiArrowUturnLeft, 
  HiArrowUturnRight, 
  HiDocumentDuplicate, 
  HiClipboardDocument, 
  HiArrowsPointingOut, 
  HiArrowsPointingIn,
  HiCheckCircle,
  HiExclamationTriangle,
  HiCpuChip,
  HiArrowDown,
  HiArrowRight,
  HiBars3,
  HiArrowUpTray
} from 'react-icons/hi2';
import { FlowOrientation } from '../types/workflow';

interface HeaderProps {
  workflowName: string;
  onWorkflowNameChange: (name: string) => void;
  onImportYamlClick: () => void;
  onExportYaml: () => void;
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
}

export const Header: React.FC<HeaderProps> = ({
  workflowName,
  onWorkflowNameChange,
  onImportYamlClick,
  onExportYaml,
  onResetTemplate,
  onClearCanvas,
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
  onToggleOrientation,
  nodeCount,
  connectionCount,
  hasTrigger,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  return (
    <div className="flex flex-col bg-black border-b border-neutral-800/80 z-30 shrink-0">
      {/* Top Status Bar */}
      <div className="h-7 bg-neutral-950 border-b border-neutral-900 px-4 sm:px-6 flex items-center justify-between text-[11px] font-mono text-neutral-400">
        <div className="flex items-center space-x-4">
          {/* Pipeline Validation Status */}
          {hasTrigger ? (
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <HiCheckCircle className="w-3.5 h-3.5" />
              <span className="font-semibold">Pipeline Valid</span>
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

          <div className="w-[1px] h-3 bg-neutral-800" />

          {/* Runner */}
          <div className="flex items-center space-x-1 text-neutral-400">
            <HiCpuChip className="w-3.5 h-3.5 text-yellow-400" />
            <span>Runner: ubuntu-latest</span>
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

          <img
            src="/logo.png"
            alt="noitca"
            className="h-8 w-auto object-contain"
          />
          <input
            type="text"
            value={workflowName}
            onChange={(e) => onWorkflowNameChange(e.target.value)}
            className="bg-transparent text-lg font-bold text-white focus:outline-none focus:ring-1 focus:ring-yellow-400 rounded px-1.5 py-0.5 hover:bg-neutral-900 transition-colors"
          />
        </div>

        {/* Control Toolbar */}
        <div className="flex items-center space-x-2">
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

          {/* Flow Orientation Toggle */}
          <button
            onClick={onToggleOrientation}
            className="flex items-center space-x-1.5 text-xs text-neutral-300 hover:text-yellow-400 bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-800 transition-colors cursor-pointer"
            title="Toggle Flow Direction (Vertical / Horizontal)"
          >
            {orientation === 'vertical' ? (
              <>
                <HiArrowDown className="w-4 h-4 text-yellow-400" />
                <span>Vertical ↓</span>
              </>
            ) : (
              <>
                <HiArrowRight className="w-4 h-4 text-yellow-400" />
                <span>Horizontal →</span>
              </>
            )}
          </button>

          {/* Reset & Clear */}
          <button
            onClick={onResetTemplate}
            className="flex items-center space-x-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-yellow-500/30 transition-colors cursor-pointer"
            title="Reset to default pipeline"
          >
            <HiArrowPath className="w-4 h-4 text-yellow-400" />
            <span>Reset</span>
          </button>

          <button
            onClick={onClearCanvas}
            className="flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-rose-400 bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-rose-500/30 transition-colors cursor-pointer"
            title="Clear canvas"
          >
            <HiTrash className="w-4 h-4" />
            <span>Clear</span>
          </button>

          {/* Import & Export YAML Buttons */}
          <button
            onClick={onImportYamlClick}
            className="flex items-center space-x-1.5 text-xs font-semibold text-neutral-200 hover:text-white bg-neutral-900 hover:bg-neutral-800 px-3.5 py-2 rounded-lg border border-neutral-800 hover:border-yellow-500/40 transition-all cursor-pointer ml-2"
          >
            <HiArrowUpTray className="w-4 h-4 text-yellow-400" />
            <span>Import YAML</span>
          </button>

          <button
            onClick={onExportYaml}
            className="flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold px-4 py-2 rounded-lg shadow-lg shadow-yellow-500/20 transition-all transform active:scale-95 cursor-pointer"
          >
            <HiCodeBracket className="w-4 h-4" />
            <span>Export YAML</span>
          </button>
        </div>
      </header>
    </div>
  );
};
