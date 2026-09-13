import React, { useState } from 'react';
import { 
  HiCommandLine, 
  HiCpuChip, 
  HiBolt, 
  HiGlobeAlt, 
  HiCheckCircle, 
  HiArrowRight, 
  HiClipboard, 
  HiCheck, 
  HiSquares2X2,
  HiArrowPath,
  HiCodeBracket,
  HiChevronDown,
  HiArchiveBox,
  HiSparkles
} from 'react-icons/hi2';
import { 
  FaGithub, 
  FaDocker, 
  FaNodeJs, 
  FaSlack, 
  FaGitAlt, 
  FaCodeBranch, 
  FaGolang, 
  FaRust, 
  FaPython 
} from 'react-icons/fa6';

interface LandingPageProps {
  onLaunchEditor: () => void;
}

// Visual Flow Connector linking sections together like nodes on the canvas
const FlowConnector: React.FC<{
  fromStage: string;
  toStage: string;
  label: string;
}> = ({ fromStage, toStage, label }) => {
  return (
    <div className="relative flex flex-col items-center justify-center my-8 sm:my-12 z-20 select-none">
      {/* Output Port of Source Stage */}
      <div className="w-5 h-5 rounded-full bg-black border-2 border-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.7)] flex items-center justify-center z-10">
        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
      </div>

      {/* Glowing Conduit Cable */}
      <div className="relative w-[3px] h-20 sm:h-28 bg-neutral-900 overflow-hidden my-0.5">
        {/* Continuous soft glowing core */}
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/30 via-yellow-400 to-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.6)]" />
        
        {/* Fast animated traveling photon packet */}
        <div className="absolute w-full h-10 bg-gradient-to-b from-transparent via-yellow-200 to-transparent animate-flow-down shadow-[0_0_15px_#fef08a]" />
      </div>

      {/* Center Flow Transmission Badge */}
      <div className="absolute top-1/2 -translate-y-1/2 px-3 sm:px-4 py-1.5 rounded-full bg-black/95 border border-yellow-400/50 shadow-xl shadow-yellow-500/10 flex items-center space-x-2 text-[10px] sm:text-[11px] font-mono tracking-wider backdrop-blur-md z-20">
        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
        <span className="text-yellow-400 font-bold">{fromStage}</span>
        <span className="text-neutral-500">➜</span>
        <span className="text-white font-semibold">{toStage}</span>
        <span className="hidden md:inline text-neutral-600">|</span>
        <span className="hidden md:inline text-neutral-400 font-sans">{label}</span>
      </div>

      {/* Input Port of Destination Stage */}
      <div className="w-5 h-5 rounded-full bg-black border-2 border-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.7)] flex items-center justify-center z-10">
        <HiChevronDown className="w-3.5 h-3.5 text-yellow-400 animate-bounce" />
      </div>
    </div>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchEditor }) => {
  const [copiedTab, setCopiedTab] = useState<'npm' | 'curl' | 'docker' | null>(null);
  const [activeTab, setActiveTab] = useState<'npm' | 'curl' | 'docker'>('npm');
  const [activeCatalogTab, setActiveCatalogTab] = useState<'repo' | 'git' | 'artifacts' | 'builds'>('repo');

  const commands = {
    npm: 'npm install -g noitca\nnoitca start',
    curl: 'curl -fsSL https://get.noitca.dev | bash',
    docker: 'docker run -d -p 5173:5173 --name noitca ghcr.io/noitca/noitca:latest'
  };

  const copyCommand = (type: 'npm' | 'curl' | 'docker') => {
    navigator.clipboard.writeText(commands[type]);
    setCopiedTab(type);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-400 selection:text-black overflow-y-auto">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-black/85 backdrop-blur-md border-b border-neutral-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onLaunchEditor}>
            <img src="/logo.png" alt="noitca logo" className="h-8 w-auto object-contain" />
            <span className="text-xl font-extrabold tracking-tight text-white font-mono">
              noitca<span className="text-yellow-400">.</span>
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">
              v0.1.0-alpha
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm text-neutral-300">
            <a href="#pipeline" className="hover:text-yellow-400 transition-colors">Pipeline</a>
            <a href="#architecture" className="hover:text-yellow-400 transition-colors">Architecture</a>
            <a href="#catalog" className="hover:text-yellow-400 transition-colors">DevOps Catalog</a>
            <a href="#cli" className="hover:text-yellow-400 transition-colors">CLI Runtime</a>
            <a 
              href="https://github.com/ronaldkelechi11/noitca" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center space-x-1.5 hover:text-white transition-colors"
            >
              <FaGithub className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onLaunchEditor}
              className="flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-300 text-black text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-lg shadow-yellow-500/20 transition-all transform active:scale-95 cursor-pointer"
            >
              <span>Launch Studio</span>
              <HiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Flow Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 relative">
        
        {/* =========================================================================
            STAGE 01: INGRESS // WORKFLOW DEFINITION & QUICKSTART
           ========================================================================= */}
        <section id="hero" className="relative group">
          <div className="relative rounded-3xl bg-neutral-950/70 border border-neutral-800 hover:border-yellow-400/40 transition-all duration-300 p-8 sm:p-14 shadow-2xl overflow-hidden text-center flex flex-col items-center">
            
            {/* Top Stage Indicator Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-yellow-400/30 text-xs text-yellow-400 font-mono mb-6 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span>STAGE 01 // WORKFLOW INGRESS & DEFINITION</span>
            </div>

            {/* Glowing background halo */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-yellow-400/10 rounded-full blur-[130px] pointer-events-none" />

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl leading-[1.1]">
              Visual GitHub Actions without the <span className="text-yellow-400 underline decoration-yellow-400/40">YAML fatigue</span>.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-neutral-400 max-w-2xl leading-relaxed">
              Construct, configure, and inspect production CI/CD workflows directly on a tactile pure-black canvas. Export clean, compliant <code className="text-yellow-300 font-mono text-sm bg-neutral-900 px-1.5 py-0.5 rounded">.github/workflows</code> in seconds with zero cloud lock-in.
            </p>

            {/* Main Action CTAs */}
            <div className="mt-9 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full justify-center">
              <button
                onClick={onLaunchEditor}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-extrabold px-8 py-3.5 rounded-xl shadow-xl shadow-yellow-500/25 transition-all transform active:scale-95 cursor-pointer"
              >
                <span>Open Studio in Browser</span>
                <HiArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#cli"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold px-6 py-3.5 rounded-xl border border-neutral-800 hover:border-yellow-400/50 transition-all cursor-pointer"
              >
                <HiCommandLine className="w-4 h-4 text-yellow-400" />
                <span>Install CLI Tool</span>
              </a>
            </div>

            {/* Quick Terminal Box */}
            <div className="mt-12 w-full max-w-xl bg-black border border-neutral-800/90 rounded-2xl p-4 shadow-2xl text-left">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-900">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/70" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
                  <span className="text-xs font-mono text-neutral-400 ml-2">quickstart terminal</span>
                </div>

                <div className="flex items-center space-x-1 bg-neutral-900 p-1 rounded-lg">
                  {(['npm', 'curl', 'docker'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-[11px] font-mono px-2.5 py-1 rounded transition-colors ${
                        activeTab === tab ? 'bg-yellow-400 text-black font-bold' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between bg-neutral-950 rounded-xl p-3 border border-neutral-900 font-mono text-xs sm:text-sm text-yellow-300">
                <span className="truncate pr-4">{commands[activeTab]}</span>
                <button
                  onClick={() => copyCommand(activeTab)}
                  className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-yellow-400 transition-colors shrink-0 cursor-pointer"
                  title="Copy command"
                >
                  {copiedTab === activeTab ? (
                    <HiCheck className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <HiClipboard className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FLOW CONNECTOR 1 -> 2 */}
        <FlowConnector 
          fromStage="STAGE 01" 
          toStage="STAGE 02" 
          label="Parse Workflow AST ➔ Canvas Topology Engine" 
        />

        {/* =========================================================================
            STAGE 02: VISUAL GRAPH // PIPELINE VISUALIZATION & TOPOLOGY ENGINE
           ========================================================================= */}
        <section id="pipeline" className="relative group">
          <div className="relative rounded-3xl bg-neutral-950/70 border border-neutral-800 hover:border-yellow-400/40 transition-all duration-300 p-6 sm:p-10 shadow-2xl overflow-hidden">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-neutral-800/80">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-[11px] font-mono text-yellow-400 mb-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  <span>STAGE 02 // TOPOLOGY GRAPH ENGINE</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Real-time visual node graph with live parameter inspect.
                </h2>
              </div>

              <button
                onClick={onLaunchEditor}
                className="flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-300 text-black text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
              >
                <HiSparkles className="w-4 h-4" />
                <span>Open Canvas Studio</span>
              </button>
            </div>

            {/* Interactive Graph Simulation */}
            <div className="bg-black rounded-2xl border border-neutral-800 p-6 sm:p-8 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-900 text-xs">
                <div className="flex items-center space-x-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-neutral-300">Graph Valid: No Cycles</span>
                  <span className="text-neutral-700">|</span>
                  <span className="text-yellow-400 font-mono">4 Connected Nodes • 3 Edges</span>
                </div>
                <div className="hidden sm:flex items-center space-x-2 text-[11px] font-mono text-neutral-400">
                  <span>Zoom: 100%</span>
                  <span>•</span>
                  <span>Orientation: Vertical</span>
                </div>
              </div>

              {/* Grid of connected pipeline cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {/* Node 1 */}
                <div className="p-4 rounded-xl bg-neutral-950 border-2 border-yellow-400/60 shadow-lg text-left relative group/node hover:border-yellow-400 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <HiBolt className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs font-bold text-white">Push & Commit</span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-yellow-400/20 text-yellow-400 font-semibold">
                      trigger
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono">▸ branches: [main, dev]</div>
                  <div className="mt-3 text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                    <HiCheckCircle className="w-3 h-3" />
                    <span>Pipeline Entrypoint</span>
                  </div>
                </div>

                {/* Node 2 */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-yellow-400/50 shadow-lg text-left transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <FaGitAlt className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs font-bold text-white">Checkout Repo</span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      core
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono">▸ actions/checkout@v4</div>
                  <div className="mt-3 text-[10px] font-mono text-neutral-500">fetch-depth: 0</div>
                </div>

                {/* Node 3 */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-yellow-400/50 shadow-lg text-left transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <FaDocker className="w-4 h-4 text-amber-300" />
                      <span className="text-xs font-bold text-white">Build & Push</span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      docker
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono">▸ tags: noitca:latest</div>
                  <div className="mt-3 text-[10px] font-mono text-neutral-500">push: true</div>
                </div>

                {/* Node 4 */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-yellow-400/50 shadow-lg text-left transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <FaSlack className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs font-bold text-white">Notify Channel</span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-400">
                      success
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono">▸ channel: #releases</div>
                  <div className="mt-3 text-[10px] font-mono text-neutral-500">status: {"${{ job.status }}"}</div>
                </div>
              </div>

              {/* Bottom Canvas Features Pill */}
              <div className="mt-6 pt-4 border-t border-neutral-900 flex flex-wrap items-center justify-between text-xs text-neutral-400 gap-2">
                <span className="font-mono text-yellow-400">Tactile pure-black canvas</span>
                <div className="flex items-center space-x-4">
                  <span>Pan: Two-Finger Scroll</span>
                  <span>Zoom: Pinch / Scroll</span>
                  <span>Recenter: Key [C]</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FLOW CONNECTOR 2 -> 3 */}
        <FlowConnector 
          fromStage="STAGE 02" 
          toStage="STAGE 03" 
          label="Compile Graph ➔ Local-First Engine Architecture" 
        />

        {/* =========================================================================
            STAGE 03: ARCHITECTURE // 6 CORE SYSTEM TENETS
           ========================================================================= */}
        <section id="architecture" className="relative group">
          <div className="relative rounded-3xl bg-neutral-950/70 border border-neutral-800 hover:border-yellow-400/40 transition-all duration-300 p-8 sm:p-12 shadow-2xl overflow-hidden">
            
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-[11px] font-mono text-yellow-400 mb-3">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span>STAGE 03 // ENGINE ARCHITECTURE</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Architected for speed. Zero cloud lock-in.
              </h2>
              <p className="mt-3 text-neutral-400 text-sm sm:base">
                Built specifically for developers and DevOps teams who demand instant, reliable local feedback.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-black border border-neutral-800 hover:border-yellow-400/40 transition-all group/card">
                <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-4 text-yellow-400 group-hover/card:scale-110 transition-transform">
                  <HiCpuChip className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">100% Local-First</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  No accounts, no external SaaS dependencies, and zero data leakage. All pipeline configurations live on your local machine and compile directly to standard YAML.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-black border border-neutral-800 hover:border-yellow-400/40 transition-all group/card">
                <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-4 text-yellow-400 group-hover/card:scale-110 transition-transform">
                  <HiCodeBracket className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Bi-directional YAML</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Import any legacy <code className="text-yellow-400">.github/workflows/*.yml</code> file to instantly visualize its graph, or export your diagram back to syntax-validated GitHub Actions YAML.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-black border border-neutral-800 hover:border-yellow-400/40 transition-all group/card">
                <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-4 text-yellow-400 group-hover/card:scale-110 transition-transform">
                  <HiSquares2X2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Infinite Gridlines Canvas</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Fluid touchpad pinch-to-zoom (20% – 250%), 2-finger panning, quick auto-center (<kbd className="px-1 bg-neutral-900 border border-neutral-700 rounded text-[10px]">C</kbd>), and dynamic vertical or horizontal flow.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-2xl bg-black border border-neutral-800 hover:border-yellow-400/40 transition-all group/card">
                <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-4 text-yellow-400 group-hover/card:scale-110 transition-transform">
                  <HiArrowPath className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">History & Shortcuts</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Unrestricted Undo/Redo (<kbd className="px-1 bg-neutral-900 border border-neutral-700 rounded text-[10px]">⌘Z</kbd>), Copy/Paste (<kbd className="px-1 bg-neutral-900 border border-neutral-700 rounded text-[10px]">⌘C</kbd>/<kbd className="px-1 bg-neutral-900 border border-neutral-700 rounded text-[10px]">⌘V</kbd>), Duplication, and full keyboard-first ergonomics.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="p-6 rounded-2xl bg-black border border-neutral-800 hover:border-yellow-400/40 transition-all group/card">
                <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-4 text-yellow-400 group-hover/card:scale-110 transition-transform">
                  <HiBolt className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Curated DevOps Catalog</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Over 30+ preconfigured actions: Core Repository checkout & clone, Git commits & tags, Artifacts upload/download, Docker, Node, Python, Rust, Go, Slack, and Matrix builds.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="p-6 rounded-2xl bg-black border border-neutral-800 hover:border-yellow-400/40 transition-all group/card">
                <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-4 text-yellow-400 group-hover/card:scale-110 transition-transform">
                  <HiGlobeAlt className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Self-Hosted CLI Daemon</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Launch with <code className="text-yellow-400">noitca start</code> with terminal ASCII banners, health check with <code className="text-yellow-400">noitca status</code>, and update checks in one terminal command.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FLOW CONNECTOR 3 -> 4 */}
        <FlowConnector 
          fromStage="STAGE 03" 
          toStage="STAGE 04" 
          label="Dispatch Spec ➔ Curated DevOps Operations Suite" 
        />

        {/* =========================================================================
            STAGE 04: ACTION SUITE // CURATED DEVOPS CATALOG SHOWCASE
           ========================================================================= */}
        <section id="catalog" className="relative group">
          <div className="relative rounded-3xl bg-neutral-950/70 border border-neutral-800 hover:border-yellow-400/40 transition-all duration-300 p-8 sm:p-12 shadow-2xl overflow-hidden">
            
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pb-8 mb-8 border-b border-neutral-800">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-[11px] font-mono text-yellow-400 mb-3">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  <span>STAGE 04 // DEVOPS ACTION CATALOG</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Expanded Core Repository, Git & Artifacts Suite
                </h2>
                <p className="text-neutral-400 text-sm mt-2">
                  Pre-wired with production inputs, secrets placeholders, and GitHub syntax standards.
                </p>
              </div>

              {/* Catalog Tabs */}
              <div className="flex items-center space-x-2 bg-black border border-neutral-800 p-1.5 rounded-xl">
                <button
                  onClick={() => setActiveCatalogTab('repo')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeCatalogTab === 'repo'
                      ? 'bg-yellow-400 text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <FaGitAlt className="w-3.5 h-3.5" />
                  <span>Repository</span>
                </button>

                <button
                  onClick={() => setActiveCatalogTab('git')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeCatalogTab === 'git'
                      ? 'bg-yellow-400 text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <FaCodeBranch className="w-3.5 h-3.5" />
                  <span>Git Operations</span>
                </button>

                <button
                  onClick={() => setActiveCatalogTab('artifacts')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeCatalogTab === 'artifacts'
                      ? 'bg-yellow-400 text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <HiArchiveBox className="w-3.5 h-3.5" />
                  <span>Artifacts</span>
                </button>

                <button
                  onClick={() => setActiveCatalogTab('builds')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeCatalogTab === 'builds'
                      ? 'bg-yellow-400 text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <FaDocker className="w-3.5 h-3.5" />
                  <span>Build & Test</span>
                </button>
              </div>
            </div>

            {/* Dynamic Catalog Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCatalogTab === 'repo' && (
                <>
                  <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-yellow-400/40 text-left">
                    <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs mb-1">
                      <FaGitAlt className="w-4 h-4" />
                      <span>Checkout Repository</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">actions/checkout@v4</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-500">Config: fetch-depth, submodules, lfs, ref</div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-yellow-400/40 text-left">
                    <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs mb-1">
                      <FaGitAlt className="w-4 h-4" />
                      <span>Clone External Repo</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">git clone with auth</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-500">Config: repo url, branch, target dir, token</div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-yellow-400/40 text-left">
                    <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs mb-1">
                      <FaGitAlt className="w-4 h-4" />
                      <span>Fetch Remote Changes</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">git fetch --prune --tags</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-500">Config: remote, tags, prune, depth</div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-yellow-400/40 text-left">
                    <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs mb-1">
                      <FaGitAlt className="w-4 h-4" />
                      <span>Checkout Branch</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">git checkout -B branch</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-500">Config: branch name, create if missing</div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-yellow-400/40 text-left">
                    <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs mb-1">
                      <FaGitAlt className="w-4 h-4" />
                      <span>Checkout Commit SHA</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">git checkout commit-hash</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-500">Config: commit SHA, detached HEAD</div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-yellow-400/40 text-left">
                    <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs mb-1">
                      <FaGitAlt className="w-4 h-4" />
                      <span>Submodule Sync & Init</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">git submodule update --init</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-500">Config: recursive, depth, remote</div>
                  </div>
                </>
              )}

              {activeCatalogTab === 'git' && (
                <>
                  <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-yellow-400/40 text-left">
                    <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs mb-1">
                      <FaCodeBranch className="w-4 h-4" />
                      <span>Commit Changes</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">git add && git commit -m</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-500">Config: message, author, files pattern</div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-yellow-400/40 text-left">
                    <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs mb-1">
                      <FaCodeBranch className="w-4 h-4" />
                      <span>Push to Remote</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">git push origin branch</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-500">Config: branch, force push, set upstream</div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-yellow-400/40 text-left">
                    <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs mb-1">
                      <FaCodeBranch className="w-4 h-4" />
                      <span>Create Semantic Tag</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">git tag -a v1.0.0</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-500">Config: tag name, message, push tag</div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-yellow-400/40 text-left">
                    <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs mb-1">
                      <FaCodeBranch className="w-4 h-4" />
                      <span>Merge Branch</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">git merge --no-ff</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-500">Config: source, target, squash flag</div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-yellow-400/40 text-left">
                    <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs mb-1">
                      <FaCodeBranch className="w-4 h-4" />
                      <span>Publish GitHub Release</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">softprops/action-gh-release@v2</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-500">Config: tag, notes, draft, prerelease</div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-yellow-400/40 text-left">
                    <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs mb-1">
                      <FaCodeBranch className="w-4 h-4" />
                      <span>Rebase Branch</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">git rebase upstream/main</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-500">Config: upstream branch, autostash</div>
                  </div>
                </>
              )}

              {activeCatalogTab === 'artifacts' && (
                <>
                  <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-yellow-400/40 text-left">
                    <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs mb-1">
                      <HiArchiveBox className="w-4 h-4" />
                      <span>Upload Artifact</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">actions/upload-artifact@v4</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-500">Config: name, path, retention-days</div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-yellow-400/40 text-left">
                    <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs mb-1">
                      <HiArchiveBox className="w-4 h-4" />
                      <span>Download Artifact</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">actions/download-artifact@v4</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-500">Config: name, target destination path</div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-yellow-400/40 text-left">
                    <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs mb-1">
                      <HiArchiveBox className="w-4 h-4" />
                      <span>Upload Build Output</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">dist / build / target bundle</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-500">Config: build directory, zip compression</div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-yellow-400/40 text-left">
                    <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs mb-1">
                      <HiArchiveBox className="w-4 h-4" />
                      <span>Test Results Reporter</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">dorny/test-reporter@v1</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-500">Config: JUnit, Jest, xUnit reports</div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-yellow-400/40 text-left">
                    <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs mb-1">
                      <HiArchiveBox className="w-4 h-4" />
                      <span>Code Coverage Artifact</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">codecov/codecov-action@v4</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-500">Config: lcov, cobertura, token</div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-yellow-400/40 text-left">
                    <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs mb-1">
                      <HiArchiveBox className="w-4 h-4" />
                      <span>Download Previous Build</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">dawidd6/action-download-artifact</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-500">Config: workflow, branch, run_id</div>
                  </div>
                </>
              )}

              {activeCatalogTab === 'builds' && (
                <>
                  <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-yellow-400/40 text-left">
                    <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs mb-1">
                      <FaNodeJs className="w-4 h-4" />
                      <span>Node.js CI Pipeline</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">actions/setup-node@v4</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-500">Config: node-version, cache: npm/pnpm/yarn</div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-yellow-400/40 text-left">
                    <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs mb-1">
                      <FaDocker className="w-4 h-4" />
                      <span>Docker Build & Push</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">docker/build-push-action@v5</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-500">Config: tags, context, platforms, push</div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-yellow-400/40 text-left">
                    <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs mb-1">
                      <FaPython className="w-4 h-4" />
                      <span>Python Setup & Pytest</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">actions/setup-python@v5</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-500">Config: python-version, pip cache</div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-yellow-400/40 text-left">
                    <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs mb-1">
                      <FaGolang className="w-4 h-4" />
                      <span>Go Build & Test</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">actions/setup-go@v5</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-500">Config: go-version, cache-dependency-path</div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-yellow-400/40 text-left">
                    <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs mb-1">
                      <FaRust className="w-4 h-4" />
                      <span>Rust Toolchain CI</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">dtolnay/rust-toolchain@stable</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-500">Config: toolchain: stable, cargo test</div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-yellow-400/40 text-left">
                    <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs mb-1">
                      <FaSlack className="w-4 h-4" />
                      <span>Team Notifications</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">Slack, Discord, Matrix</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-500">Config: webhook-url, payload, condition</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* FLOW CONNECTOR 4 -> 5 */}
        <FlowConnector 
          fromStage="STAGE 04" 
          toStage="STAGE 05" 
          label="Compile Pipeline ➔ Spawn Self-Hosted CLI Daemon" 
        />

        {/* =========================================================================
            STAGE 05: RUNTIME DAEMON // CLI ENGINE & SYSTEM HEALTH
           ========================================================================= */}
        <section id="cli" className="relative group">
          <div className="relative rounded-3xl bg-neutral-950/70 border border-neutral-800 hover:border-yellow-400/40 transition-all duration-300 p-8 sm:p-12 shadow-2xl overflow-hidden">
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-md text-left">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-[11px] font-mono text-yellow-400">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  <span>STAGE 05 // LOCAL RUNTIME DAEMON</span>
                </div>
                <h3 className="text-3xl font-extrabold text-white">
                  Run anywhere. From laptop to bare metal.
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Whether you install globally with npm, execute zero-install with npx, or run inside Docker, noitca fires up instantly and serves both on local and your local network interface.
                </p>
                
                <div className="pt-2 flex items-center space-x-3">
                  <button
                    onClick={onLaunchEditor}
                    className="inline-flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    <span>Open Studio Directly</span>
                    <HiArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href="https://github.com/ronaldkelechi11/noitca"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-neutral-800 transition-all"
                  >
                    <FaGithub className="w-3.5 h-3.5" />
                    <span>View Repository</span>
                  </a>
                </div>
              </div>

              {/* Terminal Preview Card */}
              <div className="w-full md:w-auto flex-1 bg-black rounded-2xl border border-neutral-800 p-5 font-mono text-xs text-neutral-300 shadow-2xl">
                <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-neutral-900 text-neutral-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] text-neutral-400 ml-2">bash ~ local terminal</span>
                </div>

                <div className="text-neutral-500">$ noitca start</div>
                <div className="text-yellow-400 font-bold my-1 text-[10px] sm:text-xs leading-none sm:leading-tight">
                  ███╗&nbsp;&nbsp;&nbsp;██╗ ██████╗ ██╗████████╗ ██████╗  █████╗<br/>
                  ████╗&nbsp;&nbsp;██║██╔═══██╗██║╚══██╔══╝██╔════╝ ██╔══██╗<br/>
                  ██╔██╗&nbsp;██║██║&nbsp;&nbsp;&nbsp;██║██║&nbsp;&nbsp;&nbsp;██║&nbsp;&nbsp;&nbsp;██║&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;███████║<br/>
                  ██║╚██╗██║██║&nbsp;&nbsp;&nbsp;██║██║&nbsp;&nbsp;&nbsp;██║&nbsp;&nbsp;&nbsp;██║&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;██╔══██║<br/>
                  ██║&nbsp;╚████║╚██████╔╝██║&nbsp;&nbsp;&nbsp;██║&nbsp;&nbsp;&nbsp;╚██████╗██║&nbsp;&nbsp;██║<br/>
                  ╚═╝&nbsp;&nbsp;╚═══╝&nbsp;╚═════╝&nbsp;╚═╝&nbsp;&nbsp;&nbsp;╚═╝&nbsp;&nbsp;&nbsp;&nbsp;╚═════╝╚═╝&nbsp;&nbsp;╚═╝
                </div>
                <div className="text-emerald-400 mt-2">⚡ noitca is live at:</div>
                <div className="text-neutral-300">➜ Local:   <span className="text-yellow-400 underline">http://localhost:5173/</span></div>
                <div className="text-neutral-300">➜ Network: <span className="text-yellow-400 underline">http://192.168.1.120:5173/</span></div>
                
                <div className="text-neutral-500 mt-3 pt-3 border-t border-neutral-900">$ noitca status</div>
                <div className="text-neutral-400">▸ Engine: Online • Production Build: Ready (dist)</div>
                
                <div className="text-neutral-500 mt-1">$ noitca update -status</div>
                <div className="text-yellow-300">▸ Repo: Up to date (v0.1.0-alpha)</div>
              </div>
            </div>
          </div>
        </section>

        {/* FLOW CONNECTOR 5 -> 6 */}
        <FlowConnector 
          fromStage="STAGE 05" 
          toStage="STAGE 06" 
          label="Daemon Verified ➔ Production Pipeline Complete" 
        />

        {/* =========================================================================
            STAGE 06: PRODUCTION PIPELINE READY // LAUNCH STUDIO CTA
           ========================================================================= */}
        <section id="launch" className="relative group mb-12">
          <div className="relative rounded-3xl bg-gradient-to-b from-neutral-950 to-black border-2 border-yellow-400/50 hover:border-yellow-400 transition-all duration-300 p-8 sm:p-14 shadow-2xl text-center flex flex-col items-center">
            
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-[11px] font-mono text-yellow-400 mb-6">
              <HiCheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>STAGE 06 // PRODUCTION PIPELINE VERIFIED</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white max-w-3xl">
              Ready to construct your next CI/CD pipeline visually?
            </h2>

            <p className="mt-4 text-neutral-400 max-w-xl text-sm sm:text-base leading-relaxed">
              Launch directly in your browser or self-host on your personal machine in seconds. Zero registration, no subscription fees, 100% open source.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={onLaunchEditor}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-yellow-400 hover:bg-yellow-300 text-black text-base font-extrabold px-8 py-3.5 rounded-xl shadow-xl shadow-yellow-500/30 transition-all transform active:scale-95 cursor-pointer"
              >
                <span>Launch Studio Now</span>
                <HiArrowRight className="w-5 h-5" />
              </button>

              <a
                href="https://github.com/ronaldkelechi11/noitca"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold px-6 py-3.5 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-all"
              >
                <FaGithub className="w-4 h-4" />
                <span>Fork on GitHub</span>
              </a>
            </div>

            <div className="mt-8 flex items-center space-x-6 text-xs text-neutral-500 font-mono">
              <span>MIT Licensed</span>
              <span>•</span>
              <span>100% Client-Side Safe</span>
              <span>•</span>
              <span>Pure Black UI</span>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-10 px-6 sm:px-8 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="noitca logo" className="h-5 w-auto object-contain" />
            <span className="font-bold text-white">noitca</span>
            <span>— Open-source visual DevOps pipeline studio.</span>
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={onLaunchEditor}
              className="text-yellow-400 hover:underline cursor-pointer font-medium"
            >
              Open Studio
            </button>
            <a href="https://github.com/ronaldkelechi11/noitca" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              GitHub
            </a>
            <span>MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

