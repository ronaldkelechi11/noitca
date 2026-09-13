# Contributing to noitca

First off, thank you for considering contributing to **noitca**! 🎉 It's people like you that make noitca a premier local-first visual DevOps tool for developers worldwide.

---

## Code of Conduct

By participating in this project, you agree to maintain a respectful, welcoming, and harassment-free environment for everyone, regardless of background or experience level.

---

## How Can I Contribute?

### 1. Reporting Bugs
- Ensure the bug was not already reported by searching on [GitHub Issues](https://github.com/ronaldkelechi11/noitca/issues).
- If you're unable to find an open issue addressing the problem, open a new one.
- Include a clear title and description, steps to reproduce, relevant YAML or workflow configs, and browser/OS versions.

### 2. Suggesting Enhancements & New Actions
- Open a feature request on [GitHub Issues](https://github.com/ronaldkelechi11/noitca/issues).
- Detail why the enhancement would be valuable to other DevOps engineers and developers.
- If suggesting a new GitHub Action node, provide the official GitHub Action URL (e.g. `actions/checkout@v4`) and default parameters.

### 3. Submitting Pull Requests
- Fork the repo and create your branch from `main`:
  ```bash
  git checkout -b feature/amazing-action
  ```
- Make your changes, adhering to the coding standards below.
- Verify your changes build cleanly:
  ```bash
  npm run build
  ```
- Test the CLI daemon status:
  ```bash
  ./bin/noitca.js status
  ```
- Commit your changes with a descriptive message:
  ```bash
  git commit -m "feat(catalog): add terraform deployment action"
  ```
- Push to your fork and submit a Pull Request to `ronaldkelechi11/noitca:main`.

---

## Development Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ronaldkelechi11/noitca.git
   cd noitca
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Production Build & Verification**:
   ```bash
   npm run build
   ```

5. **Test CLI Daemon**:
   ```bash
   ./bin/noitca.js status
   ./bin/noitca.js start
   ```

---

## Guide: How to Add a New Action to the Catalog

Adding a new workflow action or step to noitca is straightforward across these modular layers:

1. **Register Action Type (`src/types/workflow.ts`)**:
   Add the action type identifier to `ActionType` (e.g. `'terraform_apply'`):
   ```ts
   export type ActionType = 
     | ...
     | 'terraform_apply';
   ```
   And add any custom configuration properties to `NodeConfig`.

2. **Define Template & Metadata (`src/utils/defaultWorkflow.ts`)**:
   Add the action template to `NODE_TEMPLATES` under the appropriate category (`Repository`, `Git`, `Artifacts`, `Build & Test`, `Cloud & Deploy`, or `Notifications`):
   ```ts
   {
     type: 'terraform_apply',
     category: 'Cloud & Deploy',
     title: 'Terraform Apply',
     subtitle: 'hashicorp/setup-terraform',
     description: 'Provisions cloud infrastructure via Terraform',
     icon: 'FaCloud',
     defaultConfig: { tfVersion: '1.5.0', autoApprove: true },
   }
   ```

3. **Wire YAML Compiler (`src/utils/yamlCompiler.ts`)**:
   Add the YAML step generation logic in `compileWorkflowToYaml`:
   ```ts
   case 'terraform_apply':
     yaml += `      - name: Terraform Apply\n`;
     yaml += `        uses: hashicorp/setup-terraform@v3\n`;
     yaml += `        with:\n`;
     yaml += `          terraform_version: ${step.config.tfVersion || '1.5.0'}\n`;
     break;
   ```

4. **Add Inspector Controls (`src/components/NodeInspector.tsx`)**:
   Render reactive input fields so users can edit the action's specific parameters.

5. **Update Bidirectional Parser (`src/utils/yamlParser.ts`)**:
   Detect the action in incoming YAML files so imported workflows automatically map to your new node.

---

## Code Style & Architecture Guidelines

- **TypeScript**: Strict types throughout. Avoid `any`.
- **Styling**: Pure-black palette (`#000000`, `bg-neutral-950`, `border-neutral-800`) with yellow accents (`text-yellow-400`, `border-yellow-400/50`).
- **Icons**: Exclusively use `@heroicons/react` (`react-icons/hi2`) and `react-icons/fa6`. Avoid introducing additional heavy icon packages.
- **Local-First**: All computations, graph analysis, and YAML generation must happen completely on the client side with 0 telemetry or third-party cloud dependence.

---

## Community

- **Discussions**: [GitHub Discussions](https://github.com/ronaldkelechi11/noitca/discussions)
- **Issues & Bug Reports**: [GitHub Issues](https://github.com/ronaldkelechi11/noitca/issues)
- **Author**: Ronald Kelechi ([@ronaldkelechi11](https://github.com/ronaldkelechi11))

Thank you for helping make **noitca** better!
