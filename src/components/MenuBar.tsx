import React, { useState, useRef, useEffect } from 'react';
import { 
  HiDocumentPlus, 
  HiArrowUpTray, 
  HiArrowDownTray, 
  HiCodeBracket, 
  HiTrash,
  HiArrowUturnLeft,
  HiArrowUturnRight,
  HiDocumentDuplicate,
  HiClipboardDocument,
  HiQuestionMarkCircle,
  HiInformationCircle,
  HiCommandLine,
  HiChartBar,
  HiCpuChip,
  HiSparkles
} from 'react-icons/hi2';
import { FaGithub } from 'react-icons/fa6';
import { FlowOrientation } from '../types/workflow';
import { WorkflowType } from '../types/loadTest';

interface MenuBarProps {
  workflowType: WorkflowType;
  onWorkflowTypeChange: (type: WorkflowType) => void;
  onNewTemplate: () => void;
  onClearCanvas: () => void;
  onImportYaml: () => void;
  onExportYaml: () => void;
  onExportScript?: () => void;
  onOpenAnalytics?: () => void;
  onOpenAiAssistant?: () => void;
  onSaveProject: () => void;
  onSaveNoitcaFile?: () => void;
  onOpenNoitcaFile?: () => void;
  onRunWorkflow?: () => void;
  onDirectDownloadYaml: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  canCopy: boolean;
  canPaste: boolean;
  onCopySelected: () => void;
  onPasteCopied: () => void;
  onDuplicateSelected?: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  orientation: FlowOrientation;
  onToggleOrientation: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onCenterCanvas: () => void;
  onToggleLandingPage: () => void;
  onOpenShortcutsModal: () => void;
  onOpenAboutModal: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  workflowType,
  onWorkflowTypeChange,
  onNewTemplate,
  onClearCanvas,
  onImportYaml,
  onExportYaml,
  onExportScript,
  onOpenAnalytics,
  onOpenAiAssistant,
  onSaveProject,
  onSaveNoitcaFile,
  onOpenNoitcaFile,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  canCopy,
  canPaste,
  onCopySelected,
  onPasteCopied,
  onToggleLandingPage,
  onOpenShortcutsModal,
  onOpenAboutModal,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleMenuClick = (menu: string) => {
    setActiveMenu(prev => (prev === menu ? null : menu));
  };

  const handleItemClick = (action: () => void) => {
    setActiveMenu(null);
    action();
  };

  return (
    <div 
      ref={menuBarRef} 
      className="h-8 bg-neutral-950 border-b border-neutral-900 px-3 flex items-center select-none text-[12px] font-medium text-neutral-300 relative z-40 shrink-0 font-sans"
    >
      {/* Brand icon mini */}
      <button 
        onClick={onToggleLandingPage}
        className="flex items-center space-x-1.5 mr-3 pr-2 border-r border-neutral-800 text-yellow-400 font-bold hover:opacity-80 transition-opacity cursor-pointer"
        title="Return to Landing Page"
      >
        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
        <span className="font-mono text-xs tracking-wider text-white">noitca<span className="text-yellow-400">.</span></span>
      </button>

      {/* Menu items */}
      <div className="flex items-center space-x-1">
        {/* FILE MENU */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('file')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeMenu === 'file' 
                ? 'bg-neutral-800 text-yellow-400 font-semibold' 
                : 'hover:bg-neutral-900 hover:text-white'
            }`}
          >
            File
          </button>

          {activeMenu === 'file' && (
            <div className="absolute left-0 top-full mt-1 w-64 bg-black border border-neutral-800 rounded-xl shadow-2xl p-1.5 z-50 animate-fade-in font-sans">
              <button
                onClick={() => handleItemClick(onNewTemplate)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-neutral-200 hover:text-yellow-400 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <HiDocumentPlus className="w-4 h-4 text-yellow-400" />
                  <span>New Workflow Preset...</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">⌘N</span>
              </button>

              {onOpenNoitcaFile && (
                <button
                  onClick={() => handleItemClick(onOpenNoitcaFile)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-neutral-200 hover:text-yellow-400 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <HiArrowUpTray className="w-4 h-4 text-yellow-400" />
                    <span>Open .noitca File...</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">⌘O</span>
                </button>
              )}

              <button
                onClick={() => handleItemClick(onImportYaml)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-neutral-200 hover:text-yellow-400 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <HiArrowUpTray className="w-4 h-4 text-amber-300" />
                  <span>Import GitHub Actions YAML...</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">⌘I</span>
              </button>

              <div className="my-1 border-t border-neutral-900" />

              <button
                onClick={() => handleItemClick(onSaveNoitcaFile || onSaveProject)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-neutral-200 hover:text-yellow-400 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <HiArrowDownTray className="w-4 h-4 text-yellow-400" />
                  <span>Save Project (.noitca)</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">⌘S</span>
              </button>

              {workflowType === 'load-test' && onExportScript && (
                <button
                  onClick={() => handleItemClick(onExportScript)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-yellow-400 font-bold hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <HiCommandLine className="w-4 h-4 text-yellow-400" />
                    <span>Export Bash Script (.sh)...</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">⌘E</span>
                </button>
              )}

              <button
                onClick={() => handleItemClick(onExportYaml)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-neutral-200 hover:text-yellow-400 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <HiCodeBracket className="w-4 h-4 text-yellow-400" />
                  <span>Export & Inspect YAML...</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">YAML</span>
              </button>

              <div className="my-1 border-t border-neutral-900" />

              <button
                onClick={() => handleItemClick(onClearCanvas)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-neutral-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <HiTrash className="w-4 h-4" />
                  <span>Clear Canvas</span>
                </div>
                <span className="text-[10px] text-neutral-600 font-mono">Del</span>
              </button>
            </div>
          )}
        </div>

        {/* TOOLS / LOAD TEST MENU */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('tools')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeMenu === 'tools'
                ? 'bg-neutral-800 text-yellow-400 font-semibold'
                : 'hover:bg-neutral-900 hover:text-white'
            }`}
          >
            Tools
          </button>

