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
  HiSquares2X2,
  HiArrowsPointingOut,
  HiArrowsPointingIn,
  HiQuestionMarkCircle,
  HiInformationCircle,
  HiSparkles,
  HiViewColumns,
  HiGlobeAlt,
  HiPlay,
  HiCommandLine
} from 'react-icons/hi2';
import { FaGithub } from 'react-icons/fa6';
import { FlowOrientation } from '../types/workflow';

interface MenuBarProps {
  onNewTemplate: () => void;
  onClearCanvas: () => void;
  onImportYaml: () => void;
  onExportYaml: () => void;
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
  onNewTemplate,
  onClearCanvas,
  onImportYaml,
  onExportYaml,
  onSaveProject,
  onSaveNoitcaFile,
  onOpenNoitcaFile,
  onRunWorkflow,
  onDirectDownloadYaml,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  canCopy,
  canPaste,
  onCopySelected,
  onPasteCopied,
  onDuplicateSelected,
  isSidebarOpen,
  onToggleSidebar,
  orientation,
  onToggleOrientation,
  isFullscreen,
  onToggleFullscreen,
  onCenterCanvas,
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
      className="h-8 bg-neutral-950 border-b border-neutral-900 px-3 flex items-center select-none text-[12px] font-medium text-neutral-300 relative z-40 shrink-0"
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
                  <span>New from Template...</span>
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
                  <span>Import GitHub YAML...</span>
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
                  <span>Save as .noitca File</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">⌘S</span>
              </button>

              <button
                onClick={() => handleItemClick(onExportYaml)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-neutral-200 hover:text-yellow-400 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <HiCodeBracket className="w-4 h-4 text-yellow-400" />
                  <span>Export & Inspect YAML...</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">⌘E</span>
              </button>

              <button
                onClick={() => handleItemClick(onDirectDownloadYaml)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-neutral-200 hover:text-yellow-400 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <HiSparkles className="w-4 h-4 text-amber-400" />
                  <span>Download deploy.yml</span>
                </div>
                <span className="text-yellow-400/80 font-mono text-[9px] bg-yellow-400/10 px-1 py-0.5 rounded">
                  .github/workflows
                </span>
              </button>

              {onRunWorkflow && (
                <>
                  <div className="my-1 border-t border-neutral-900" />
                  <button
                    onClick={() => handleItemClick(onRunWorkflow)}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 rounded-lg transition-colors cursor-pointer font-semibold"
                  >
                    <div className="flex items-center space-x-2">
                      <HiPlay className="w-4 h-4 text-yellow-400" />
                      <span>Run Workflow (Live Logs)...</span>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono">⌘R</span>
                  </button>
                </>
              )}

              <div className="my-1 border-t border-neutral-900" />

              <button
                onClick={() => handleItemClick(onClearCanvas)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-neutral-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <HiTrash className="w-4 h-4" />
                  <span>Clear Canvas</span>
                </div>
                <span className="text-[10px] text-neutral-600 font-mono">Del All</span>
              </button>
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

              {onDuplicateSelected && (
                <button
                  disabled={!canCopy}
                  onClick={() => handleItemClick(onDuplicateSelected)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-lg transition-colors ${
                    canCopy 
                      ? 'text-neutral-200 hover:text-yellow-400 hover:bg-neutral-900 cursor-pointer' 
                      : 'text-neutral-600 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <HiSquares2X2 className="w-4 h-4" />
                    <span>Duplicate</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">⌘D</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* VIEW MENU */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('view')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeMenu === 'view' 
                ? 'bg-neutral-800 text-yellow-400 font-semibold' 
                : 'hover:bg-neutral-900 hover:text-white'
            }`}
          >
            View
          </button>

          {activeMenu === 'view' && (
            <div className="absolute left-0 top-full mt-1 w-60 bg-black border border-neutral-800 rounded-xl shadow-2xl p-1.5 z-50 animate-fade-in font-sans">
              <button
                onClick={() => handleItemClick(onToggleSidebar)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-neutral-200 hover:text-yellow-400 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <HiViewColumns className="w-4 h-4 text-yellow-400" />
                  <span>{isSidebarOpen ? 'Collapse Sidebar Rail' : 'Expand Sidebar'}</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">B</span>
              </button>

              <button
                onClick={() => handleItemClick(onToggleOrientation)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-neutral-200 hover:text-yellow-400 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <HiSquares2X2 className="w-4 h-4 text-amber-300" />
                  <span>Flow: {orientation === 'vertical' ? 'Switch to Horizontal' : 'Switch to Vertical'}</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">Tab</span>
              </button>

              <button
                onClick={() => handleItemClick(onCenterCanvas)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-neutral-200 hover:text-yellow-400 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <HiSquares2X2 className="w-4 h-4 text-neutral-400" />
                  <span>Center Grid View</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">C</span>
              </button>

              <button
                onClick={() => handleItemClick(onToggleFullscreen)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-neutral-200 hover:text-yellow-400 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  {isFullscreen ? (
                    <HiArrowsPointingIn className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <HiArrowsPointingOut className="w-4 h-4 text-yellow-400" />
                  )}
                  <span>{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">F</span>
              </button>

              {onRunWorkflow && (
                <button
                  onClick={() => handleItemClick(onRunWorkflow)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-neutral-200 hover:text-yellow-400 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <HiCommandLine className="w-4 h-4 text-yellow-400" />
                    <span>Execution Logs Console</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">⌘R</span>
                </button>
              )}

              <div className="my-1 border-t border-neutral-900" />

              <button
                onClick={() => handleItemClick(onToggleLandingPage)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-neutral-200 hover:text-yellow-400 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <HiGlobeAlt className="w-4 h-4 text-amber-400" />
                  <span>Product Landing Page</span>
                </div>
                <span className="text-[9px] bg-yellow-400/20 text-yellow-400 px-1 py-0.5 rounded font-mono">
                  CLI & Docs
                </span>
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
        <span className="hidden md:inline">Press <kbd className="px-1 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-300">B</kbd> for sidebar</span>
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
