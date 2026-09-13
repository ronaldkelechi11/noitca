import React, { useState, useRef, useEffect, useCallback } from 'react';
import { WorkflowNode, NodeConnection, FlowOrientation } from '../types/workflow';
import { 
  HiMiniPlay, 
  HiCommandLine, 
  HiCog6Tooth, 
  HiCheckCircle, 
  HiTrash, 
  HiCube, 
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
  HiDocumentDuplicate
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
  FaLayerGroup
} from 'react-icons/fa6';

interface GridlinesCanvasProps {
  nodes: WorkflowNode[];
  connections: NodeConnection[];
  selectedNodeId: string | null;
  orientation: FlowOrientation;
  onSelectNode: (nodeId: string | null) => void;
  onUpdateNodePosition: (nodeId: string, x: number, y: number) => void;
  onConnectNodes: (fromId: string, toId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onDeleteConnection: (connectionId: string) => void;
  onDuplicateNode: (nodeId: string) => void;
  onCopyNode: (nodeId: string) => void;
  onPasteNode: () => void;
}

export const GridlinesCanvas: React.FC<GridlinesCanvasProps> = ({
  nodes,
  connections,
  selectedNodeId,
  orientation,
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
    const maxX = Math.max(...nodes.map(n => n.x + 260));
    const minY = Math.min(...nodes.map(n => n.y));
    const maxY = Math.max(...nodes.map(n => n.y + 90));

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
      case 'upload_artifact':
        return <HiCloudArrowUp className="w-5 h-5 text-amber-400" />;
      case 'download_artifact':
        return <HiCloudArrowDown className="w-5 h-5 text-yellow-300" />;
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

  const NODE_WIDTH = 260;
  const NODE_HEIGHT = 90;

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

          return (
            <div
              key={node.id}
              onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                width: `${NODE_WIDTH}px`,
              }}
              className={`absolute pointer-events-auto rounded-2xl bg-neutral-950/95 border backdrop-blur-md shadow-2xl transition-shadow duration-150 p-4 ${
                isSelected
                  ? 'border-yellow-400 ring-2 ring-yellow-400/40 shadow-yellow-500/20'
                  : 'border-neutral-800 hover:border-yellow-500/40'
              }`}
            >
              {/* Input Port (Only render if NOT a Trigger node) */}
              {!isTriggerNode && (
                <div 
                  className={`absolute w-6 h-6 rounded-full bg-black border border-neutral-700 flex items-center justify-center cursor-pointer hover:border-yellow-400 hover:scale-110 transition-transform ${
                    orientation === 'vertical'
                      ? '-top-3 left-1/2 -translate-x-1/2'
                      : '-left-3 top-1/2 -translate-y-1/2'
                  }`}
                  onMouseUp={(e) => endConnection(e, node.id)}
                  title="Connect input port"
                >
                  <div className="w-2 h-2 rounded-full bg-neutral-400" />
                </div>
              )}

              {/* Node Card Content */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="p-2.5 bg-neutral-900 rounded-xl border border-neutral-800 shrink-0">
                    {getNodeIcon(node.iconType)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-semibold text-white truncate">{node.title}</h4>
                      {node.badge && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-medium ${node.badgeColor || 'bg-neutral-800 text-neutral-400'}`}>
                          {node.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">{node.subtitle}</p>
                  </div>
                </div>

                {/* Node Quick Action Toolbar (Duplicate & Delete) */}
                <div className="flex items-center space-x-1 pl-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateNode(node.id);
                    }}
                    className="p-1 text-neutral-500 hover:text-yellow-400 rounded transition-colors"
                    title="Duplicate step (⌘C / ⌘V)"
                  >
                    <HiDocumentDuplicate className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNode(node.id);
                    }}
                    className="p-1 text-neutral-500 hover:text-rose-400 rounded transition-colors"
                    title="Delete step"
                  >
                    <HiTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Output Exit Port (Single Exit Point) */}
              <div 
                className={`absolute w-6 h-6 rounded-full bg-black border border-yellow-500/60 flex items-center justify-center cursor-pointer hover:border-yellow-400 hover:scale-125 transition-transform ${
                  orientation === 'vertical'
                    ? '-bottom-3 left-1/2 -translate-x-1/2'
                    : '-right-3 top-1/2 -translate-y-1/2'
                }`}
                onMouseDown={(e) => startConnection(e, node.id)}
                title="Drag output exit port to connect next step"
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
