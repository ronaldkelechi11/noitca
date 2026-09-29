import React from 'react';
import { WorkflowNode } from '../types/workflow';
import { NodeTemplate } from '../utils/defaultWorkflow';
import { HiXMark, HiTrash, HiCheck, HiCommandLine, HiPlus, HiGlobeAlt, HiUsers, HiShieldCheck } from 'react-icons/hi2';

interface NodeInspectorProps {
  node: WorkflowNode | null;
  previewTemplate?: NodeTemplate | null;
  onClose: () => void;
  onUpdateNode: (updatedNode: WorkflowNode) => void;
  onDeleteNode: (nodeId: string) => void;
  onAddTemplateToGrid?: (template: NodeTemplate) => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  node,
  previewTemplate,
  onClose,
  onUpdateNode,
  onDeleteNode,
  onAddTemplateToGrid,
}) => {
  if (!node && !previewTemplate) return null;

  const isPreview = Boolean(previewTemplate && !node);
  const currentTitle = isPreview ? previewTemplate!.title : node!.title;
  const currentBadge = isPreview ? previewTemplate!.badge : node!.badge;
  const currentBadgeColor = isPreview ? previewTemplate!.badgeColor : node!.badgeColor;
  const currentConfig = isPreview ? previewTemplate!.defaultConfig : node!.config;

  const handleChangeConfig = (key: string, value: any) => {
    if (isPreview) return;
    onUpdateNode({
      ...node!,
      config: {
        ...node!.config,
        [key]: value,
      },
    });
  };

  const handleTitleChange = (newTitle: string) => {
    if (isPreview) return;
    onUpdateNode({
      ...node!,
      title: newTitle,
    });
  };

  return (
    <div className="w-96 bg-black border-l border-neutral-800/80 flex flex-col h-full z-20 shadow-2xl shrink-0 font-sans">
      {/* Drawer Header */}
      <div className="p-4 border-b border-neutral-800/80 flex items-center justify-between bg-black">
        <div>
          <div className="flex items-center space-x-2">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-medium ${currentBadgeColor || 'bg-neutral-800 text-neutral-400'}`}>
              {currentBadge}
            </span>
            {isPreview && (
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-yellow-400/10 text-yellow-400 border border-yellow-500/20">
                Preview
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-white mt-1">{currentTitle}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
        >
          <HiXMark className="w-5 h-5" />
        </button>
      </div>

      {/* Settings Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* Step Label */}
        <div className="space-y-1.5">
          <label className="font-semibold text-neutral-300">Step Title</label>
          <input
            type="text"
            value={currentTitle}
            disabled={isPreview}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 disabled:opacity-70"
          />
        </div>

        {/* --- LOAD TEST SPECIFIC FIELDS --- */}

        {/* Target Base URL */}
        {currentConfig.baseUrl !== undefined && (
          <div className="space-y-2 pt-2 border-t border-neutral-800/80">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
              <HiGlobeAlt className="w-4 h-4" />
              <span>Target Server Endpoint</span>
            </div>
            <div className="space-y-1.5">
              <label className="text-neutral-300">Base Webservice URL</label>
              <input
                type="text"
                value={currentConfig.baseUrl}
                disabled={isPreview}
                onChange={(e) => handleChangeConfig('baseUrl', e.target.value)}
                placeholder="https://api.mywebserver.com"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-emerald-300 font-mono text-xs focus:outline-none focus:border-emerald-400 disabled:opacity-70"
              />
            </div>
          </div>
        )}

        {/* Traffic Profile Settings */}
        {(currentConfig.virtualUsers !== undefined || currentConfig.durationSeconds !== undefined) && (
          <div className="space-y-3 pt-2 border-t border-neutral-800/80">
            <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
              <HiUsers className="w-4 h-4" />
              <span>Traffic & Concurrency Settings</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-300">Virtual Users (Concurrency)</label>
              <input
                type="number"
                value={currentConfig.virtualUsers || 50}
                disabled={isPreview}
                onChange={(e) => handleChangeConfig('virtualUsers', Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-400 disabled:opacity-70"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-neutral-400">Ramp-Up (sec)</label>
                <input
                  type="number"
                  value={currentConfig.rampUpSeconds || 5}
                  disabled={isPreview}
                  onChange={(e) => handleChangeConfig('rampUpSeconds', Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 font-mono text-xs focus:outline-none focus:border-amber-400 disabled:opacity-70"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-neutral-400">Duration (sec)</label>
                <input
                  type="number"
                  value={currentConfig.durationSeconds || 30}
                  disabled={isPreview}
                  onChange={(e) => handleChangeConfig('durationSeconds', Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 font-mono text-xs focus:outline-none focus:border-amber-400 disabled:opacity-70"
                />
              </div>
            </div>
          </div>
        )}

        {/* User Journey HTTP Request Step */}
        {(currentConfig.httpMethod !== undefined || currentConfig.endpointPath !== undefined) && (
          <div className="space-y-3 pt-2 border-t border-neutral-800/80">
            <div className="flex items-center space-x-1.5 text-blue-400 font-bold">
              <HiGlobeAlt className="w-4 h-4" />
              <span>User Journey HTTP Step</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <label className="text-neutral-400">Method</label>
                <select
                  value={currentConfig.httpMethod || 'GET'}
                  disabled={isPreview}
                  onChange={(e) => handleChangeConfig('httpMethod', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-2 text-blue-300 font-bold text-xs focus:outline-none focus:border-blue-400 disabled:opacity-70"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-neutral-400">Endpoint Path</label>
                <input
                  type="text"
                  value={currentConfig.endpointPath || '/'}
                  disabled={isPreview}
                  onChange={(e) => handleChangeConfig('endpointPath', e.target.value)}
                  placeholder="/api/v1/resource"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-blue-300 font-mono text-xs focus:outline-none focus:border-blue-400 disabled:opacity-70"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-400">Think Time Delay (ms)</label>
              <input
                type="number"
                value={currentConfig.thinkTimeMs || 100}
                disabled={isPreview}
                onChange={(e) => handleChangeConfig('thinkTimeMs', Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 font-mono text-xs focus:outline-none focus:border-blue-400 disabled:opacity-70"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-400">HTTP Body (JSON / Payload)</label>
              <textarea
                rows={3}
                value={currentConfig.body || ''}
                disabled={isPreview}
                onChange={(e) => handleChangeConfig('body', e.target.value)}
                placeholder='{"key": "value"}'
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 font-mono text-xs focus:outline-none focus:border-blue-400 disabled:opacity-70"
              />
            </div>
          </div>
        )}

        {/* SLA Gate Settings */}
        {(currentConfig.maxP95LatencyMs !== undefined || currentConfig.maxErrorPercentage !== undefined) && (
          <div className="space-y-3 pt-2 border-t border-neutral-800/80">
            <div className="flex items-center space-x-1.5 text-purple-400 font-bold">
              <HiShieldCheck className="w-4 h-4" />
              <span>SLA Quality Gate Thresholds</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-neutral-400">Max p95 Latency (ms)</label>
                <input
                  type="number"
                  value={currentConfig.maxP95LatencyMs || 500}
                  disabled={isPreview}
                  onChange={(e) => handleChangeConfig('maxP95LatencyMs', Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-purple-300 font-mono text-xs focus:outline-none focus:border-purple-400 disabled:opacity-70"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-400">Max Error Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentConfig.maxErrorPercentage || 2.0}
                  disabled={isPreview}
                  onChange={(e) => handleChangeConfig('maxErrorPercentage', Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-purple-300 font-mono text-xs focus:outline-none focus:border-purple-400 disabled:opacity-70"
                />
              </div>
            </div>
          </div>
        )}

        {/* --- CI/CD GENERIC FIELDS --- */}

        {currentConfig.branch !== undefined && (
          <div className="space-y-1.5">
            <label className="font-semibold text-neutral-300">Target Branch</label>
            <input
              type="text"
              value={currentConfig.branch}
              disabled={isPreview}
              onChange={(e) => handleChangeConfig('branch', e.target.value)}
              placeholder="main"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 disabled:opacity-70"
            />
          </div>
        )}

        {currentConfig.runtimeVersion !== undefined && (
          <div className="space-y-1.5">
            <label className="font-semibold text-neutral-300">Runtime Version</label>
            <input
              type="text"
              value={currentConfig.runtimeVersion}
              disabled={isPreview}
              onChange={(e) => handleChangeConfig('runtimeVersion', e.target.value)}
              placeholder="e.g. 22 or 3.12"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 disabled:opacity-70"
            />
          </div>
        )}

        {currentConfig.command !== undefined && (
          <div className="space-y-1.5">
            <label className="font-semibold text-neutral-300 flex items-center justify-between">
              <span>Run Command</span>
              <HiCommandLine className="w-4 h-4 text-yellow-400" />
            </label>
            <textarea
              rows={3}
              value={currentConfig.command}
              disabled={isPreview}
              onChange={(e) => handleChangeConfig('command', e.target.value)}
              placeholder="npm test"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-yellow-300 font-mono text-xs focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 disabled:opacity-70"
            />
          </div>
        )}

        {/* Condition Expression */}
        <div className="space-y-1.5 pt-2 border-t border-neutral-800/80">
          <label className="font-semibold text-neutral-300">Execution Condition (`if:`)</label>
          <input
            type="text"
            value={currentConfig.condition || ''}
            disabled={isPreview}
            onChange={(e) => handleChangeConfig('condition', e.target.value)}
            placeholder="e.g. github.ref == 'refs/heads/main'"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-yellow-300 font-mono text-xs focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 disabled:opacity-70"
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-neutral-800/80 bg-black flex items-center justify-between">
        {isPreview ? (
          <button
            onClick={() => {
              if (previewTemplate && onAddTemplateToGrid) {
                onAddTemplateToGrid(previewTemplate);
              }
            }}
            className="w-full flex items-center justify-center space-x-2 bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-lg transition-colors text-xs font-bold cursor-pointer"
          >
            <HiPlus className="w-4 h-4" />
            <span>Add Action to Grid</span>
          </button>
        ) : (
          <>
            <button
              onClick={() => onDeleteNode(node!.id)}
              className="flex items-center space-x-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium cursor-pointer"
            >
              <HiTrash className="w-4 h-4" />
              <span>Remove Step</span>
            </button>

            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-1.5 rounded-lg transition-colors text-xs font-bold cursor-pointer"
            >
              <HiCheck className="w-4 h-4" />
              <span>Done</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
