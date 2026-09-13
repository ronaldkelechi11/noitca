import React from 'react';
import { HiXMark, HiCheckBadge, HiCpuChip, HiHeart } from 'react-icons/hi2';
import { FaGithub } from 'react-icons/fa6';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-black border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-900 bg-neutral-950">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="noitca" className="h-6 w-auto object-contain" />
            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 font-mono font-bold">
              v0.1.0-alpha
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-neutral-300">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">noitca</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              The high-performance, local-first visual workflow editor for DevOps engineers and developers. Design GitHub Actions pipelines visually on your machine without vendor lock-in.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-neutral-900 text-xs">
            <div className="flex items-center space-x-2 text-neutral-300">
              <HiCheckBadge className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>100% Free & Open Source Self-Hosted</span>
            </div>
            <div className="flex items-center space-x-2 text-neutral-300">
              <HiCheckBadge className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>Full Bi-directional YAML Compiler & Parser</span>
            </div>
            <div className="flex items-center space-x-2 text-neutral-300">
              <HiCheckBadge className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>Interactive Touchpad 2D Canvas & Flow Layouts</span>
            </div>
            <div className="flex items-center space-x-2 text-neutral-300">
              <HiCpuChip className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>One-line CLI start with local & network exposure</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-neutral-500 flex items-center justify-between">
            <span>Built with <HiHeart className="inline w-3 h-3 text-red-500" /> for modern DevOps</span>
            <span className="font-mono text-neutral-400">MIT License</span>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-900 bg-neutral-950 flex items-center justify-between">
          <a
            href="https://github.com/ronaldkelechi11/noitca"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold rounded-lg border border-neutral-800 transition-colors"
          >
            <FaGithub className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
