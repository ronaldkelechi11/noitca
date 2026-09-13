import React from 'react';
import { HiXMark, HiCommandLine } from 'react-icons/hi2';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '⌘ / Ctrl + R', desc: 'Run workflow simulation & view live logs' },
    { key: '⌘ / Ctrl + S', desc: 'Save workflow to local disk as .noitca file' },
    { key: '⌘ / Ctrl + O', desc: 'Open .noitca workflow file from disk' },
    { key: '⌘ / Ctrl + E', desc: 'Export & inspect compiled GitHub YAML' },
    { key: '⌘ / Ctrl + Z', desc: 'Undo last canvas action' },
    { key: '⌘ / Ctrl + ⇧ + Z (or Ctrl+Y)', desc: 'Redo last undone action' },
    { key: '⌘ / Ctrl + C', desc: 'Copy selected node' },
    { key: '⌘ / Ctrl + V', desc: 'Paste copied node to canvas' },
    { key: '⌘ / Ctrl + D', desc: 'Duplicate selected node' },
    { key: 'Delete / Backspace', desc: 'Delete currently selected node' },
    { key: 'C', desc: 'Auto-center canvas grid view' },
    { key: 'B', desc: 'Toggle / Collapse left action rail' },
    { key: 'F', desc: 'Toggle full-screen workflow editor' },
    { key: 'Touchpad Pinch / Mouse Wheel', desc: 'Zoom in and out smoothly (20% – 250%)' },
    { key: 'Touchpad 2-finger / Drag', desc: 'Pan canvas freely in 2D space' },
    { key: 'Double Click', desc: 'Add action directly to canvas from palette' },
    { key: 'Single Click', desc: 'Inspect configuration parameters & outputs' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-black border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-900 bg-neutral-950">
          <div className="flex items-center space-x-2">
            <HiCommandLine className="w-5 h-5 text-yellow-400" />
            <h3 className="text-base font-bold text-white">Keyboard Shortcuts & Gestures</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-3">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-900 hover:border-yellow-500/30 transition-colors"
            >
              <span className="text-xs text-neutral-300">{s.desc}</span>
              <kbd className="px-2.5 py-1 bg-neutral-900 border border-neutral-700/60 rounded-md font-mono text-[11px] text-yellow-400 font-semibold shadow-inner shrink-0 ml-4">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-neutral-900 bg-neutral-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
