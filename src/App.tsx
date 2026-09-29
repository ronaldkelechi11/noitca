import { useState, useEffect, useCallback, useRef } from 'react';
import { WorkflowNode, NodeConnection, FlowOrientation, WorkflowState } from './types/workflow';
import { WorkflowType } from './types/loadTest';
import {
  INITIAL_NODES,
  INITIAL_CONNECTIONS,
  DEFAULT_LOAD_TEST_NODES,
  DEFAULT_LOAD_TEST_CONNECTIONS,
  NodeTemplate
} from './utils/defaultWorkflow';
import { compileWorkflowToYaml } from './utils/yamlCompiler';
import { compileWorkflowToLoadTestScript } from './utils/loadTestScriptCompiler';
import { parseYamlToWorkflow } from './utils/yamlParser';
import { saveAsNoitcaFile, loadFromNoitcaFile } from './utils/noitcaFileIO';

import { MenuBar } from './components/MenuBar';
import { Header } from './components/Header';
import { ActionPalette } from './components/ActionPalette';
import { GridlinesCanvas } from './components/GridlinesCanvas';
import { NodeInspector } from './components/NodeInspector';
import { YamlPreviewModal } from './components/YamlPreviewModal';
import { YamlImportModal } from './components/YamlImportModal';
import { WorkflowRunModal } from './components/WorkflowRunModal';
import { TemplateExplorerModal, WorkflowTemplatePreset } from './components/TemplateExplorerModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { AboutModal } from './components/AboutModal';
import { LandingPage } from './components/LandingPage';

