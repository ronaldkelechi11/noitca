import { load } from 'js-yaml';
import { WorkflowNode, NodeConnection, FlowOrientation } from '../types/workflow';

export interface ParsedYamlResult {
  workflowName: string;
  nodes: WorkflowNode[];
  connections: NodeConnection[];
}

export function parseYamlToWorkflow(yamlText: string, orientation: FlowOrientation = 'vertical'): ParsedYamlResult {
  const doc = load(yamlText) as any;

  if (!doc || typeof doc !== 'object') {
    throw new Error('Invalid YAML content. Please provide a valid GitHub Actions workflow YAML file.');
  }

  const workflowName = doc.name || 'Imported Workflow';
  const nodes: WorkflowNode[] = [];
  const connections: NodeConnection[] = [];

  let stepIndex = 0;

  const getPosition = (index: number) => {
    if (orientation === 'vertical') {
      return { x: 100, y: 80 + index * 160 };
    } else {
      return { x: 80 + index * 360, y: 150 };
    }
  };

  // 1. Parse Triggers (`on:`)
  const onSection = doc.on || doc.ON;
  if (onSection) {
    if (typeof onSection === 'string') {
      if (onSection === 'push') {
        const pos = getPosition(stepIndex++);
        nodes.push({
          id: `node-${Date.now()}-${nodes.length}`,
          type: 'trigger_push',
          title: 'Push Event',
          subtitle: 'Branch: main',
          category: 'Triggers',
          x: pos.x,
          y: pos.y,
          iconType: 'push',
          badge: 'TRIGGER',
          badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
          config: { branch: 'main' },
        });
      } else if (onSection === 'pull_request') {
        const pos = getPosition(stepIndex++);
        nodes.push({
          id: `node-${Date.now()}-${nodes.length}`,
          type: 'trigger_pr',
          title: 'Pull Request',
          subtitle: 'Branch: main',
          category: 'Triggers',
          x: pos.x,
          y: pos.y,
          iconType: 'pr',
          badge: 'TRIGGER',
          badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
          config: { branch: 'main' },
        });
      }
    } else if (typeof onSection === 'object') {
      if (onSection.push) {
        const branch = onSection.push.branches ? (Array.isArray(onSection.push.branches) ? onSection.push.branches[0] : onSection.push.branches) : 'main';
        const pos = getPosition(stepIndex++);
        nodes.push({
          id: `node-${Date.now()}-${nodes.length}`,
          type: 'trigger_push',
          title: 'Push Event',
          subtitle: `Branch: ${branch}`,
          category: 'Triggers',
          x: pos.x,
          y: pos.y,
          iconType: 'push',
          badge: 'TRIGGER',
          badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
          config: { branch },
        });
      }

      if (onSection.pull_request) {
        const branch = onSection.pull_request.branches ? (Array.isArray(onSection.pull_request.branches) ? onSection.pull_request.branches[0] : onSection.pull_request.branches) : 'main';
        const pos = getPosition(stepIndex++);
        nodes.push({
          id: `node-${Date.now()}-${nodes.length}`,
          type: 'trigger_pr',
          title: 'Pull Request',
          subtitle: `Branch: ${branch}`,
          category: 'Triggers',
          x: pos.x,
          y: pos.y,
          iconType: 'pr',
          badge: 'TRIGGER',
          badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
          config: { branch },
        });
      }

      if (onSection.workflow_dispatch !== undefined) {
        const pos = getPosition(stepIndex++);
        nodes.push({
          id: `node-${Date.now()}-${nodes.length}`,
          type: 'trigger_manual',
          title: 'Manual Dispatch',
          subtitle: 'workflow_dispatch',
          category: 'Triggers',
          x: pos.x,
          y: pos.y,
          iconType: 'manual',
          badge: 'TRIGGER',
          badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
          config: {},
        });
      }

      if (onSection.schedule) {
        const cron = Array.isArray(onSection.schedule) ? (onSection.schedule[0]?.cron || '0 0 * * *') : '0 0 * * *';
        const pos = getPosition(stepIndex++);
        nodes.push({
          id: `node-${Date.now()}-${nodes.length}`,
          type: 'trigger_cron',
          title: 'Schedule / Cron',
          subtitle: `cron: ${cron}`,
          category: 'Triggers',
          x: pos.x,
          y: pos.y,
          iconType: 'cron',
          badge: 'TRIGGER',
          badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
          config: { cron },
        });
      }
    }
  }

  // Fallback trigger if no trigger specified
  if (nodes.length === 0) {
    const pos = getPosition(stepIndex++);
    nodes.push({
      id: `node-${Date.now()}-${nodes.length}`,
      type: 'trigger_push',
      title: 'Push Event',
      subtitle: 'Branch: main',
      category: 'Triggers',
      x: pos.x,
      y: pos.y,
      iconType: 'push',
      badge: 'TRIGGER',
      badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      config: { branch: 'main' },
    });
  }

  // 2. Parse Jobs & Steps
  const jobs = doc.jobs || {};
  for (const jobKey of Object.keys(jobs)) {
    const job = jobs[jobKey];
    if (!job || !Array.isArray(job.steps)) continue;

    for (const step of job.steps) {
      const pos = getPosition(stepIndex++);
      const name = step.name || 'Step';
      const uses = step.uses || '';
      const run = step.run || '';
      const withConfig = step.with || {};
      const condition = step.if || '';

      if (uses.includes('actions/checkout')) {
        nodes.push({
          id: `node-${Date.now()}-${nodes.length}`,
          type: 'repo_checkout',
          title: name || 'Checkout Repository',
          subtitle: 'actions/checkout@v4',
          category: 'Repository',
          x: pos.x,
          y: pos.y,
          iconType: 'checkout',
          badge: 'REPO',
          badgeColor: 'bg-neutral-800 text-yellow-300 border-neutral-700',
          config: { repository: 'self', condition },
        });
      } else if (uses.includes('actions/setup-node')) {
        const ver = withConfig['node-version'] || '22';
        nodes.push({
          id: `node-${Date.now()}-${nodes.length}`,
          type: 'env_setup_node',
          title: name || 'Setup Node.js',
          subtitle: `Version: ${ver}`,
          category: 'Environment',
          x: pos.x,
          y: pos.y,
          iconType: 'node',
          badge: 'ENV',
          badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          config: { runtimeVersion: String(ver), condition },
        });
      } else if (uses.includes('actions/setup-python')) {
        const ver = withConfig['python-version'] || '3.12';
        nodes.push({
          id: `node-${Date.now()}-${nodes.length}`,
          type: 'env_setup_python',
          title: name || 'Setup Python',
          subtitle: `Version: ${ver}`,
          category: 'Environment',
          x: pos.x,
          y: pos.y,
          iconType: 'python',
          badge: 'ENV',
          badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          config: { runtimeVersion: String(ver), condition },
        });
      } else if (uses.includes('actions/setup-go')) {
        const ver = withConfig['go-version'] || '1.23';
        nodes.push({
          id: `node-${Date.now()}-${nodes.length}`,
          type: 'env_setup_go',
          title: name || 'Setup Go',
          subtitle: `Version: ${ver}`,
          category: 'Environment',
          x: pos.x,
          y: pos.y,
          iconType: 'go',
          badge: 'ENV',
          badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          config: { runtimeVersion: String(ver), condition },
        });
      } else if (uses.includes('docker/setup-buildx-action')) {
        nodes.push({
          id: `node-${Date.now()}-${nodes.length}`,
          type: 'env_setup_docker',
          title: name || 'Setup Docker Buildx',
          subtitle: 'docker/setup-buildx-action@v3',
          category: 'Environment',
          x: pos.x,
          y: pos.y,
          iconType: 'setup_docker',
          badge: 'ENV',
          badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          config: { condition },
        });
      } else if (uses.includes('actions/upload-artifact')) {
        nodes.push({
          id: `node-${Date.now()}-${nodes.length}`,
          type: 'artifact_upload',
          title: name || 'Upload Artifact',
          subtitle: `Artifact: ${withConfig.name || 'build-assets'}`,
          category: 'Artifacts',
          x: pos.x,
          y: pos.y,
          iconType: 'artifact_upload',
          badge: 'ARTIFACT',
          badgeColor: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30',
          config: { artifactName: withConfig.name || 'build-assets', artifactPath: withConfig.path || './dist', retentionDays: withConfig['retention-days'] || 14, condition },
        });
      } else if (uses.includes('actions/download-artifact')) {
        nodes.push({
          id: `node-${Date.now()}-${nodes.length}`,
          type: 'artifact_download',
          title: name || 'Download Artifact',
          subtitle: `Artifact: ${withConfig.name || 'build-assets'}`,
          category: 'Artifacts',
          x: pos.x,
          y: pos.y,
          iconType: 'artifact_download',
          badge: 'ARTIFACT',
          badgeColor: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30',
          config: { artifactName: withConfig.name || 'build-assets', destinationPath: withConfig.path || './dist', condition },
        });
      } else if (uses.includes('action-gh-release')) {
        nodes.push({
          id: `node-${Date.now()}-${nodes.length}`,
          type: 'git_release',
          title: name || 'Create GitHub Release',
          subtitle: `Release ${withConfig.tag_name || 'v1.0.0'}`,
          category: 'Git',
          x: pos.x,
          y: pos.y,
          iconType: 'git_release',
          badge: 'RELEASE',
          badgeColor: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/40',
          config: { tagName: withConfig.tag_name || 'v1.0.0', releaseName: withConfig.name || 'Release v1.0.0', condition },
        });
      } else if (uses.includes('docker/login-action')) {
        nodes.push({
          id: `node-${Date.now()}-${nodes.length}`,
          type: 'docker_login',
          title: name || 'Docker Login',
          subtitle: `Registry: ${withConfig.registry || 'docker.io'}`,
          category: 'Docker',
          x: pos.x,
          y: pos.y,
          iconType: 'docker_login',
          badge: 'DOCKER',
          badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
          config: { registry: withConfig.registry || 'docker.io', username: withConfig.username || '${{ secrets.DOCKER_USERNAME }}', condition },
        });
      } else if (uses.includes('appleboy/ssh-action')) {
        nodes.push({
          id: `node-${Date.now()}-${nodes.length}`,
          type: 'deploy_ssh',
          title: name || 'Deploy via SSH',
          subtitle: withConfig.script ? 'SSH Script Execution' : 'docker compose up -d',
          category: 'Deployment',
          x: pos.x,
          y: pos.y,
          iconType: 'deploy_ssh',
          badge: 'DEPLOY',
          badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
          config: {
            sshHost: withConfig.host || 'production.example.com',
            sshUser: withConfig.username || 'deploy',
            sshPort: withConfig.port || 22,
            command: withConfig.script || 'docker compose up -d',
            condition,
          },
        });
      } else if (uses.includes('slackapi/slack-github-action')) {
        nodes.push({
          id: `node-${Date.now()}-${nodes.length}`,
          type: 'notify_slack',
          title: name || 'Slack Notification',
          subtitle: 'Post alert to Slack channel',
          category: 'Notifications',
          x: pos.x,
          y: pos.y,
          iconType: 'slack',
          badge: 'NOTIFY',
          badgeColor: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/40',
          config: { condition },
        });
      } else if (run) {
        const runLower = run.toLowerCase();
        if (runLower.includes('npm test') || runLower.includes('pytest') || runLower.includes('go test')) {
          nodes.push({
            id: `node-${Date.now()}-${nodes.length}`,
            type: 'quality_test',
            title: name || 'Run Tests',
            subtitle: run.trim().split('\n')[0],
            category: 'Quality',
            x: pos.x,
            y: pos.y,
            iconType: 'test',
            badge: 'TEST',
            badgeColor: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
            config: { command: run, condition },
          });
        } else if (runLower.includes('npm run build') || runLower.includes('docker build') || runLower.includes('flutter build')) {
          nodes.push({
            id: `node-${Date.now()}-${nodes.length}`,
            type: 'quality_build',
            title: name || 'Build Project',
            subtitle: run.trim().split('\n')[0],
            category: 'Quality',
            x: pos.x,
            y: pos.y,
            iconType: 'build',
            badge: 'BUILD',
            badgeColor: 'bg-yellow-400/15 text-yellow-300 border-yellow-400/40',
            config: { command: run, condition },
          });
        } else if (runLower.includes('lint') || runLower.includes('eslint')) {
          nodes.push({
            id: `node-${Date.now()}-${nodes.length}`,
            type: 'quality_lint',
            title: name || 'Run Linter',
            subtitle: run.trim().split('\n')[0],
            category: 'Quality',
            x: pos.x,
            y: pos.y,
            iconType: 'lint',
            badge: 'LINT',
            badgeColor: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
            config: { command: run, condition },
          });
        } else if (runLower.includes('curl') || runLower.includes('health')) {
          nodes.push({
            id: `node-${Date.now()}-${nodes.length}`,
            type: 'verify_health',
            title: name || 'HTTP Health Check',
            subtitle: 'Expected status: 200',
            category: 'Verification',
            x: pos.x,
            y: pos.y,
            iconType: 'health',
            badge: 'VERIFY',
            badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
            config: { healthUrl: 'https://api.example.com/health', expectedStatus: 200, condition },
          });
        } else if (runLower.includes('docker push')) {
          nodes.push({
            id: `node-${Date.now()}-${nodes.length}`,
            type: 'docker_push',
            title: name || 'Push Image',
            subtitle: run.trim().split('\n')[0],
            category: 'Docker',
            x: pos.x,
            y: pos.y,
            iconType: 'docker_push',
            badge: 'DOCKER',
            badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
            config: { dockerImage: 'myapp', dockerTag: 'latest', condition },
          });
        } else {
          nodes.push({
            id: `node-${Date.now()}-${nodes.length}`,
            type: 'cmd_run',
            title: name || 'Run Command',
            subtitle: run.trim().split('\n')[0],
            category: 'Commands',
            x: pos.x,
            y: pos.y,
            iconType: 'terminal',
            badge: 'CMD',
            badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
            config: { command: run, condition },
          });
        }
      } else {
        nodes.push({
          id: `node-${Date.now()}-${nodes.length}`,
          type: 'cmd_run',
          title: name || 'Custom Action Step',
          subtitle: uses || 'Custom step',
          category: 'Commands',
          x: pos.x,
          y: pos.y,
          iconType: 'terminal',
          badge: 'CMD',
          badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
          config: { condition },
        });
      }
    }
  }

  // 3. Connect nodes sequentially
  for (let i = 0; i < nodes.length - 1; i++) {
    connections.push({
      id: `conn-${Date.now()}-${i}`,
      fromNodeId: nodes[i].id,
      toNodeId: nodes[i + 1].id,
    });
  }

  return {
    workflowName,
    nodes,
    connections,
  };
}
