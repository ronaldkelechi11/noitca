import React, { useState } from 'react';
import { 
  HiFolder, 
  HiDocumentText, 
  HiMagnifyingGlass, 
  HiChevronRight, 
  HiSparkles,
  HiComputerDesktop,
  HiClock,
  HiCheck
} from 'react-icons/hi2';
import { FaDocker, FaNodeJs, FaPython, FaGitAlt, FaSlack } from 'react-icons/fa6';
import { WorkflowNode, NodeConnection } from '../types/workflow';
import { INITIAL_NODES, INITIAL_CONNECTIONS } from '../utils/defaultWorkflow';

export interface WorkflowTemplatePreset {
  id: string;
  filename: string;
  name: string;
  category: string;
  size: string;
  dateModified: string;
  description: string;
  icon: React.ReactNode;
  nodes: WorkflowNode[];
  connections: NodeConnection[];
}

export const TEMPLATE_PRESETS: WorkflowTemplatePreset[] = [
  {
    id: 'blank',
    filename: '01_Blank_Canvas.noitca',
    name: 'Blank Canvas',
    category: 'Blank Projects',
    size: '0 KB',
    dateModified: 'Just now',
    description: 'Start with a completely empty canvas and build your workflow from scratch.',
    icon: <HiDocumentText className="w-8 h-8 text-neutral-400" />,
    nodes: [],
    connections: [],
  },
  {
    id: 'basic-deploy',
    filename: '02_Basic_Deployment_Pipeline.noitca',
    name: 'Basic Deployment Pipeline',
    category: 'CI/CD Pipelines',
    size: '4.2 KB',
    dateModified: 'Today, 2:40 PM',
    description: 'Standard deployment pipeline: Push -> Checkout -> Setup Node 22 -> npm ci -> npm test -> npm run build -> SSH Deploy -> HTTP Health Check.',
    icon: <FaNodeJs className="w-8 h-8 text-yellow-400" />,
    nodes: INITIAL_NODES,
    connections: INITIAL_CONNECTIONS,
  },
  {
    id: 'docker-ci',
    filename: '03_Docker_Container_CICD.noitca',
    name: 'Docker Container CI/CD',
    category: 'Docker Workflows',
    size: '3.8 KB',
    dateModified: 'Yesterday',
    description: 'Docker image pipeline: Push -> Checkout -> Setup Docker Buildx -> Docker Login -> Build Image -> Push Image to Registry.',
    icon: <FaDocker className="w-8 h-8 text-amber-400" />,
    nodes: [
      {
        id: 'd-1',
        type: 'trigger_push',
        title: 'Push Event',
        subtitle: 'Branch: main',
        category: 'Triggers',
        x: 100,
        y: 80,
        iconType: 'push',
        badge: 'TRIGGER',
        badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        config: { branch: 'main' },
      },
      {
        id: 'd-2',
        type: 'repo_checkout',
        title: 'Checkout Repository',
        subtitle: 'actions/checkout@v4',
        category: 'Repository',
        x: 100,
        y: 220,
        iconType: 'checkout',
        badge: 'REPO',
        badgeColor: 'bg-neutral-800 text-yellow-300 border-neutral-700',
        config: { repository: 'self' },
      },
      {
        id: 'd-3',
        type: 'env_setup_docker',
        title: 'Setup Docker Buildx',
        subtitle: 'docker/setup-buildx-action@v3',
        category: 'Environment',
        x: 100,
        y: 360,
        iconType: 'setup_docker',
        badge: 'ENV',
        badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        config: {},
      },
      {
        id: 'd-4',
        type: 'docker_login',
        title: 'Docker Login',
        subtitle: 'docker/login-action@v3',
        category: 'Docker',
        x: 100,
        y: 500,
        iconType: 'docker_login',
        badge: 'DOCKER',
        badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        config: { registry: 'docker.io', username: '${{ secrets.DOCKER_USERNAME }}' },
      },
      {
        id: 'd-5',
        type: 'docker_build',
        title: 'Build Image',
        subtitle: 'myapp:latest',
        category: 'Docker',
        x: 100,
        y: 640,
        iconType: 'docker_build',
        badge: 'DOCKER',
        badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        config: { dockerImage: 'myapp', dockerTag: 'latest' },
      },
      {
        id: 'd-6',
        type: 'docker_push',
        title: 'Push Image',
        subtitle: 'docker push myapp:latest',
        category: 'Docker',
        x: 100,
        y: 780,
        iconType: 'docker_push',
        badge: 'DOCKER',
        badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        config: { dockerImage: 'myapp', dockerTag: 'latest' },
      },
    ],
    connections: [
      { id: 'dc-1', fromNodeId: 'd-1', toNodeId: 'd-2' },
      { id: 'dc-2', fromNodeId: 'd-2', toNodeId: 'd-3' },
      { id: 'dc-3', fromNodeId: 'd-3', toNodeId: 'd-4' },
      { id: 'dc-4', fromNodeId: 'd-4', toNodeId: 'd-5' },
      { id: 'dc-5', fromNodeId: 'd-5', toNodeId: 'd-6' },
    ],
  },
  {
    id: 'python-app',
    filename: '04_Python_App_Workflow.noitca',
    name: 'Python Application Workflow',
    category: 'Language Runtimes',
    size: '3.2 KB',
    dateModified: '3 days ago',
    description: 'Python CI workflow: Pull Request -> Checkout -> Setup Python 3.12 -> pip install -r requirements.txt -> pytest -> Upload Artifact.',
    icon: <FaPython className="w-8 h-8 text-yellow-400" />,
    nodes: [
      {
        id: 'p-1',
        type: 'trigger_pr',
        title: 'Pull Request',
        subtitle: 'Branch: main',
        category: 'Triggers',
        x: 100,
        y: 80,
        iconType: 'pr',
        badge: 'TRIGGER',
        badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        config: { branch: 'main' },
      },
      {
        id: 'p-2',
        type: 'repo_checkout',
        title: 'Checkout Repository',
        subtitle: 'actions/checkout@v4',
        category: 'Repository',
        x: 100,
        y: 220,
        iconType: 'checkout',
        badge: 'REPO',
        badgeColor: 'bg-neutral-800 text-yellow-300 border-neutral-700',
        config: { repository: 'self' },
      },
      {
        id: 'p-3',
        type: 'env_setup_python',
        title: 'Setup Python',
        subtitle: 'Version: 3.12',
        category: 'Environment',
        x: 100,
        y: 360,
        iconType: 'python',
        badge: 'ENV',
        badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        config: { runtimeVersion: '3.12' },
      },
      {
        id: 'p-4',
        type: 'cmd_run',
        title: 'Install Requirements',
        subtitle: 'pip install -r requirements.txt',
        category: 'Commands',
        x: 100,
        y: 500,
        iconType: 'terminal',
        badge: 'CMD',
        badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        config: { command: 'pip install -r requirements.txt' },
      },
      {
        id: 'p-5',
        type: 'quality_test',
        title: 'Run Pytest',
        subtitle: 'pytest tests/',
        category: 'Quality',
        x: 100,
        y: 640,
        iconType: 'test',
        badge: 'TEST',
        badgeColor: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
        config: { command: 'pytest tests/' },
      },
    ],
    connections: [
      { id: 'pc-1', fromNodeId: 'p-1', toNodeId: 'p-2' },
      { id: 'pc-2', fromNodeId: 'p-2', toNodeId: 'p-3' },
      { id: 'pc-3', fromNodeId: 'p-3', toNodeId: 'p-4' },
      { id: 'pc-4', fromNodeId: 'p-4', toNodeId: 'p-5' },
    ],
  },
  {
    id: 'slack-health',
    filename: '05_Slack_Health_Alerts.noitca',
    name: 'Scheduled Health Check & Slack Alerts',
    category: 'CI/CD Pipelines',
    size: '2.9 KB',
    dateModified: '5 days ago',
    description: 'Cron workflow: Schedule Cron (hourly) -> HTTP Health Check -> Post Slack Alert on failure/success.',
    icon: <FaSlack className="w-8 h-8 text-amber-300" />,
    nodes: [
      {
        id: 's-1',
        type: 'trigger_cron',
        title: 'Schedule Cron',
        subtitle: 'cron: 0 * * * *',
        category: 'Triggers',
        x: 100,
        y: 80,
        iconType: 'cron',
        badge: 'TRIGGER',
        badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        config: { cron: '0 * * * *' },
      },
      {
        id: 's-2',
        type: 'verify_health',
        title: 'HTTP Health Check',
        subtitle: 'https://api.example.com/health',
        category: 'Verification',
        x: 100,
        y: 220,
        iconType: 'health',
        badge: 'VERIFY',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        config: { healthUrl: 'https://api.example.com/health', expectedStatus: 200 },
      },
      {
        id: 's-3',
        type: 'notify_slack',
        title: 'Slack Alert Notification',
        subtitle: '#deployments channel',
        category: 'Notifications',
        x: 100,
        y: 360,
        iconType: 'slack',
        badge: 'NOTIFY',
        badgeColor: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/40',
        config: { channel: '#deployments' },
      },
    ],
    connections: [
      { id: 'sc-1', fromNodeId: 's-1', toNodeId: 's-2' },
      { id: 'sc-2', fromNodeId: 's-2', toNodeId: 's-3' },
    ],
  },
];

