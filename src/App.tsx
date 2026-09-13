import { useState, useEffect, useCallback } from 'react';
import { WorkflowNode, NodeConnection, FlowOrientation, WorkflowState } from './types/workflow';
import { INITIAL_NODES, INITIAL_CONNECTIONS, NodeTemplate } from './utils/defaultWorkflow';
import { compileWorkflowToYaml } from './utils/yamlCompiler';
import { parseYamlToWorkflow } from './utils/yamlParser';
import { Header } from './components/Header';
import { ActionPalette } from './components/ActionPalette';
import { GridlinesCanvas } from './components/GridlinesCanvas';
import { NodeInspector } from './components/NodeInspector';
import { YamlPreviewModal } from './components/YamlPreviewModal';
import { YamlImportModal } from './components/YamlImportModal';
import { TemplateExplorerModal, WorkflowTemplatePreset } from './components/TemplateExplorerModal';

export default function App() {
  const [workflowName, setWorkflowName] = useState('Basic Deployment');
  const [orientation, setOrientation] = useState<FlowOrientation>('vertical');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Workflow state & History Undo/Redo stack
  const [history, setHistory] = useState<WorkflowState[]>([
    { nodes: INITIAL_NODES, connections: INITIAL_CONNECTIONS }
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentState = history[historyIndex] || { nodes: [], connections: [] };
  const nodes = currentState.nodes;
  const connections = currentState.connections;

  // Modals & Selection State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<NodeTemplate | null>(null);
  const [copiedNode, setCopiedNode] = useState<WorkflowNode | null>(null);
  const [isYamlOpen, setIsYamlOpen] = useState(false);
  const [isImportYamlOpen, setIsImportYamlOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(true); // Open Template Explorer on refresh/load
  const [isFullscreen, setIsFullscreen] = useState(false);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;
  const hasTrigger = nodes.some(n => n.category === 'Triggers');

  // Push new state to History Stack
  const pushState = useCallback((newNodes: WorkflowNode[], newConnections: NodeConnection[]) => {
    setHistory(prevHistory => {
      const sliced = prevHistory.slice(0, historyIndex + 1);
      return [...sliced, { nodes: newNodes, connections: newConnections }];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Undo / Redo handlers
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
    }
  }, [historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
    }
  }, [historyIndex]);

  // Copy & Paste handlers
  const handleCopyNode = useCallback((nodeId?: string) => {
    const idToCopy = nodeId || selectedNodeId;
    if (!idToCopy) return;
    const target = nodes.find(n => n.id === idToCopy);
    if (target) {
      setCopiedNode(target);
    }
  }, [selectedNodeId, nodes]);

  const handlePasteNode = useCallback(() => {
    if (!copiedNode) return;
    const newNodeId = `node-${Date.now()}`;
    const pastedNode: WorkflowNode = {
      ...copiedNode,
      id: newNodeId,
      title: `${copiedNode.title} (Copy)`,
      x: copiedNode.x + 50,
      y: copiedNode.y + 50,
      config: JSON.parse(JSON.stringify(copiedNode.config)),
    };

    pushState([...nodes, pastedNode], connections);
    setSelectedNodeId(newNodeId);
    setPreviewTemplate(null);
  }, [copiedNode, nodes, connections, pushState]);

  const handleDuplicateNode = useCallback((nodeId: string) => {
    const target = nodes.find(n => n.id === nodeId);
    if (!target) return;
    const newNodeId = `node-${Date.now()}`;
    const duplicatedNode: WorkflowNode = {
      ...target,
      id: newNodeId,
      title: `${target.title} (Copy)`,
      x: target.x + 40,
      y: target.y + 40,
      config: JSON.parse(JSON.stringify(target.config)),
    };
    pushState([...nodes, duplicatedNode], connections);
    setSelectedNodeId(newNodeId);
    setPreviewTemplate(null);
  }, [nodes, connections, pushState]);

  // Fullscreen & Sidebar Handlers
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  // Template Selection Handler (from Windows File Explorer Modal)
  const handleSelectTemplatePreset = (preset: WorkflowTemplatePreset) => {
    setWorkflowName(preset.name);
    pushState(preset.nodes, preset.connections);
    setSelectedNodeId(null);
    setPreviewTemplate(null);
  };

  // YAML Import Handler
  const handleImportYaml = (yamlText: string) => {
    const parsed = parseYamlToWorkflow(yamlText, orientation);
    if (parsed.workflowName) setWorkflowName(parsed.workflowName);
    pushState(parsed.nodes, parsed.connections);
    setSelectedNodeId(null);
    setPreviewTemplate(null);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || (e.target as HTMLElement)?.isContentEditable) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if (cmdOrCtrl && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        handleRedo();
      } else if (cmdOrCtrl && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        handleCopyNode();
      } else if (cmdOrCtrl && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        handlePasteNode();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handleToggleFullscreen();
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        handleToggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleUndo, handleRedo, handleCopyNode, handlePasteNode, handleToggleFullscreen, handleToggleSidebar]);

  // Node Mutations
  const handleUpdateNodePosition = (nodeId: string, x: number, y: number) => {
    const updated = nodes.map(n => n.id === nodeId ? { ...n, x, y } : n);
    setHistory(prev => {
      const copy = [...prev];
      copy[historyIndex] = { nodes: updated, connections };
      return copy;
    });
  };

  const handleAddNode = (template: NodeTemplate) => {
    const newNodeId = `node-${Date.now()}`;
    const lastNode = nodes.length > 0 ? nodes[nodes.length - 1] : null;

    let newX = 100;
    let newY = 100;

    if (lastNode) {
      if (orientation === 'vertical') {
        newX = lastNode.x;
        newY = lastNode.y + 140;
      } else {
        newX = lastNode.x + 300;
        newY = lastNode.y;
      }
    }

    const newNode: WorkflowNode = {
      id: newNodeId,
      type: template.type,
      title: template.title,
      subtitle: template.subtitle,
      category: template.category,
      x: newX,
      y: newY,
      iconType: template.iconType,
      badge: template.badge,
      badgeColor: template.badgeColor,
      config: { ...template.defaultConfig },
    };

    const newNodes = [...nodes, newNode];
    let newConnections = [...connections];

    if (lastNode && template.category !== 'Triggers' && lastNode.category !== 'Triggers') {
      newConnections.push({
        id: `conn-${Date.now()}`,
        fromNodeId: lastNode.id,
        toNodeId: newNodeId,
      });
    }

    pushState(newNodes, newConnections);
    setSelectedNodeId(newNodeId);
    setPreviewTemplate(null);
  };

  const handlePreviewTemplate = (template: NodeTemplate) => {
    setSelectedNodeId(null);
    setPreviewTemplate(template);
  };

  const handleConnectNodes = (fromId: string, toId: string) => {
    const exists = connections.some(c => c.fromNodeId === fromId && c.toNodeId === toId);
    if (!exists) {
      pushState(nodes, [...connections, { id: `conn-${Date.now()}`, fromNodeId: fromId, toNodeId: toId }]);
    }
  };

  const handleDeleteNode = (nodeId: string) => {
    const newNodes = nodes.filter(n => n.id !== nodeId);
    const newConns = connections.filter(c => c.fromNodeId !== nodeId && c.toNodeId !== nodeId);
    pushState(newNodes, newConns);
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  };

  const handleDeleteConnection = (connectionId: string) => {
    pushState(nodes, connections.filter(c => c.id !== connectionId));
  };

  const handleUpdateNode = (updatedNode: WorkflowNode) => {
    const newNodes = nodes.map(n => n.id === updatedNode.id ? updatedNode : n);
    pushState(newNodes, connections);
  };

  const handleClearCanvas = () => {
    pushState([], []);
    setSelectedNodeId(null);
    setPreviewTemplate(null);
  };

  const handleToggleOrientation = () => {
    const nextOrient = orientation === 'vertical' ? 'horizontal' : 'vertical';
    setOrientation(nextOrient);

    const realignedNodes = nodes.map((node, i) => ({
      ...node,
      x: nextOrient === 'horizontal' ? 80 + i * 300 : 100,
      y: nextOrient === 'horizontal' ? 150 : 80 + i * 140,
    }));
    pushState(realignedNodes, connections);
  };

  const compiledYaml = compileWorkflowToYaml(workflowName, nodes, connections);

  return (
    <div className="h-screen w-screen flex flex-col bg-black text-neutral-100 overflow-hidden font-sans">
      <Header
        workflowName={workflowName}
        onWorkflowNameChange={setWorkflowName}
        onImportYamlClick={() => setIsImportYamlOpen(true)}
        onExportYaml={() => setIsYamlOpen(true)}
        onResetTemplate={() => setIsTemplateModalOpen(true)}
        onClearCanvas={handleClearCanvas}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onCopySelected={() => handleCopyNode()}
        onPasteCopied={handlePasteNode}
        canCopy={Boolean(selectedNodeId)}
        canPaste={Boolean(copiedNode)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        orientation={orientation}
        onToggleOrientation={handleToggleOrientation}
        nodeCount={nodes.length}
        connectionCount={connections.length}
        hasTrigger={hasTrigger}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={handleToggleSidebar}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {isSidebarOpen && (
          <ActionPalette 
            onAddNode={handleAddNode}
            onPreviewTemplate={handlePreviewTemplate}
            onCloseSidebar={() => setIsSidebarOpen(false)}
          />
        )}

        <GridlinesCanvas
          nodes={nodes}
          connections={connections}
          selectedNodeId={selectedNodeId}
          orientation={orientation}
          onSelectNode={(id) => {
            setSelectedNodeId(id);
            if (id) setPreviewTemplate(null);
          }}
          onUpdateNodePosition={handleUpdateNodePosition}
          onConnectNodes={handleConnectNodes}
          onDeleteNode={handleDeleteNode}
          onDeleteConnection={handleDeleteConnection}
          onDuplicateNode={handleDuplicateNode}
          onCopyNode={(id) => handleCopyNode(id)}
          onPasteNode={handlePasteNode}
        />

        {(selectedNode || previewTemplate) && (
          <NodeInspector
            node={selectedNode}
            previewTemplate={previewTemplate}
            onClose={() => {
              setSelectedNodeId(null);
              setPreviewTemplate(null);
            }}
            onUpdateNode={handleUpdateNode}
            onDeleteNode={handleDeleteNode}
            onAddTemplateToGrid={handleAddNode}
          />
        )}
      </div>

      <YamlPreviewModal
        yaml={compiledYaml}
        isOpen={isYamlOpen}
        onClose={() => setIsYamlOpen(false)}
      />

      <YamlImportModal
        isOpen={isImportYamlOpen}
        onClose={() => setIsImportYamlOpen(false)}
        onImportYaml={handleImportYaml}
      />

      <TemplateExplorerModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplatePreset}
      />
    </div>
  );
}