import { LoadTestAnalyticsPanel } from './components/LoadTestAnalyticsPanel';
import { ScriptExportModal } from './components/ScriptExportModal';
import { AiAssistantModal } from './components/AiAssistantModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'editor' | 'landing'>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#editor') {
      return 'editor';
    }
    return 'landing';
  });

  const [workflowType, setWorkflowType] = useState<WorkflowType>('load-test');
  const [workflowName, setWorkflowName] = useState('Web Service Load Test Scenario');
  const [orientation, setOrientation] = useState<FlowOrientation>('vertical');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Listen to hash changes for smooth browser navigation (back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#editor') {
        setCurrentView('editor');
      } else {
        setCurrentView('landing');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToEditor = useCallback(() => {
    window.location.hash = '#editor';
    setCurrentView('editor');
  }, []);

  const navigateToLanding = useCallback(() => {
    window.location.hash = '';
    setCurrentView('landing');
  }, []);

  // Workflow state & History Undo/Redo stack
  const [history, setHistory] = useState<WorkflowState[]>([
    { nodes: DEFAULT_LOAD_TEST_NODES, connections: DEFAULT_LOAD_TEST_CONNECTIONS }
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
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Load Test Modals
  const [isScriptExportOpen, setIsScriptExportOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [centerSignal, setCenterSignal] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
  }, [historyIndex, history.length]);

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

  const handleCenterCanvas = useCallback(() => {
    setCenterSignal(prev => prev + 1);
  }, []);

  // Template Selection Handler (from File Explorer Modal)
  const handleSelectTemplatePreset = (preset: WorkflowTemplatePreset) => {
    setWorkflowName(preset.name);
    setWorkflowType(preset.workflowType || 'load-test');
    pushState(preset.nodes, preset.connections);
    setSelectedNodeId(null);
    setPreviewTemplate(null);
  };

  // AI Generated Workflow Handler
  const handleApplyAiWorkflow = (result: {
    workflowName: string;
    nodes: WorkflowNode[];
    connections: NodeConnection[];
  }) => {
    setWorkflowName(result.workflowName);
    setWorkflowType('load-test');
    pushState(result.nodes, result.connections);
    setSelectedNodeId(null);
    setPreviewTemplate(null);
  };

  // YAML Import Handler
  const handleImportYaml = (yamlText: string) => {
    const parsed = parseYamlToWorkflow(yamlText, orientation);
    if (parsed.workflowName) setWorkflowName(parsed.workflowName);
    setWorkflowType('github-actions');
    pushState(parsed.nodes, parsed.connections);
    setSelectedNodeId(null);
    setPreviewTemplate(null);
  };

  // Save Project as native .noitca file
  const handleSaveNoitcaFile = () => {
    saveAsNoitcaFile(workflowName, nodes, connections, orientation);
  };

  // Open native .noitca file dialog
  const handleOpenNoitcaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Handle native .noitca file loaded from local machine
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const loaded = await loadFromNoitcaFile(file);
      setWorkflowName(loaded.name);
      setOrientation(loaded.orientation);
      pushState(loaded.nodes, loaded.connections);
      setSelectedNodeId(null);
      setPreviewTemplate(null);
    } catch (err: any) {
      alert(`Could not open file: ${err?.message || 'Invalid format'}`);
    }
  };

  // Compiled Artifacts
  const compiledYaml = compileWorkflowToYaml(workflowName, nodes, connections);
  const compiledLoadTestScript = compileWorkflowToLoadTestScript(workflowName, nodes);

  // Direct Download deploy.yml
  const handleDirectDownloadYaml = () => {
    const blob = new Blob([compiledYaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deploy.yml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      } else if (cmdOrCtrl && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        handleSaveNoitcaFile();
      } else if (cmdOrCtrl && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        if (workflowType === 'load-test') {
          setIsAnalyticsOpen(true);
        } else {
          setIsRunModalOpen(true);
        }
      } else if (cmdOrCtrl && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        if (workflowType === 'load-test') {
          setIsScriptExportOpen(true);
        } else {
          setIsYamlOpen(true);
        }
      } else if (cmdOrCtrl && (e.key === 'o' || e.key === 'O')) {
        e.preventDefault();
        handleOpenNoitcaClick();
      } else if (cmdOrCtrl && (e.key === 'i' || e.key === 'I')) {
        e.preventDefault();
        setIsImportYamlOpen(true);
      } else if (cmdOrCtrl && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        setIsTemplateModalOpen(true);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handleToggleFullscreen();
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        handleToggleSidebar();
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleUndo, handleRedo, handleCopyNode, handlePasteNode, handleToggleFullscreen, handleToggleSidebar, workflowType]);

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
        newY = lastNode.y + 160;
      } else {
        newX = lastNode.x + 360;
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
      x: nextOrient === 'horizontal' ? 80 + i * 360 : 100,
      y: nextOrient === 'horizontal' ? 150 : 80 + i * 160,
    }));
    pushState(realignedNodes, connections);
  };

  // Render Landing Page View
  if (currentView === 'landing') {
    return <LandingPage onLaunchEditor={navigateToEditor} />;
  }

  // Render Visual Workflow Editor View
  return (
    <div className="h-screen w-screen flex flex-col bg-black text-neutral-100 overflow-hidden font-sans">
      {/* Top Menu Bar */}
      <MenuBar
        workflowType={workflowType}
        onWorkflowTypeChange={setWorkflowType}
        onNewTemplate={() => setIsTemplateModalOpen(true)}
        onClearCanvas={handleClearCanvas}
        onImportYaml={() => setIsImportYamlOpen(true)}
        onExportYaml={() => setIsYamlOpen(true)}
        onExportScript={() => setIsScriptExportOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onSaveProject={handleSaveNoitcaFile}
        onSaveNoitcaFile={handleSaveNoitcaFile}
        onOpenNoitcaFile={handleOpenNoitcaClick}
        onRunWorkflow={() => setIsRunModalOpen(true)}
        onDirectDownloadYaml={handleDirectDownloadYaml}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canCopy={Boolean(selectedNodeId)}
        canPaste={Boolean(copiedNode)}
        onCopySelected={() => handleCopyNode()}
        onPasteCopied={handlePasteNode}
        onDuplicateSelected={selectedNodeId ? () => handleDuplicateNode(selectedNodeId) : undefined}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={handleToggleSidebar}
        orientation={orientation}
        onToggleOrientation={handleToggleOrientation}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onCenterCanvas={handleCenterCanvas}
        onToggleLandingPage={navigateToLanding}
        onOpenShortcutsModal={() => setIsShortcutsOpen(true)}
        onOpenAboutModal={() => setIsAboutOpen(true)}
      />

      {/* Header Bar */}
      <Header
        workflowName={workflowName}
        onWorkflowNameChange={setWorkflowName}
        workflowType={workflowType}
        onWorkflowTypeChange={setWorkflowType}
        onExportYaml={() => setIsYamlOpen(true)}
        onExportScript={() => setIsScriptExportOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onSaveNoitca={handleSaveNoitcaFile}
        onRunWorkflow={() => setIsRunModalOpen(true)}
        onResetTemplate={() => {
          if (workflowType === 'load-test') {
            pushState(DEFAULT_LOAD_TEST_NODES, DEFAULT_LOAD_TEST_CONNECTIONS);
          } else {
            pushState(INITIAL_NODES, INITIAL_CONNECTIONS);
          }
        }}
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
        onToggleLandingPage={navigateToLanding}
      />

      {/* Main Canvas Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ActionPalette always rendered so collapsed icon rail & flyouts remain accessible */}
        <ActionPalette 
          isOpen={isSidebarOpen}
          onToggleOpen={handleToggleSidebar}
          onAddNode={handleAddNode}
          onPreviewTemplate={handlePreviewTemplate}
        />

        <GridlinesCanvas
          nodes={nodes}
          connections={connections}
          selectedNodeId={selectedNodeId}
          orientation={orientation}
          centerSignal={centerSignal}
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

      {/* Dialogs and Modals */}
      <YamlPreviewModal
        yaml={compiledYaml}
        isOpen={isYamlOpen}
        onClose={() => setIsYamlOpen(false)}
      />

      <ScriptExportModal
        isOpen={isScriptExportOpen}
        onClose={() => setIsScriptExportOpen(false)}
        workflowName={workflowName}
        scriptContent={compiledLoadTestScript}
      />

      <LoadTestAnalyticsPanel
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        workflowName={workflowName}
        nodes={nodes}
        connections={connections}
        onOpenScriptExport={() => {
          setIsAnalyticsOpen(false);
          setIsScriptExportOpen(true);
        }}
      />

      <AiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        onApplyGeneratedWorkflow={handleApplyAiWorkflow}
      />

      <YamlImportModal
        isOpen={isImportYamlOpen}
        onClose={() => setIsImportYamlOpen(false)}
        onImportYaml={handleImportYaml}
      />

      <WorkflowRunModal
        isOpen={isRunModalOpen}
        onClose={() => setIsRunModalOpen(false)}
        workflowName={workflowName}
        nodes={nodes}
        connections={connections}
      />

      <TemplateExplorerModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplatePreset}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Hidden file input for opening native .noitca files */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".noitca,.json"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
}
