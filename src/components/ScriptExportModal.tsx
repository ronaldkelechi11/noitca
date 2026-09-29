import React, { useState } from 'react';
import {
  HiXMark,
  HiClipboard,
  HiCheck,
  HiArrowDownTray,
  HiCommandLine
} from 'react-icons/hi2';

interface ScriptExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflowName: string;
  scriptContent: string;
}

export const ScriptExportModal: React.FC<ScriptExportModalProps> = ({
  isOpen,
  onClose,
  workflowName,
  scriptContent,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `${workflowName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_loadtest.sh`;
    const blob = new Blob([scriptContent], { type: 'text/x-sh' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in font-sans">
      <div className="bg-black border border-neutral-800 rounded-2xl w-full max-w-4xl flex flex-col h-[650px] shadow-2xl overflow-hidden shadow-yellow-500/10">

        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-yellow-400">
              <HiCommandLine className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">{workflowName}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 font-mono">
                  STANDALONE BASH SCRIPT (.sh)
                </span>
              </div>
              <p className="text-xs text-neutral-400">Zero-dependency executable script with built-in real-time ANSI analytics</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions Banner */}
        <div className="px-5 py-2.5 bg-neutral-900/80 border-b border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-300">
          <div className="flex items-center space-x-2">
            <HiCommandLine className="w-4 h-4 text-emerald-400" />
            <span>Execution: <code className="text-yellow-400">chmod +x loadtest.sh && ./loadtest.sh</code></span>
          </div>
          <span className="text-neutral-500 text-[11px]">Requires curl & awk (Standard on Linux / macOS / WSL)</span>
        </div>

        {/* Script Code Viewer */}
        <div className="flex-1 bg-neutral-950 p-4 overflow-y-auto font-mono text-xs text-emerald-400/90 leading-relaxed selection:bg-yellow-400 selection:text-black">
          <pre className="whitespace-pre-wrap break-all">{scriptContent}</pre>
        </div>

        {/* Footer Bar */}
        <div className="px-5 py-3 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between">
          <span className="text-xs text-neutral-400 font-mono">Lines: {scriptContent.split('\n').length}</span>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg border border-neutral-700 transition-colors flex items-center space-x-2 cursor-pointer"
            >
              {copied ? <HiCheck className="w-4 h-4 text-emerald-400" /> : <HiClipboard className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Script'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs rounded-lg shadow-lg shadow-yellow-500/20 transition-all cursor-pointer flex items-center space-x-2"
            >
              <HiArrowDownTray className="w-4 h-4" />
              <span>Download .sh Script</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
