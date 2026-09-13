import React, { useState, useRef, useEffect, useCallback } from 'react';
import { WorkflowNode, NodeConnection, FlowOrientation } from '../types/workflow';
import { 
  HiMiniPlay, 
  HiCog6Tooth, 
  HiTrash, 
  HiCloudArrowUp,
  HiCloudArrowDown,
  HiHeart,
  HiPlus,
  HiClock,
  HiSparkles,
  HiViewfinderCircle,
  HiDocumentText,
  HiArrowUpTray,
  HiLockClosed,
  HiDocumentDuplicate,
  HiTag,
  HiArrowPath,
  HiChartBar
} from 'react-icons/hi2';
import { 
  FaDocker, 
  FaNodeJs, 
  FaPython, 
  FaGolang, 
  FaGitAlt, 
  FaSlack, 
  FaCodePullRequest, 
  FaServer, 
  FaNetworkWired, 
  FaCodeBranch, 
  FaBox, 
  FaVial, 
  FaTerminal, 
  FaFolderOpen,
  FaLayerGroup,
  FaCodeCommit,
  FaCodeMerge
} from 'react-icons/fa6';

interface GridlinesCanvasProps {
  nodes: WorkflowNode[];
  connections: NodeConnection[];
  selectedNodeId: string | null;
  orientation: FlowOrientation;
  centerSignal?: number;
  onSelectNode: (nodeId: string | null) => void;
  onUpdateNodePosition: (nodeId: string, x: number, y: number) => void;
  onConnectNodes: (fromId: string, toId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onDeleteConnection: (connectionId: string) => void;
  onDuplicateNode: (nodeId: string) => void;
  onCopyNode: (nodeId: string) => void;
  onPasteNode: () => void;
}

const NODE_WIDTH = 300;
const NODE_HEIGHT = 110;

const getNodeDetailSnippet = (node: WorkflowNode): string | null => {
  const c = node.config || {};
  if (c.command) return `$ ${c.command}`;
  if (c.artifactName) return `artifact: ${c.artifactName}`;
  if (c.tagName) return `tag: ${c.tagName}`;
  if (c.releaseName) return `release: ${c.releaseName}`;
  if (c.message) return `commit: "${c.message.slice(0, 24)}${c.message.length > 24 ? '...' : ''}"`;
  if (c.branchName) return `branch: ${c.branchName}`;
  if (c.branch) return `branch: ${c.branch}`;
  if (c.repositoryUrl) return `repo: ${c.repositoryUrl.split('/').pop() || c.repositoryUrl}`;
  if (c.runtimeVersion) return `runtime: v${c.runtimeVersion}`;
  if (c.imageName) return `image: ${c.imageName}:${c.imageTag || 'latest'}`;
  if (c.channel) return `channel: ${c.channel}`;
  if (c.cronExpression) return `cron: ${c.cronExpression}`;
  if (c.testRunner) return `test: ${c.testRunner}`;
  if (c.path) return `path: ${c.path}`;
  if (c.repository && c.repository !== 'self') return `repo: ${c.repository}`;
  return null;
};

export const GridlinesCanvas: React.FC<GridlinesCanvasProps> = ({
  nodes,
  connections,
  selectedNodeId,
  orientation,
  centerSignal,
  onSelectNode,
  onUpdateNodePosition,
  onConnectNodes,
  onDeleteNode,
  onDeleteConnection,
  onDuplicateNode,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const [connectingMousePos, setConnectingMousePos] = useState<{ x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Automatic Grid Centering Function
  const centerGrid = useCallback(() => {
    if (!containerRef.current || nodes.length === 0) {
      setPan({ x: 0, y: 0 });
      setZoom(1);
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const minX = Math.min(...nodes.map(n => n.x));
    const maxX = Math.max(...nodes.map(n => n.x + NODE_WIDTH));
    const minY = Math.min(...nodes.map(n => n.y));
    const maxY = Math.max(...nodes.map(n => n.y + NODE_HEIGHT));

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    const centerX = minX + contentWidth / 2;
    const centerY = minY + contentHeight / 2;

    const targetZoom = Math.min(
      1.2,
      Math.max(0.6, Math.min((rect.width - 120) / contentWidth, (rect.height - 120) / contentHeight))
    );

    setZoom(targetZoom);
    setPan({
      x: rect.width / 2 - centerX * targetZoom,
      y: rect.height / 2 - centerY * targetZoom,
    });
  }, [nodes]);

  // Global Keyboard listener for 'c' key to trigger automatic grid centering
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || (e.target as HTMLElement)?.isContentEditable) {
        return;
      }

      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        centerGrid();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [centerGrid]);

  useEffect(() => {
    if (centerSignal) {
      centerGrid();
    }
  }, [centerSignal, centerGrid]);

  // Non-passive wheel listener for smooth Touchpad Pinch Zoom & 2D Touchpad Panning
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (e.ctrlKey || e.metaKey) {
        const zoomFactor = Math.pow(0.995, e.deltaY);
        setZoom((prevZoom) => Math.min(Math.max(0.2, prevZoom * zoomFactor), 3.0));
      } else {
        setPan((prevPan) => ({
          x: prevPan.x - e.deltaX,
          y: prevPan.y - e.deltaY,
        }));
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Distinct Icon Mapping for Every Action Type
  const getNodeIcon = (iconType: string) => {
    switch (iconType) {
      case 'commit':
        return <FaCodeCommit className="w-5 h-5 text-yellow-400" />;
      case 'push':
        return <FaGitAlt className="w-5 h-5 text-yellow-400" />;
      case 'pr':
        return <FaCodePullRequest className="w-5 h-5 text-amber-400" />;
      case 'manual':
        return <HiMiniPlay className="w-5 h-5 text-yellow-300" />;
      case 'cron':
        return <HiClock className="w-5 h-5 text-amber-300" />;
      case 'checkout':
        return <FaFolderOpen className="w-5 h-5 text-yellow-400" />;
      case 'clone':
        return <FaFolderOpen className="w-5 h-5 text-amber-300" />;
      case 'fetch':
        return <HiArrowPath className="w-5 h-5 text-yellow-400" />;
      case 'checkout_branch':
        return <FaCodeBranch className="w-5 h-5 text-amber-300" />;
      case 'git_commit':
        return <FaCodeCommit className="w-5 h-5 text-amber-300" />;
      case 'git_push':
        return <HiArrowUpTray className="w-5 h-5 text-yellow-400" />;
      case 'git_tag':
        return <HiTag className="w-5 h-5 text-yellow-400" />;
      case 'git_merge':
        return <FaCodeMerge className="w-5 h-5 text-amber-300" />;
      case 'git_release':
        return <HiSparkles className="w-5 h-5 text-yellow-400" />;
      case 'upload_artifact':
      case 'artifact_upload':
        return <HiCloudArrowUp className="w-5 h-5 text-yellow-400" />;
      case 'download_artifact':
      case 'artifact_download':
        return <HiCloudArrowDown className="w-5 h-5 text-amber-300" />;
      case 'artifact_build':
        return <FaBox className="w-5 h-5 text-yellow-400" />;
      case 'artifact_test':
        return <FaVial className="w-5 h-5 text-amber-400" />;
      case 'artifact_coverage':
        return <HiChartBar className="w-5 h-5 text-yellow-300" />;
      case 'artifact_logs':
        return <HiDocumentText className="w-5 h-5 text-neutral-300" />;
      case 'artifact_previous':
        return <HiClock className="w-5 h-5 text-amber-300" />;
      case 'node':
        return <FaNodeJs className="w-5 h-5 text-amber-400" />;
      case 'python':
        return <FaPython className="w-5 h-5 text-yellow-400" />;
      case 'go':
        return <FaGolang className="w-5 h-5 text-amber-300" />;
      case 'setup_docker':
        return <FaDocker className="w-5 h-5 text-yellow-400" />;
      case 'terminal':
        return <FaTerminal className="w-5 h-5 text-amber-400" />;
      case 'script':
        return <HiDocumentText className="w-5 h-5 text-yellow-300" />;
      case 'test':
        return <FaVial className="w-5 h-5 text-amber-400" />;
      case 'lint':
        return <HiSparkles className="w-5 h-5 text-yellow-300" />;
      case 'build':
        return <FaBox className="w-5 h-5 text-yellow-400" />;
      case 'docker_login':
        return <HiLockClosed className="w-5 h-5 text-amber-300" />;
      case 'docker_build':
        return <FaLayerGroup className="w-5 h-5 text-yellow-400" />;
      case 'docker_push':
        return <HiArrowUpTray className="w-5 h-5 text-amber-400" />;
      case 'deploy_ssh':
        return <FaServer className="w-5 h-5 text-yellow-400" />;
      case 'deploy_rsync':
        return <FaNetworkWired className="w-5 h-5 text-amber-300" />;
      case 'logic_if':
        return <FaCodeBranch className="w-5 h-5 text-yellow-400" />;
      case 'health':
        return <HiHeart className="w-5 h-5 text-amber-400" />;
      case 'slack':
        return <FaSlack className="w-5 h-5 text-yellow-300" />;
      default:
        return <HiCog6Tooth className="w-5 h-5 text-neutral-400" />;
    }
  };

  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'svg') {
      onSelectNode(null);
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    } else if (draggingNodeId) {
      const newX = (e.clientX - pan.x - dragOffset.x) / zoom;
      const newY = (e.clientY - pan.y - dragOffset.y) / zoom;
      onUpdateNodePosition(draggingNodeId, newX, newY);
    } else if (connectingFromId && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setConnectingMousePos({
        x: (e.clientX - rect.left - pan.x) / zoom,
        y: (e.clientY - rect.top - pan.y) / zoom,
      });
    }
  };

  const handleMouseUpCanvas = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
    setConnectingFromId(null);
    setConnectingMousePos(null);
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    onSelectNode(nodeId);
    setDraggingNodeId(nodeId);
    
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setDragOffset({
        x: e.clientX - (node.x * zoom + pan.x),
        y: e.clientY - (node.y * zoom + pan.y),
      });
    }
  };

  const startConnection = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setConnectingFromId(nodeId);
  };

  const endConnection = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const targetNode = nodes.find(n => n.id === nodeId);
    // Triggers are starting blocks and cannot accept incoming connections!
    if (targetNode?.category === 'Triggers') {
      setConnectingFromId(null);
      setConnectingMousePos(null);
      return;
    }

    if (connectingFromId && connectingFromId !== nodeId) {
      onConnectNodes(connectingFromId, nodeId);
    }
    setConnectingFromId(null);
    setConnectingMousePos(null);
  };

  const getPortCoords = (node: WorkflowNode, isOutput: boolean) => {
    if (orientation === 'vertical') {
      return {
        x: node.x + NODE_WIDTH / 2,
        y: isOutput ? node.y + NODE_HEIGHT : node.y,
      };
    } else {
      return {
        x: isOutput ? node.x + NODE_WIDTH : node.x,
        y: node.y + NODE_HEIGHT / 2,
      };
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative flex-1 bg-black overflow-hidden select-none cursor-grab active:cursor-grabbing touch-none"
      onMouseDown={handleMouseDownCanvas}
      onMouseMove={handleMouseMoveCanvas}
      onMouseUp={handleMouseUpCanvas}
    >
      {/* Gridlines Background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(234, 179, 8, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(234, 179, 8, 0.15) 1px, transparent 1px),
            linear-gradient(to right, rgba(39, 39, 42, 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(39, 39, 42, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: `
            ${60 * zoom}px ${60 * zoom}px,
            ${60 * zoom}px ${60 * zoom}px,
            ${12 * zoom}px ${12 * zoom}px,
            ${12 * zoom}px ${12 * zoom}px
          `,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      />

      {/* Transform Container */}
      <div 
        className="absolute inset-0 origin-top-left pointer-events-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        {/* SVG Connections Layer */}
        <svg className="w-full h-full absolute inset-0 overflow-visible pointer-events-none">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#facc15" />
            </marker>
          </defs>

          {/* Render Connections */}
          {connections.map((conn) => {
            const fromNode = nodes.find(n => n.id === conn.fromNodeId);
            const toNode = nodes.find(n => n.id === conn.toNodeId);

            if (!fromNode || !toNode) return null;

            const start = getPortCoords(fromNode, true);
            const end = getPortCoords(toNode, false);

            let pathD = '';
            if (orientation === 'vertical') {
              const controlOffset = Math.max(40, Math.abs(end.y - start.y) / 2);
              pathD = `M ${start.x} ${start.y} C ${start.x} ${start.y + controlOffset}, ${end.x} ${end.y - controlOffset}, ${end.x} ${end.y}`;
            } else {
              const controlOffset = Math.max(40, Math.abs(end.x - start.x) / 2);
              pathD = `M ${start.x} ${start.y} C ${start.x + controlOffset} ${start.y}, ${end.x - controlOffset} ${end.y}, ${end.x} ${end.y}`;
            }

            return (
              <g key={conn.id} className="group pointer-events-auto cursor-pointer" onClick={() => onDeleteConnection(conn.id)}>
                <path
                  d={pathD}
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="3"
                  markerEnd="url(#arrowhead)"
                  className="transition-colors group-hover:stroke-rose-500"
                />
                <path
                  d={pathD}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="14"
                />
              </g>
            );
          })}

          {/* Connection Dragging Preview */}
          {connectingFromId && connectingMousePos && (() => {
            const fromNode = nodes.find(n => n.id === connectingFromId);
            if (!fromNode) return null;
            const start = getPortCoords(fromNode, true);
            const endX = connectingMousePos.x;
            const endY = connectingMousePos.y;

            let pathD = '';
            if (orientation === 'vertical') {
              pathD = `M ${start.x} ${start.y} C ${start.x} ${start.y + 50}, ${endX} ${endY - 50}, ${endX} ${endY}`;
            } else {
              pathD = `M ${start.x} ${start.y} C ${start.x + 50} ${start.y}, ${endX - 50} ${endY}, ${endX} ${endY}`;
            }

            return (
              <path
                d={pathD}
                fill="none"
                stroke="#facc15"
                strokeWidth="3"
                strokeDasharray="5,5"
                markerEnd="url(#arrowhead)"
              />
            );
          })()}
        </svg>

        {/* Nodes Layer */}
        {nodes.map((node) => {
          const isSelected = node.id === selectedNodeId;
          const isTriggerNode = node.category === 'Triggers';
          const detailSnippet = getNodeDetailSnippet(node);

          return (
            <div
              key={node.id}
              onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                width: `${NODE_WIDTH}px`,
                minHeight: `${NODE_HEIGHT}px`,
              }}
              className={`absolute pointer-events-auto rounded-2xl bg-[#0a0a0a]/95 border backdrop-blur-md shadow-2xl transition-all duration-150 p-3 select-none flex flex-col justify-between ${
                isSelected
                  ? 'border-yellow-400 ring-2 ring-yellow-400/30 shadow-[0_0_25px_rgba(250,204,21,0.2)]'
                  : 'border-neutral-800/90 hover:border-yellow-500/50 hover:shadow-[0_4px_24px_rgba(234,179,8,0.12)]'
              }`}
            >
              {/* Input Port (Only render if NOT a Trigger node) */}
              {!isTriggerNode && (
                <div 
                  className={`absolute w-6 h-6 rounded-full bg-black border border-neutral-700 flex items-center justify-center cursor-pointer hover:border-yellow-400 hover:scale-125 transition-all shadow-md z-10 ${
                    orientation === 'vertical'
                      ? '-top-3 left-1/2 -translate-x-1/2'
                      : '-left-3 top-1/2 -translate-y-1/2'
                  }`}
                  onMouseUp={(e) => endConnection(e, node.id)}
                  title="Input port (connect from previous step)"
                >
                  <div className="w-2 h-2 rounded-full bg-neutral-400 hover:bg-yellow-400 transition-colors" />
                </div>
              )}

              <div>
                {/* Node Top Header: Category + Badge + Quick Actions */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-900/90">
                  <div className="flex items-center space-x-1.5 min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isTriggerNode ? 'bg-yellow-400 animate-pulse' : 'bg-neutral-500'}`} />
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400 truncate">
                      {node.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                    {node.badge && (
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-medium ${node.badgeColor || 'bg-neutral-900 text-neutral-400 border-neutral-800'}`}>
                        {node.badge}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateNode(node.id);
                      }}
                      className="p-1 text-neutral-500 hover:text-yellow-400 hover:bg-neutral-900 rounded transition-colors cursor-pointer"
                      title="Duplicate step (⌘C / ⌘V)"
                    >
                      <HiDocumentDuplicate className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNode(node.id);
                      }}
                      className="p-1 text-neutral-500 hover:text-rose-400 hover:bg-neutral-900 rounded transition-colors cursor-pointer"
                      title="Delete step"
                    >
                      <HiTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Node Middle Content: Icon + Title + Subtitle */}
                <div className="flex items-start space-x-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-black border border-neutral-800/90 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    {getNodeIcon(node.iconType)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 
                      className="text-[13px] font-bold text-white tracking-tight leading-snug break-words line-clamp-2"
                      title={node.title}
                    >
                      {node.title}
                    </h4>
                    <p 
                      className="text-[11px] text-neutral-400 leading-snug truncate mt-0.5 font-sans"
                      title={node.subtitle}
                    >
                      {node.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Node Bottom Parameter Pill (if applicable) */}
              {detailSnippet && (
                <div className="mt-2.5 pt-1.5 border-t border-neutral-900/90 flex items-center justify-between text-[10px] font-mono">
                  <div className="flex items-center space-x-1.5 bg-black/80 border border-neutral-800/80 px-2 py-0.5 rounded text-neutral-300 truncate max-w-full">
                    <span className="text-yellow-400 font-bold shrink-0">▸</span>
                    <span className="truncate text-yellow-300/90">{detailSnippet}</span>
                  </div>
                </div>
              )}

              {/* Output Exit Port (Single Exit Point) */}
              <div 
                className={`absolute w-6 h-6 rounded-full bg-black border border-yellow-400/80 flex items-center justify-center cursor-pointer hover:border-yellow-300 hover:scale-125 transition-all shadow-md shadow-yellow-500/10 z-10 ${
                  orientation === 'vertical'
                    ? '-bottom-3 left-1/2 -translate-x-1/2'
                    : '-right-3 top-1/2 -translate-y-1/2'
                }`}
                onMouseDown={(e) => startConnection(e, node.id)}
                title="Drag output port to connect next step"
              >
                <HiPlus className="w-3.5 h-3.5 text-yellow-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Controls Bar */}
      <div className="absolute bottom-6 right-6 bg-neutral-950/90 border border-neutral-800 backdrop-blur-md rounded-xl p-1.5 flex items-center space-x-1 shadow-2xl z-10 text-xs">
        <button
          onClick={centerGrid}
          className="flex items-center space-x-1 px-2.5 py-1 text-yellow-400 hover:bg-neutral-900 rounded font-medium cursor-pointer border border-yellow-500/20"
          title="Center Grid (Press 'C' on keyboard)"
        >
          <HiViewfinderCircle className="w-4 h-4" />
          <span>Center [C]</span>
        </button>
        <div className="w-[1px] h-4 bg-neutral-800 my-auto" />
        <button
          onClick={() => setZoom(z => Math.max(0.2, z - 0.1))}
          className="px-2.5 py-1 text-neutral-300 hover:bg-neutral-900 rounded font-medium cursor-pointer"
        >
          -
        </button>
        <span className="px-2 font-mono text-yellow-400 font-bold">{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => setZoom(z => Math.min(3.0, z + 0.1))}
          className="px-2.5 py-1 text-neutral-300 hover:bg-neutral-900 rounded font-medium cursor-pointer"
        >
          +
        </button>
        <button
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
          className="px-2.5 py-1 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded cursor-pointer"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
