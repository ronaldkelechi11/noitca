import React, { useState } from 'react';
import { HiXMark, HiClipboard, HiCheck, HiArrowDownTray, HiCodeBracket } from 'react-icons/hi2';

interface YamlPreviewModalProps {
  yaml: string;
  isOpen: boolean;
  onClose: () => void;
}

export const YamlPreviewModal: React.FC<YamlPreviewModalProps> = ({ yaml, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(yaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deploy.yml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-black border border-neutral-800 rounded-2xl w-full max-w-3xl flex flex-col max-h-[85vh] shadow-2xl overflow-hidden shadow-yellow-500/10">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800/80 flex items-center justify-between bg-black">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-400/10 text-yellow-400 border border-yellow-500/30 rounded-xl">
              <HiCodeBracket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Generated GitHub Actions Workflow</h3>
              <p className="text-xs text-neutral-400">Save to <code className="text-yellow-400 font-mono">.github/workflows/deploy.yml</code></p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <HiCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <HiClipboard className="w-4 h-4 text-yellow-400" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 bg-yellow-400 hover:bg-yellow-300 text-black px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <HiArrowDownTray className="w-4 h-4" />
              <span>Download .yml</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors ml-2"
            >
              <HiXMark className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Code Content View */}
        <div className="flex-1 bg-neutral-950 p-5 overflow-y-auto border-t border-neutral-900">
          <pre className="font-mono text-xs text-yellow-300 leading-relaxed overflow-x-auto whitespace-pre">
            {yaml}
          </pre>
        </div>
      </div>
    </div>
  );
};
