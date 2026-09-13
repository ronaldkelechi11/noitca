import React, { useState, useRef, useEffect } from 'react';
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
  HiPlus,
  HiArchiveBox
} from 'react-icons/hi2';
import { FaDocker, FaCodeBranch, FaGitAlt } from 'react-icons/fa6';

interface ActionPaletteProps {
  isOpen: boolean;
  onToggleOpen: () => void;
  onAddNode: (template: NodeTemplate) => void;
  onPreviewTemplate: (template: NodeTemplate) => void;
}

export const ActionPalette: React.FC<ActionPaletteProps> = ({ 
  isOpen, 
  onToggleOpen, 
  onAddNode, 
  onPreviewTemplate 
}) => {
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [hoveredCategory, setHoveredCategory] = useState<NodeCategory | null>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categories = Object.keys(NODE_CATALOG) as NodeCategory[];

  const handleMouseEnterCategory = (cat: NodeCategory) => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setHoveredCategory(cat);
  };

  const handleMouseLeaveCategory = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
    leaveTimerRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 250);
  };

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  const toggleCategory = (cat: string) => {
    setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const getCategoryIcon = (cat: NodeCategory) => {
    switch (cat) {
      case 'Triggers':
        return <HiBolt className="w-4 h-4 text-yellow-400" />;
      case 'Repository':
        return <HiFolderOpen className="w-4 h-4 text-amber-300" />;
      case 'Git':
        return <FaGitAlt className="w-4 h-4 text-yellow-400" />;
      case 'Artifacts':
        return <HiArchiveBox className="w-4 h-4 text-amber-300" />;
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

  // If collapsed: Show compact icon rail with hover flyouts
  if (!isOpen) {
    return (
      <aside className="w-14 bg-black border-r border-neutral-800/80 flex flex-col items-center py-3 z-30 shrink-0 select-none">
        {/* Expand Toggle Button */}
        <button
          onClick={onToggleOpen}
          className="p-2 text-neutral-400 hover:text-yellow-400 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer mb-4"
          title="Expand Action Library (Press B)"
        >
          <HiChevronRight className="w-5 h-5" />
        </button>

        <div className="w-8 h-[1px] bg-neutral-800 mb-3" />

        {/* Category Icons Rail with Hover Flyouts */}
        <div className="flex-1 flex flex-col items-center space-y-2 w-full px-1.5">
          {categories.map((cat) => {
            const templates = NODE_CATALOG[cat];
            const isHovered = hoveredCategory === cat;

            return (
              <div
                key={cat}
                className="relative group w-full flex justify-center"
                onMouseEnter={() => handleMouseEnterCategory(cat)}
                onMouseLeave={handleMouseLeaveCategory}
              >
                {/* Category Rail Icon Button */}
                <button
                  onClick={() => {
                    if (hoveredCategory === cat) {
                      onToggleOpen();
                    } else {
                      handleMouseEnterCategory(cat);
                    }
                  }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    isHovered
                      ? 'bg-neutral-900 border border-yellow-400/50 shadow-md shadow-yellow-500/10'
                      : 'hover:bg-neutral-900/80 text-neutral-400 hover:text-white border border-transparent'
                  }`}
                  title={`${cat} (Hover to view actions)`}
                >
                  {getCategoryIcon(cat)}
                </button>

                {/* Hover Flyout Popup with continuous hit area bridge */}
                {isHovered && (
                  <div 
                    className="absolute left-full top-0 pl-2.5 w-80 z-50 pointer-events-auto"
                    onMouseEnter={() => handleMouseEnterCategory(cat)}
                    onMouseLeave={handleMouseLeaveCategory}
                  >
                    <div className="w-full bg-black border border-neutral-800 rounded-2xl p-3.5 shadow-2xl animate-fade-in ring-1 ring-white/5">
                      <div className="flex items-center space-x-2 pb-2 mb-2.5 border-b border-neutral-800">
                        {getCategoryIcon(cat)}
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">{cat}</h4>
                        <span className="text-[10px] text-yellow-400 font-mono ml-auto">
                          {templates.length} actions
                        </span>
                      </div>

                      <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                        {templates.map((tmpl) => (
                          <div
                            key={tmpl.type}
                            onClick={() => onPreviewTemplate(tmpl)}
                            onDoubleClick={() => onAddNode(tmpl)}
                            className="group/item flex items-center justify-between p-2.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800/90 hover:border-yellow-500/50 rounded-xl cursor-pointer transition-all shadow-sm"
                            title="Click to inspect • Double-click to add to grid"
                          >
                            <div className="min-w-0 flex-1 pr-2">
                              <div className="flex items-center space-x-1.5">
                                <h5 className="text-xs font-medium text-neutral-200 group-hover/item:text-yellow-400 truncate">
                                  {tmpl.title}
                                </h5>
                                <span className={`text-[8px] px-1 py-0.2 rounded border font-mono ${tmpl.badgeColor}`}>
                                  {tmpl.badge}
                                </span>
                              </div>
                              <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                                {tmpl.subtitle}
                              </p>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddNode(tmpl);
                              }}
                              className="p-1.5 rounded-lg bg-neutral-900 group-hover/item:bg-yellow-400 text-neutral-400 group-hover/item:text-black transition-colors shrink-0 cursor-pointer"
                              title="Add to canvas"
                            >
                              <HiPlus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    );
  }

  // Expanded Mode: Full 80 width sidebar
  return (
    <aside className="w-80 bg-black border-r border-neutral-800/80 flex flex-col h-full z-10 shrink-0 select-none">
      {/* Header with Collapse Button */}
      <div className="p-4 border-b border-neutral-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-widest">Action Library</h3>
            <span className="text-[10px] text-yellow-400 font-mono">10 Categories</span>
          </div>

          <button
            onClick={onToggleOpen}
            className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
            title="Collapse to icons (Press B)"
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
