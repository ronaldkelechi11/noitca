import React, { useState } from 'react';
import { NodeCategory } from '../types/workflow';
import { NODE_CATALOG, NodeTemplate } from '../utils/defaultWorkflow';
import { 
  HiChevronDown, 
  HiChevronRight, 
  HiChevronLeft,
  HiMagnifyingGlass, 
  HiBolt, 
  HiFolderOpen, 
  HiCpuChip, 
  HiCommandLine, 
  HiSparkles, 
  HiGlobeAlt, 
  HiHeart, 
  HiBell, 
  HiPlus 
} from 'react-icons/hi2';
import { FaDocker, FaCodeBranch } from 'react-icons/fa6';

interface ActionPaletteProps {
  onAddNode: (template: NodeTemplate) => void;
  onPreviewTemplate: (template: NodeTemplate) => void;
  onCloseSidebar: () => void;
}

export const ActionPalette: React.FC<ActionPaletteProps> = ({ onAddNode, onPreviewTemplate, onCloseSidebar }) => {
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const categories = Object.keys(NODE_CATALOG) as NodeCategory[];

  const toggleCategory = (cat: string) => {
    setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const getCategoryIcon = (cat: NodeCategory) => {
    switch (cat) {
      case 'Triggers':
        return <HiBolt className="w-4 h-4 text-yellow-400" />;
      case 'Repository':
        return <HiFolderOpen className="w-4 h-4 text-amber-300" />;
      case 'Environment':
        return <HiCpuChip className="w-4 h-4 text-yellow-300" />;
      case 'Commands':
        return <HiCommandLine className="w-4 h-4 text-amber-400" />;
      case 'Quality':
        return <HiSparkles className="w-4 h-4 text-yellow-400" />;
      case 'Docker':
        return <FaDocker className="w-4 h-4 text-amber-300" />;
      case 'Deployment':
        return <HiGlobeAlt className="w-4 h-4 text-yellow-300" />;
      case 'Logic':
        return <FaCodeBranch className="w-4 h-4 text-amber-400" />;
      case 'Verification':
        return <HiHeart className="w-4 h-4 text-yellow-400" />;
      case 'Notifications':
        return <HiBell className="w-4 h-4 text-amber-300" />;
      default:
        return <HiBolt className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <aside className="w-80 bg-black border-r border-neutral-800/80 flex flex-col h-full z-10 shrink-0 animate-slide-in">
      {/* Header with Close Sidebar Button */}
      <div className="p-4 border-b border-neutral-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-widest">Action Library</h3>
            <span className="text-[10px] text-yellow-400 font-mono">10 Categories</span>
          </div>

          <button
            onClick={onCloseSidebar}
            className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
            title="Close sidebar (Press B)"
          >
            <HiChevronLeft className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative">
          <HiMagnifyingGlass className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40"
          />
        </div>
        <p className="text-[10px] text-neutral-400 italic">Single-click to inspect • Double-click to add to grid</p>
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {categories.map((cat) => {
          const templates = NODE_CATALOG[cat].filter(t => 
            t.title.toLowerCase().includes(search.toLowerCase()) || 
            t.subtitle.toLowerCase().includes(search.toLowerCase())
          );

          if (templates.length === 0) return null;

          const isCollapsed = collapsed[cat];

          return (
            <div key={cat} className="space-y-1.5">
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center justify-between py-1.5 px-2 text-xs font-semibold text-neutral-300 hover:text-white rounded hover:bg-neutral-900 transition-colors"
              >
                <span className="flex items-center space-x-2">
                  {getCategoryIcon(cat)}
                  <span>{cat}</span>
                </span>
                {isCollapsed ? (
                  <HiChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                ) : (
                  <HiChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                )}
              </button>

              {!isCollapsed && (
                <div className="space-y-1.5 pl-2">
                  {templates.map((tmpl) => (
                    <div
                      key={tmpl.type}
                      onClick={() => onPreviewTemplate(tmpl)}
                      onDoubleClick={() => onAddNode(tmpl)}
                      className="group flex items-center justify-between p-2.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800/80 hover:border-yellow-500/50 rounded-xl cursor-pointer transition-all shadow-sm select-none"
                      title="Single-click to inspect parameters, Double-click to add to grid"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="flex items-center space-x-2">
                          <h5 className="text-xs font-medium text-neutral-200 group-hover:text-yellow-400 truncate">{tmpl.title}</h5>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${tmpl.badgeColor}`}>
                            {tmpl.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 truncate mt-0.5">{tmpl.subtitle}</p>
                      </div>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddNode(tmpl);
                        }}
                        className="p-1 rounded bg-neutral-900 group-hover:bg-yellow-400 text-neutral-400 group-hover:text-black transition-colors shrink-0"
                        title="Add to grid"
                      >
                        <HiPlus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
