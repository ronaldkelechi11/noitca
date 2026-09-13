<div align="center">

```
  ███╗   ██╗ ██████╗ ██╗████████╗ ██████╗  █████╗ 
  ████╗  ██║██╔═══██╗██║╚══██╔══╝██╔════╝ ██╔══██╗
  ██╔██╗ ██║██║   ██║██║   ██║   ██║     ███████║
  ██║╚██╗██║██║   ██║██║   ██║   ██║     ██╔══██║
  ██║ ╚████║╚██████╔╝██║   ██║   ╚██████╗██║  ██║
  ╚═╝  ╚═══╝ ╚═════╝ ╚═╝   ╚═╝    ╚═════╝╚═╝  ╚═╝
```

# noitca

**The Local-First, High-Performance Visual DevOps Pipeline Studio.**  
*Construct, visualize, inspect, and export GitHub Actions workflows without the YAML fatigue.*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-0.1.0--alpha-yellow.svg)](https://github.com/ronaldkelechi11/noitca/releases)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-black.svg?style=flat&logo=node.js&colorA=111111&colorB=eab308)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Repo](https://img.shields.io/badge/GitHub-ronaldkelechi11%2Fnoitca-black?logo=github)](https://github.com/ronaldkelechi11/noitca)

[Live Demo](#) • [Features](#key-features) • [How It Works](#how-it-works) • [Quick Start](#quick-start) • [Action Catalog](#curated-action-catalog) • [CLI Reference](#cli-command-reference) • [Contributing](#contributing) • [Sponsors](#sponsors)

</div>

---

## ⚡ What is noitca?

Writing GitHub Actions YAML by hand often means wrestling with indentation bugs, hunting down parameter names across scattered documentation, and enduring painful commit-and-push debugging loops.

**noitca** reverses that equation. It is an open-source, local-first visual workflow studio and terminal CLI daemon that lets you construct production-grade CI/CD pipelines on an infinite pure-black tactile canvas. Connect triggers, repository actions, test suites, Docker builders, artifact uploaders, and team notifications visually, and export clean, syntax-validated `.github/workflows/*.yml` in seconds.

- **100% Local-First & Private**: No cloud accounts, no subscriptions, no data transmitted to third-party servers. All pipeline configurations live locally on your filesystem.
- **Bi-directional YAML Compiler**: Import existing legacy YAML files to instantly render their node graphs, or export your diagram back to official GitHub Actions workflows.
- **Self-Hosted CLI Daemon**: Run with a single zero-install command (`npx noitca start`) or install globally on macOS, Linux, or Windows.

---

## 🚀 Key Features

- **Infinite Gridlines Canvas**: Fluid 2-finger panning, touchpad pinch-to-zoom (20% – 250%), quick auto-centering (`C`), and dynamic vertical/horizontal pipeline alignment.
- **Bi-Directional YAML Synchronization**: Fully compliant with GitHub Actions workflow specifications, supporting jobs, triggers (`on.push`, `on.pull_request`, `on.schedule`, `on.workflow_dispatch`), and step dependencies.
- **Curated DevOps Catalog**: Over 30+ production action templates spanning Core Repository checkout/clone, Git commits & releases, Artifact lifecycle management, Docker build & push, Node/Python/Go/Rust toolchains, and Slack/Discord/Matrix notifications.
- **Node Parameter Inspector**: Real-time parameter inputs, branch pickers, environment variable bindings, and secrets syntax (`${{ secrets.GITHUB_TOKEN }}`).
- **Undo / Redo & Clipboard Stack**: Complete non-destructive history stack (`⌘Z` / `⌘Y`), node duplication (`⌘D`), and multi-node copy-pasting (`⌘C` / `⌘V`).
- **Terminal CLI Daemon**: Interactive CLI binary featuring ASCII banners, status health monitoring (`noitca status`), and repository update tracking (`noitca update -status`).

---

## 🛠️ How It Works

```
 ┌──────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
 │   STAGE 01: INGRESS  │ ───> │  STAGE 02: VISUAL GRAPH │ ───> │ STAGE 03: ARCHITECTURE  │
 │  Triggers & Webhooks │      │ Topology & Connections  │      │ Local-First AST Engine  │
 └──────────────────────┘      └─────────────────────────┘      └─────────────────────────┘
                                                                             │
                                                                             ▼
 ┌──────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
 │ STAGE 06: PRODUCTION │ <─── │   STAGE 05: CLI RUNTIME │ <─── │  STAGE 04: ACTION SUITE │
 │ Export Validated YAML│      │ Local Daemon / LAN Port │      │  Repo, Git & Artifacts  │
 └──────────────────────┘      └─────────────────────────┘      └─────────────────────────┘
```

1. **Pipeline Ingress (Triggers)**:
   Every workflow begins with an entrypoint trigger node (`Push & Commit`, `Pull Request`, `Cron Schedule`, or `Manual Dispatch`). Configure branch filters (e.g. `main`, `staging`) and path triggers.

2. **Visual Topology & Connection Cables**:
   Drag action blocks from the categorized Action Palette onto the infinite grid canvas. Link nodes together via output-to-input connection ports to establish step execution order.

3. **Live Node Inspection**:
   Clicking any node opens the reactive Parameter Inspector. Adjust action-specific attributes (e.g. `fetch-depth`, `retention-days`, `node-version`, `docker-tags`) with immediate visual feedback.

4. **Bi-directional AST Compilation**:
   The built-in parser and compiler translate the visual graph into standard GitHub Actions YAML and vice-versa, with syntax highlighting, one-click copy, and `.yml` download.

5. **Self-Hosted Execution**:
   The lightweight CLI daemon serves the studio locally on `localhost:5173` and displays your LAN address so team members on the same network can collaborate in real time.

---

## ⚡ Quick Start & Installation

### Option 1: Zero-Install Instant Run (No install required)
Run noitca directly in your terminal with `npx`:
```bash
npx noitca start
```

### Option 2: Global Installation (Recommended)
Install the `noitca` CLI globally on your machine:
```bash
# Using npm
npm install -g noitca

# Using pnpm
pnpm add -g noitca

# Using yarn
yarn global add noitca
```

### Option 3: From Source (For Contributors & Hackers)
```bash
git clone https://github.com/ronaldkelechi11/noitca.git
cd noitca
npm install
npm run build
npm start
```

---

## 💻 CLI Command Reference

The `noitca` binary provides essential local lifecycle commands:

| Command | Description |
| :--- | :--- |
| `noitca start` | Displays the ASCII banner, verifies production build assets, and boots the local web studio on `localhost` and your LAN IP. |
| `noitca status` | Runs an engine health check, inspecting Node version, host address, build output readiness, and dependency health. |
| `noitca update -status` | Checks if your local version is up-to-date with the latest release on GitHub. |
| `noitca help` | Displays the command menu, parameter documentation, and quickstart examples. |

```bash
$ noitca status
=== noitca System Status ===
▸ Node Version:     v22.14.0
▸ Platform:         darwin (x64)
▸ Host Address:     192.168.1.120
▸ Production Build: ✅ Ready in /dist
▸ Version:          0.1.0
▸ Engine Status:    ONLINE & HEALTHY - Ready to run `noitca start`
```

---

## 📦 Curated Action Catalog

noitca ships with a comprehensive library of pre-configured action templates:

### 1. 📂 Core Repository Operations (`Repository`)
- **Checkout Repository**: `actions/checkout@v4` with `fetch-depth`, submodules, and LFS support.
- **Clone External Repo**: Authenticated `git clone` with target directories and branch checkout.
- **Fetch Changes**: `git fetch --all --tags --prune`.
- **Checkout Branch**: Switch or create target branches (`git checkout -B`).
- **Checkout Commit**: Pin execution to a specific Git commit SHA.

### 2. 🔀 Git Operations (`Git`)
- **Commit Changes**: Automated git commits with configurable author and file patterns.
- **Push Changes**: Force-push controls, tags publishing, and branch upstreams.
- **Create Semantic Tag**: Annotated tag creation (`git tag -a v1.0.0`).
- **Merge Branch**: Fast-forward, squash, or `--no-ff` merge workflows.
- **GitHub Release**: `softprops/action-gh-release@v2` with automated release notes and draft flags.

### 3. 📥 Artifacts Lifecycle (`Artifacts`)
- **Upload Artifact**: `actions/upload-artifact@v4` with custom retention policies (1–90 days).
- **Download Artifact**: `actions/download-artifact@v4` with destination path mappings.
- **Upload Build Output**: Specialized packaging for `dist/` or `build/` bundles.
- **Test Results Reporter**: `dorny/test-reporter@v1` for JUnit, Jest, and xUnit outputs.
- **Code Coverage**: `codecov/codecov-action@v4` with LCOV and Cobertura integration.
- **Download Previous Build**: Restore artifacts from upstream or prior pipeline runs.

### 4. ⚙️ Build, Test & Runtime (`Build & Test`)
- **Node.js**: `actions/setup-node@v4` with package caching (`npm`, `pnpm`, `yarn`).
- **Docker**: `docker/build-push-action@v5` with multi-platform builds.
- **Python**: `actions/setup-python@v5` with pip caching and pytest.
- **Go Toolchain**: `actions/setup-go@v5` with go module caching.
- **Rust Toolchain**: `dtolnay/rust-toolchain@stable` with cargo test and clippy.

### 5. 🔔 Cloud & Notifications (`Notifications & Deploy`)
- **Slack / Discord / Matrix**: Instant deploy status webhook alerts with job condition checks.
- **AWS S3 Deploy**: Sync static bundles to AWS S3 buckets.
- **SonarCloud**: Continuous code quality and security scan gate.

---

## ⌨️ Keyboard Shortcuts & Gestures

| Keybinding | Action |
| :--- | :--- |
| `⌘Z` / `Ctrl+Z` | Undo last action |
| `⌘Y` / `Ctrl+Shift+Z` | Redo action |
| `⌘C` / `Ctrl+C` | Copy selected node |
| `⌘V` / `Ctrl+V` | Paste copied node |
| `⌘D` / `Ctrl+D` | Duplicate selected node |
| `Backspace` / `Delete` | Delete selected node |
| `C` | Recenter canvas to workflow bounds |
| `F` | Toggle fullscreen mode |
| `B` | Toggle sidebar Action Palette |
| `Two-Finger Scroll` | Pan across infinite canvas |
| `Pinch / Trackpad Zoom` | Smooth zoom in / zoom out (20% – 250%) |

---

## 🏗️ Architecture & Tech Stack

noitca is engineered with a modular, zero-dependency client architecture:

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with pure-black tactile design system
- **YAML Engine**: [js-yaml](https://github.com/nodeca/js-yaml) for compliant GitHub Actions AST compilation
- **Icons**: [`@heroicons/react`](https://heroicons.com/) and [`react-icons/fa6`](https://react-icons.github.io/react-icons/)
- **CLI Runtime**: Node.js executable daemon (`bin/noitca.js`) with zero external native dependencies

---

## 👥 Community & Discussions

Join the conversation, ask questions, share workflows, and connect with other developers:

- **GitHub Discussions**: [Ask questions & share workflows](https://github.com/ronaldkelechi11/noitca/discussions)
- **Issue Tracker**: [Report bugs or request features](https://github.com/ronaldkelechi11/noitca/issues)
- **GitHub Repository**: [https://github.com/ronaldkelechi11/noitca](https://github.com/ronaldkelechi11/noitca)

---

## 🤝 Contributing

We welcome contributions of all kinds! Whether you are fixing a typo, adding support for a new GitHub Action node, or enhancing canvas performance:

1. Read the [Contributing Guidelines](CONTRIBUTING.md) for full instructions and code conventions.
2. Fork the repository: [https://github.com/ronaldkelechi11/noitca](https://github.com/ronaldkelechi11/noitca).
3. Create your feature branch (`git checkout -b feat/my-action`).
4. Commit your changes (`git commit -m 'feat: add new action template'`).
5. Push to the branch (`git push origin feat/my-action`).
6. Open a Pull Request!

---

## 💖 Sponsors & Backing

noitca is an independent open-source project built with passion for developer ergonomics. If noitca saves you or your company time writing CI/CD workflows, please consider supporting ongoing development:

- **GitHub Sponsors**: [Sponsor @ronaldkelechi11](https://github.com/sponsors/ronaldkelechi11)
- **Corporate Sponsorship**: If your organization uses noitca to accelerate DevOps workflows and would like priority feature requests or custom integrations, please reach out via GitHub.

*A huge thank you to all past and present backers supporting open-source developer tooling!*

---

## 🌟 Contributors

Thanks to all the amazing people who have contributed to noitca!

<a href="https://github.com/ronaldkelechi11/noitca/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ronaldkelechi11/noitca" alt="Contributors" />
</a>

*Made with ❤️ by [Ronald Kelechi](https://github.com/ronaldkelechi11) and contributors.*

---

## 📄 License

This project is open source and licensed under the terms of the [MIT License](LICENSE).  
Copyright (c) 2026 Ronald Kelechi and noitca contributors.