interface TemplateExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (preset: WorkflowTemplatePreset) => void;
}

export const TemplateExplorerModal: React.FC<TemplateExplorerModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedId, setSelectedId] = useState<string>('basic-deploy');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const categories = ['All', 'Blank Projects', 'CI/CD Pipelines', 'Docker Workflows', 'Language Runtimes'];

  const filteredPresets = TEMPLATE_PRESETS.filter(preset => {
    const matchesSearch = preset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          preset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          preset.filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || preset.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const currentSelectedPreset = TEMPLATE_PRESETS.find(p => p.id === selectedId) || TEMPLATE_PRESETS[1];

  const handleConfirm = () => {
    if (currentSelectedPreset) {
      onSelectTemplate(currentSelectedPreset);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in font-sans">
      {/* Windows File Explorer Styled Window */}
      <div className="bg-black border border-neutral-700 rounded-xl w-full max-w-4xl flex flex-col h-[620px] shadow-2xl overflow-hidden shadow-yellow-500/10">
        
        {/* Title Bar */}
        <div className="h-9 bg-neutral-900 border-b border-neutral-800 px-3 flex items-center justify-between select-none">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="noitca" className="w-4 h-4 object-contain" />
            <span className="text-xs font-semibold text-neutral-300 font-mono">
              File Explorer - Select Workflow Template (C:\noitca\templates)
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <button className="w-6 h-5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded flex items-center justify-center text-xs">_</button>
            <button className="w-6 h-5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded flex items-center justify-center text-xs">▢</button>
            <button onClick={onClose} className="w-6 h-5 text-neutral-400 hover:text-white hover:bg-rose-600 rounded flex items-center justify-center text-xs font-bold">✕</button>
          </div>
        </div>

        {/* Ribbon Header Bar & Address Input */}
        <div className="p-2 bg-neutral-950 border-b border-neutral-800/80 flex flex-col gap-2">
          {/* File Explorer Ribbon Tabs */}
          <div className="flex items-center space-x-4 text-xs text-neutral-400 px-2 font-medium">
            <span className="text-yellow-400 font-bold border-b-2 border-yellow-400 pb-0.5">File</span>
            <span className="hover:text-neutral-200 cursor-pointer">Home</span>
            <span className="hover:text-neutral-200 cursor-pointer">Share</span>
            <span className="hover:text-neutral-200 cursor-pointer">View</span>
          </div>

          {/* Address & Search Input */}
          <div className="flex items-center space-x-2">
            {/* Address Bar */}
            <div className="flex-1 bg-black border border-neutral-800 rounded-md px-3 py-1 flex items-center space-x-2 text-xs font-mono text-neutral-300">
              <HiFolder className="w-4 h-4 text-yellow-400" />
              <HiChevronRight className="w-3 h-3 text-neutral-600" />
              <span>This PC</span>
              <HiChevronRight className="w-3 h-3 text-neutral-600" />
              <span>noitca</span>
              <HiChevronRight className="w-3 h-3 text-neutral-600" />
              <span className="text-yellow-400 font-bold">templates</span>
            </div>

            {/* Search Bar */}
            <div className="w-64 relative">
              <HiMagnifyingGlass className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded-md pl-8 pr-3 py-1 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>
        </div>

        {/* File Explorer Main Split Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation Tree Pane */}
          <div className="w-52 bg-black border-r border-neutral-800 p-3 space-y-4 shrink-0 overflow-y-auto text-xs">
            {/* Quick Access */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-2">Quick Access</span>
              <button className="w-full flex items-center space-x-2 px-2 py-1.5 rounded bg-neutral-900 text-yellow-400 font-medium">
                <HiSparkles className="w-4 h-4 text-yellow-400" />
                <span>Templates</span>
              </button>
              <button className="w-full flex items-center space-x-2 px-2 py-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-900/60">
                <HiClock className="w-4 h-4" />
                <span>Recent</span>
              </button>
            </div>

            {/* Categories Folder Tree */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-2">Categories</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded transition-colors text-left ${
                    activeCategory === cat
                      ? 'bg-yellow-400/10 text-yellow-400 font-semibold border-l-2 border-yellow-400'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                  }`}
                >
                  <HiFolder className="w-4 h-4 text-yellow-400/80" />
                  <span className="truncate">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right File Item Cards Grid View */}
          <div className="flex-1 bg-neutral-950 p-4 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredPresets.map((preset) => {
                const isSelected = preset.id === selectedId;

                return (
                  <div
                    key={preset.id}
                    onClick={() => setSelectedId(preset.id)}
                    onDoubleClick={() => {
                      setSelectedId(preset.id);
                      onSelectTemplate(preset);
                      onClose();
                    }}
                    className={`group relative p-4 rounded-xl border cursor-pointer transition-all duration-150 flex flex-col justify-between select-none ${
                      isSelected
                        ? 'bg-black border-yellow-400 ring-2 ring-yellow-400/30 shadow-lg shadow-yellow-500/10'
                        : 'bg-black/60 border-neutral-800/90 hover:border-neutral-700 hover:bg-neutral-900/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl">
                          {preset.icon}
                        </div>
                        {isSelected && (
                          <span className="p-1 rounded-full bg-yellow-400 text-black">
                            <HiCheck className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-white group-hover:text-yellow-400 transition-colors">
                        {preset.name}
                      </h4>
                      <p className="text-[11px] font-mono text-yellow-400/80 mt-0.5">{preset.filename}</p>

                      <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                      <span>Size: {preset.size}</span>
                      <span>Modified: {preset.dateModified}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Windows Explorer Bottom Status / Action Bar */}
        <div className="p-3 bg-neutral-900 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-neutral-400 font-mono">File name:</span>
            <input
              type="text"
              readOnly
              value={currentSelectedPreset.filename}
              className="bg-black border border-neutral-800 rounded px-2 py-1 text-yellow-400 font-mono text-xs w-full sm:w-72"
            />
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-neutral-400 hover:text-white rounded border border-neutral-800 hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded shadow-lg shadow-yellow-500/20 transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <HiCheck className="w-4 h-4" />
              <span>Open / Load Template</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
