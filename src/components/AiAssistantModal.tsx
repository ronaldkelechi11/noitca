import React, { useState } from 'react';
import {
  HiSparkles,
  HiXMark,
  HiCpuChip,
  HiKey,
  HiGlobeAlt,
  HiArrowRight
} from 'react-icons/hi2';
import { generateLoadTestFromAiPrompt } from '../utils/aiScenarioAgent';
import { WorkflowNode, NodeConnection } from '../types/workflow';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyGeneratedWorkflow: (result: {
    workflowName: string;
    nodes: WorkflowNode[];
    connections: NodeConnection[];
  }) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  onApplyGeneratedWorkflow,
}) => {
  const [prompt, setPrompt] = useState(
    'Simulate realistic web service user actions: Sign in user, fetch profile data, search active jobs with search filters, and check notifications for 100 concurrent virtual users over 30 seconds.'
  );
  const [provider, setProvider] = useState<'built-in' | 'openrouter' | 'ollama' | 'gemini' | 'openai' | 'anthropic' | 'laya'>('built-in');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('https://api.mywebserver.com');
  const [customEndpoint, setCustomEndpoint] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const samplePrompts = [
    'E-Commerce Flash Sale: 200 users login, add items to cart, and hit checkout payment endpoint.',
    'SaaS Dashboard API Load: 50 users fetch account settings, query metrics endpoint, and export reports.',
    'Microservice Auth Spike: 300 concurrent requests to OAuth token endpoint with strict p95 < 200ms SLA.'
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const result = await generateLoadTestFromAiPrompt({
        prompt,
        provider,
        apiKey,
        customEndpoint,
        baseUrl
      });

      onApplyGeneratedWorkflow({
        workflowName: result.workflowName,
        nodes: result.nodes,
        connections: result.connections,
      });

      onClose();
    } catch (err: any) {
      alert(`AI Scenario Generation Error: ${err?.message || 'Failed to generate topology'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in font-sans">
      <div className="bg-black border border-neutral-800 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden shadow-rose-500/10">

        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
              <HiSparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">AI Load Test Scenario Agent</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 font-mono">
                  SMART AGENT
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-sans">Analyze user actions & codebase endpoints to generate load topologies</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-5 space-y-4 bg-neutral-950/50 text-xs">

          {/* Target Base URL */}
          <div className="space-y-1">
            <label className="text-neutral-300 font-medium flex items-center space-x-1.5">
              <HiGlobeAlt className="w-4 h-4 text-emerald-400" />
              <span>Target Webserver Base URL</span>
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.mywebserver.com"
              className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-rose-400"
            />
          </div>

          {/* AI Provider Switcher */}
          <div className="space-y-1">
            <label className="text-neutral-300 font-medium flex items-center space-x-1.5">
              <HiCpuChip className="w-4 h-4 text-rose-400" />
              <span>AI Provider & Model Engine</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
              {[
                { id: 'built-in', name: 'Built-in Agent' },
                { id: 'laya', name: 'Laya System 1' },
                { id: 'openrouter', name: 'OpenRouter' },
                { id: 'ollama', name: 'Ollama' },
                { id: 'gemini', name: 'Gemini' },
                { id: 'openai', name: 'OpenAI' },
                { id: 'anthropic', name: 'Claude' },
              ].map((prov) => (
                <button
                  key={prov.id}
                  type="button"
                  onClick={() => setProvider(prov.id as any)}
                  className={`px-1.5 py-1.5 rounded-lg border text-[10px] font-medium transition-all ${
                    provider === prov.id
                      ? 'bg-rose-500/10 border-rose-500 text-rose-300 font-bold'
                      : 'bg-black border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {prov.name}
                </button>
              ))}
            </div>
          </div>

          {/* Optional API Key Input if external AI provider selected */}
          {provider !== 'built-in' && provider !== 'ollama' && (
            <div className="space-y-1 animate-fade-in">
              <label className="text-neutral-300 font-medium flex items-center space-x-1.5">
                <HiKey className="w-4 h-4 text-yellow-400" />
                <span>{provider.toUpperCase()} API Key</span>
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-rose-400"
              />
            </div>
          )}

          {(provider === 'ollama' || provider === 'laya') && (
            <div className="space-y-1 animate-fade-in">
              <label className="text-neutral-300 font-medium">{provider === 'laya' ? 'Laya Endpoint URL' : 'Ollama Endpoint URL'}</label>
              <input
                type="text"
                value={customEndpoint || (provider === 'laya' ? 'http://localhost:8000/v1/systemone' : 'http://localhost:11434/api/generate')}
                onChange={(e) => setCustomEndpoint(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-rose-400"
              />
            </div>
          )}

          {/* Scenario Prompt Input */}
          <div className="space-y-1">
            <label className="text-neutral-300 font-medium">Describe User Journey or Load Scenario</label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Simulate 100 users logging in, fetching profile, querying jobs endpoint with filters, and checking notifications..."
              className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white text-xs leading-relaxed focus:outline-none focus:border-rose-400"
            />
          </div>

          {/* Sample Scenario Chips */}
          <div className="space-y-1.5">
            <span className="text-neutral-500 text-[10px] uppercase tracking-wider font-bold">Quick Preset Scenarios:</span>
            <div className="space-y-1">
              {samplePrompts.map((sp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(sp)}
                  className="w-full text-left p-2 rounded-lg bg-black border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition-colors text-[11px] truncate cursor-pointer"
                >
                  ▸ {sp}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500 font-mono">AI builds visual node graph automatically</span>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-400 hover:text-white text-xs rounded-lg border border-neutral-800 hover:bg-neutral-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerate}
              className="px-5 py-2 bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs rounded-lg shadow-lg shadow-rose-500/20 transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <HiSparkles className="w-4 h-4 animate-spin" />
                  <span>Generating Scenario Topology...</span>
                </>
              ) : (
                <>
                  <HiSparkles className="w-4 h-4" />
                  <span>Generate Load Scenario</span>
                  <HiArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
