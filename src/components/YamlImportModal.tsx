import React, { useState } from 'react';
import { HiXMark, HiArrowUpTray, HiDocumentText, HiCheck, HiExclamationCircle, HiSparkles } from 'react-icons/hi2';

interface YamlImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportYaml: (yamlContent: string) => void;
}

const SAMPLE_YAML_PRESET = `name: Production Deployment Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build_and_deploy:
    name: Build & Deploy Application
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository Code
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install Project Dependencies
        run: npm ci

      - name: Execute Unit & Integration Tests
        run: npm test

      - name: Compile Production Bundle
        run: npm run build

      - name: Upload Build Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: frontend-dist
          path: ./dist

      - name: Deploy to Remote Server via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: production.example.com
          username: deploy
          port: 22
          script: docker compose up -d --build

      - name: Verify Application HTTP Endpoint
        run: |
          echo "Checking health endpoint"
          status=$(curl -o /dev/null -s -w "%{http_code}" https://api.example.com/health)
          if [ "$status" -eq 200 ]; then
            echo "Health check passed!"
          fi
`;

export const YamlImportModal: React.FC<YamlImportModalProps> = ({ isOpen, onClose, onImportYaml }) => {
  const [yamlInput, setYamlInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImport = () => {
    if (!yamlInput.trim()) {
      setErrorMsg('Please paste YAML content or upload a .yml file first.');
      return;
    }

    try {
      setErrorMsg(null);
      onImportYaml(yamlInput);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse YAML file. Please verify syntax.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setYamlInput(content);
        setErrorMsg(null);
      }
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    setYamlInput(SAMPLE_YAML_PRESET);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-black border border-neutral-800 rounded-2xl w-full max-w-3xl flex flex-col max-h-[85vh] shadow-2xl overflow-hidden shadow-yellow-500/10">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800/80 flex items-center justify-between bg-black">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-400/10 text-yellow-400 border border-yellow-500/30 rounded-xl">
              <HiArrowUpTray className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Import GitHub Actions YAML</h3>
              <p className="text-xs text-neutral-400">Map your <code className="text-yellow-400 font-mono">.github/workflows/*.yml</code> file directly into a flow chart canvas</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleLoadSample}
              className="flex items-center space-x-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <HiSparkles className="w-4 h-4 text-yellow-400" />
              <span>Load Sample</span>
            </button>

            <label className="flex items-center space-x-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer">
              <HiDocumentText className="w-4 h-4 text-yellow-400" />
              <span>Choose File</span>
              <input
                type="file"
                accept=".yml,.yaml"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors ml-2 cursor-pointer"
            >
              <HiXMark className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 bg-neutral-950 p-4 flex flex-col space-y-3">
          {errorMsg && (
            <div className="flex items-center space-x-2 bg-rose-950/80 border border-rose-800 text-rose-300 p-3 rounded-lg text-xs">
              <HiExclamationCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <textarea
            rows={12}
            value={yamlInput}
            onChange={(e) => setYamlInput(e.target.value)}
            placeholder="Paste your GitHub Actions workflow YAML content here..."
            className="w-full flex-1 bg-black border border-neutral-800 rounded-xl p-4 font-mono text-xs text-yellow-300 leading-relaxed focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 resize-none placeholder-neutral-600"
          />
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-800 bg-black flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs text-neutral-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleImport}
            className="flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold px-5 py-2 rounded-lg shadow-lg shadow-yellow-500/20 transition-all cursor-pointer"
          >
            <HiCheck className="w-4 h-4" />
            <span>Map YAML to Flow Chart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