          {activeMenu === 'tools' && (
            <div className="absolute left-0 top-full mt-1 w-64 bg-black border border-neutral-800 rounded-xl shadow-2xl p-1.5 z-50 animate-fade-in font-sans">

              <button
                onClick={() => handleItemClick(() => onWorkflowTypeChange(workflowType === 'github-actions' ? 'load-test' : 'github-actions'))}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-neutral-200 hover:text-yellow-400 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <HiCpuChip className="w-4 h-4 text-emerald-400" />
                  <span>Switch to {workflowType === 'load-test' ? 'GitHub Actions Mode' : 'Load Testing Mode'}</span>
                </div>
              </button>

              {onOpenAiAssistant && (
                <button
                  onClick={() => handleItemClick(onOpenAiAssistant)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-rose-300 font-bold hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <HiSparkles className="w-4 h-4 text-rose-400" />
                    <span>AI Scenario Agent...</span>
                  </div>
                </button>
              )}

              {onOpenAnalytics && (
                <button
                  onClick={() => handleItemClick(onOpenAnalytics)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-emerald-300 font-bold hover:bg-emerald-950/20 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <HiChartBar className="w-4 h-4 text-emerald-400" />
                    <span>Analytics & Debug Preview...</span>
                  </div>
                </button>
              )}

            </div>
          )}
        </div>

        {/* EDIT MENU */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('edit')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeMenu === 'edit' 
                ? 'bg-neutral-800 text-yellow-400 font-semibold' 
                : 'hover:bg-neutral-900 hover:text-white'
            }`}
          >
            Edit
          </button>

          {activeMenu === 'edit' && (
            <div className="absolute left-0 top-full mt-1 w-56 bg-black border border-neutral-800 rounded-xl shadow-2xl p-1.5 z-50 animate-fade-in font-sans">
              <button
                disabled={!canUndo}
                onClick={() => handleItemClick(onUndo)}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  canUndo 
                    ? 'text-neutral-200 hover:text-yellow-400 hover:bg-neutral-900 cursor-pointer' 
                    : 'text-neutral-600 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <HiArrowUturnLeft className="w-4 h-4" />
                  <span>Undo</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">⌘Z</span>
              </button>

              <button
                disabled={!canRedo}
                onClick={() => handleItemClick(onRedo)}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  canRedo 
                    ? 'text-neutral-200 hover:text-yellow-400 hover:bg-neutral-900 cursor-pointer' 
                    : 'text-neutral-600 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <HiArrowUturnRight className="w-4 h-4" />
                  <span>Redo</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">⌘⇧Z</span>
              </button>

              <div className="my-1 border-t border-neutral-900" />

              <button
                disabled={!canCopy}
                onClick={() => handleItemClick(onCopySelected)}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  canCopy 
                    ? 'text-neutral-200 hover:text-yellow-400 hover:bg-neutral-900 cursor-pointer' 
                    : 'text-neutral-600 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <HiDocumentDuplicate className="w-4 h-4" />
                  <span>Copy Selected</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">⌘C</span>
              </button>

              <button
                disabled={!canPaste}
                onClick={() => handleItemClick(onPasteCopied)}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  canPaste 
                    ? 'text-neutral-200 hover:text-yellow-400 hover:bg-neutral-900 cursor-pointer' 
                    : 'text-neutral-600 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <HiClipboardDocument className="w-4 h-4" />
                  <span>Paste Node</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">⌘V</span>
              </button>
            </div>
          )}
        </div>

        {/* HELP MENU */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('help')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeMenu === 'help' 
                ? 'bg-neutral-800 text-yellow-400 font-semibold' 
                : 'hover:bg-neutral-900 hover:text-white'
            }`}
          >
            Help
          </button>

          {activeMenu === 'help' && (
            <div className="absolute left-0 top-full mt-1 w-56 bg-black border border-neutral-800 rounded-xl shadow-2xl p-1.5 z-50 animate-fade-in font-sans">
              <button
                onClick={() => handleItemClick(onOpenShortcutsModal)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-neutral-200 hover:text-yellow-400 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <HiQuestionMarkCircle className="w-4 h-4 text-yellow-400" />
                  <span>Keyboard Shortcuts</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">?</span>
              </button>

              <a
                href="https://github.com/ronaldkelechi11/noitca"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-neutral-200 hover:text-yellow-400 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <FaGithub className="w-4 h-4 text-neutral-300" />
                  <span>GitHub Repository</span>
                </div>
              </a>

              <div className="my-1 border-t border-neutral-900" />

              <button
                onClick={() => handleItemClick(onOpenAboutModal)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-neutral-200 hover:text-yellow-400 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <HiInformationCircle className="w-4 h-4 text-yellow-400" />
                  <span>About noitca</span>
                </div>
                <span className="text-[10px] text-yellow-400 font-mono">v0.1.0</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right status info */}
      <div className="ml-auto flex items-center space-x-3 text-[11px] text-neutral-500 font-mono">
        <span className="hidden sm:inline">Press <kbd className="px-1 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-300">C</kbd> to center</span>
        <button
          onClick={onToggleLandingPage}
          className="text-yellow-400 hover:underline flex items-center space-x-1 cursor-pointer"
        >
          <span>Landing Page & CLI</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
