import { WorkflowNode, NodeConnection } from '../types/workflow';

export interface WorkflowRunStep {
  id: string;
  nodeId?: string;
  title: string;
  type: string;
  category: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  durationMs: number;
  logs: string[];
}

/**
 * Topologically sorts workflow nodes based on connections.
 * If nodes have no connections, falls back to canvas order.
 */
export function resolveExecutionOrder(
  nodes: WorkflowNode[],
  connections: NodeConnection[]
): WorkflowNode[] {
  if (nodes.length === 0) return [];

  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  nodes.forEach(n => {
    inDegree.set(n.id, 0);
    adj.set(n.id, []);
  });

  connections.forEach(c => {
    if (inDegree.has(c.toNodeId)) {
      inDegree.set(c.toNodeId, (inDegree.get(c.toNodeId) || 0) + 1);
    }
    if (adj.has(c.fromNodeId)) {
      adj.get(c.fromNodeId)!.push(c.toNodeId);
    }
  });

  // Start with nodes that have 0 in-degree (typically triggers or entrypoints)
  const queue: string[] = [];
  nodes.forEach(n => {
    if ((inDegree.get(n.id) || 0) === 0) {
      queue.push(n.id);
    }
  });

  const orderedNodeIds: string[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    orderedNodeIds.push(u);

    const neighbors = adj.get(u) || [];
    for (const v of neighbors) {
      const updatedDegree = (inDegree.get(v) || 0) - 1;
      inDegree.set(v, updatedDegree);
      if (updatedDegree === 0) {
        queue.push(v);
      }
    }
  }

  // Include any remaining nodes that weren't captured by topological order (e.g. disconnected nodes)
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const orderedNodes: WorkflowNode[] = [];

  orderedNodeIds.forEach(id => {
    const n = nodeMap.get(id);
    if (n) {
      orderedNodes.push(n);
      nodeMap.delete(id);
    }
  });

  // Append remaining disconnected nodes
  nodeMap.forEach(n => orderedNodes.push(n));

  return orderedNodes;
}

/**
 * Generates realistic GitHub Actions console logs for a specific workflow node
 */
export function generateStepLogs(node: WorkflowNode, index: number): string[] {
  const ts = () => new Date().toISOString();
  const cfg = node.config || {};
  const logs: string[] = [];

  logs.push(`[${ts()}] ##[group]Run ${node.title}`);
  logs.push(`[${ts()}] [command] Evaluating step ${index + 1}: ${node.type}`);

  switch (node.type) {
    case 'trigger_push':
    case 'trigger_commit':
      logs.push(`[${ts()}] Received webhook event: push`);
      logs.push(`[${ts()}] Ref: refs/heads/${cfg.branch || 'main'}`);
      logs.push(`[${ts()}] Commit: 49af90f90c82545e11a95298422680e3b631e4c0`);
      logs.push(`[${ts()}] Author: DevOps Engineer <devops@noitca.dev>`);
      logs.push(`[${ts()}] Message: "ci: automated workflow execution triggered"`);
      logs.push(`[${ts()}] Filter match: branch '${cfg.branch || 'main'}' matched pattern`);
      break;

    case 'trigger_pr':
      logs.push(`[${ts()}] Received webhook event: pull_request`);
      logs.push(`[${ts()}] Base branch: ${cfg.branch || 'main'}`);
      logs.push(`[${ts()}] Action: opened`);
      logs.push(`[${ts()}] Pull request #42 verification underway`);
      break;

    case 'repo_checkout':
      logs.push(`[${ts()}] Syncing repository to: /home/runner/work/noitca/noitca`);
      logs.push(`[${ts()}] Getting Git version info`);
      logs.push(`[${ts()}] git version 2.44.0`);
      logs.push(`[${ts()}] Initializing repository: actions/checkout@v4`);
      logs.push(`[${ts()}] Fetching the repository (fetch-depth: ${cfg.fetchDepth ?? 1})`);
      logs.push(`[${ts()}] Checking out ref: refs/heads/${cfg.branch || 'main'}`);
      logs.push(`[${ts()}] Head SHA is 49af90f90c82545e11a95298422680e3b631e4c0`);
      logs.push(`[${ts()}] Repository checkout successful (148 files checked out)`);
      break;

    case 'repo_clone':
      logs.push(`[${ts()}] [command] git clone --depth 1 ${cfg.repositoryUrl || 'https://github.com/org/repo.git'} ${cfg.targetPath || './external'}`);
      logs.push(`[${ts()}] Cloning into '${cfg.targetPath || './external'}'...`);
      logs.push(`[${ts()}] Remote: Enumerating objects: 104, done.`);
      logs.push(`[${ts()}] Remote: Total 104 (delta 32), reused 98 (delta 28)`);
      logs.push(`[${ts()}] Receiving objects: 100% (104/104), 48.20 KiB | 2.10 MiB/s, done.`);
      break;

    case 'repo_fetch':
      logs.push(`[${ts()}] [command] git fetch --prune --tags origin`);
      logs.push(`[${ts()}] From origin`);
      logs.push(`[${ts()}]  * [new branch]      ${cfg.targetBranch || 'main'} -> origin/${cfg.targetBranch || 'main'}`);
      logs.push(`[${ts()}] Fetched remote metadata successfully`);
      break;

    case 'repo_checkout_branch':
      logs.push(`[${ts()}] [command] git checkout ${cfg.branchName || 'feature/dev'}`);
      logs.push(`[${ts()}] Switched to branch '${cfg.branchName || 'feature/dev'}'`);
      logs.push(`[${ts()}] Your branch is up to date with 'origin/${cfg.branchName || 'feature/dev'}'.`);
      break;

    case 'git_commit':
      logs.push(`[${ts()}] [command] git config user.name "${cfg.authorName || 'github-actions[bot]'}"`);
      logs.push(`[${ts()}] [command] git config user.email "${cfg.authorEmail || 'actions@github.com'}"`);
      logs.push(`[${ts()}] [command] git add ${cfg.files || '.'}`);
      logs.push(`[${ts()}] [command] git commit -m "${cfg.message || 'chore: automated pipeline changes'}"`);
      logs.push(`[${ts()}] [main 8b2e31a] ${cfg.message || 'chore: automated pipeline changes'}`);
      logs.push(`[${ts()}]  4 files changed, 82 insertions(+), 12 deletions(-)`);
      break;

    case 'git_push':
      logs.push(`[${ts()}] [command] git push origin ${cfg.branch || 'main'}`);
      logs.push(`[${ts()}] To https://github.com/ronaldkelechi11/noitca.git`);
      logs.push(`[${ts()}]    49af90f..8b2e31a  ${cfg.branch || 'main'} -> ${cfg.branch || 'main'}`);
      logs.push(`[${ts()}] Push complete. Remote updated.`);
      break;

    case 'git_create_tag':
      logs.push(`[${ts()}] [command] git tag -a ${cfg.tagName || 'v1.0.0'} -m "${cfg.annotationMessage || 'Release ' + (cfg.tagName || 'v1.0.0')}"`);
      logs.push(`[${ts()}] Tag '${cfg.tagName || 'v1.0.0'}' created locally.`);
      logs.push(`[${ts()}] [command] git push origin ${cfg.tagName || 'v1.0.0'}`);
      logs.push(`[${ts()}]  * [new tag]         ${cfg.tagName || 'v1.0.0'} -> ${cfg.tagName || 'v1.0.0'}`);
      break;

    case 'git_release':
      logs.push(`[${ts()}] Running softprops/action-gh-release@v2`);
      logs.push(`[${ts()}] Tag: ${cfg.tagName || 'v1.0.0'}`);
      logs.push(`[${ts()}] Release Name: ${cfg.releaseName || 'Production Release'}`);
      logs.push(`[${ts()}] Generating automatic release changelog...`);
      logs.push(`[${ts()}] Release published: https://github.com/ronaldkelechi11/noitca/releases/tag/${cfg.tagName || 'v1.0.0'}`);
      break;

    case 'artifact_upload':
    case 'artifact_build_output':
    case 'artifact_test_results':
    case 'artifact_coverage':
    case 'artifact_logs':
      logs.push(`[${ts()}] Running actions/upload-artifact@v4`);
      logs.push(`[${ts()}] With:`);
      logs.push(`[${ts()}]   name: ${cfg.artifactName || 'build-artifact'}`);
      logs.push(`[${ts()}]   path: ${cfg.artifactPath || './dist'}`);
      logs.push(`[${ts()}]   retention-days: ${cfg.retentionDays || 30}`);
      logs.push(`[${ts()}] Found 8 matching files in '${cfg.artifactPath || './dist'}'`);
      logs.push(`[${ts()}] Compressing and calculating SHA256 checksums...`);
      logs.push(`[${ts()}] Total archive size: 163.8 KiB`);
      logs.push(`[${ts()}] Artifact '${cfg.artifactName || 'build-artifact'}' successfully stored`);
      break;

    case 'artifact_download':
    case 'artifact_download_previous':
      logs.push(`[${ts()}] Running actions/download-artifact@v4`);
      logs.push(`[${ts()}] Looking up artifact: ${cfg.artifactName || 'build-artifact'}`);
      logs.push(`[${ts()}] Downloading artifact container from GitHub Actions storage...`);
      logs.push(`[${ts()}] Extracting archive to: ${cfg.destinationPath || './dist'}`);
      logs.push(`[${ts()}] Download complete: 8 files unpacked.`);
      break;

    case 'node_setup':
      logs.push(`[${ts()}] Running actions/setup-node@v4`);
      logs.push(`[${ts()}] Resolving node version spec: ${cfg.runtimeVersion || '20.x'}`);
      logs.push(`[${ts()}] Found in cache @ /opt/hostedtoolcache/node/20.14.0/x64`);
      logs.push(`[${ts()}] Adding /opt/hostedtoolcache/node/20.14.0/x64/bin to PATH`);
      logs.push(`[${ts()}] Node.js version v20.14.0 activated`);
      logs.push(`[${ts()}] Restoring npm cache from ~/.npm... Cache hit! (142 MB restored)`);
      break;

    case 'docker_build':
      logs.push(`[${ts()}] Running docker/build-push-action@v5`);
      logs.push(`[${ts()}] [command] docker buildx build --tag ${cfg.dockerImage || 'noitca'}:${cfg.dockerTag || 'latest'} .`);
      logs.push(`[${ts()}] [+] Building 2.1s (11/11) FINISHED`);
      logs.push(`[${ts()}]  => [internal] load build definition from Dockerfile`);
      logs.push(`[${ts()}]  => [1/4] FROM docker.io/library/node:20-alpine`);
      logs.push(`[${ts()}]  => [2/4] WORKDIR /app`);
      logs.push(`[${ts()}]  => [3/4] COPY package*.json ./`);
      logs.push(`[${ts()}]  => [4/4] COPY dist/ ./dist/`);
      logs.push(`[${ts()}]  => exporting to image`);
      logs.push(`[${ts()}]  => naming to docker.io/library/${cfg.dockerImage || 'noitca'}:${cfg.dockerTag || 'latest'}`);
      logs.push(`[${ts()}] Successfully tagged ${cfg.dockerImage || 'noitca'}:${cfg.dockerTag || 'latest'}`);
      break;

    case 'cmd_run':
      logs.push(`[${ts()}] [command] ${cfg.command || 'npm test'}`);
      logs.push(`[${ts()}] > ${cfg.command || 'npm test'}`);
      logs.push(`[${ts()}] Test suite execution starting...`);
      logs.push(`[${ts()}] PASS src/utils/yamlCompiler.test.ts (6 tests passed)`);
      logs.push(`[${ts()}] PASS src/utils/yamlParser.test.ts (8 tests passed)`);
      logs.push(`[${ts()}] PASS src/utils/workflowRunner.test.ts (4 tests passed)`);
      logs.push(`[${ts()}] Tests:       18 passed, 18 total`);
      logs.push(`[${ts()}] Snapshots:   0 total`);
      logs.push(`[${ts()}] Time:        0.842s`);
      logs.push(`[${ts()}] Command exited with status 0.`);
      break;

    case 'notif_slack':
      logs.push(`[${ts()}] Running slackapi/slack-github-action@v1.26.0`);
      logs.push(`[${ts()}] Connecting to Slack incoming webhook`);
      logs.push(`[${ts()}] Channel: ${cfg.channel || '#deployments'}`);
      logs.push(`[${ts()}] Dispatching payload: { "status": "success", "event": "push" }`);
      logs.push(`[${ts()}] HTTP/1.1 200 OK`);
      logs.push(`[${ts()}] Slack notification delivered successfully.`);
      break;

    default:
      logs.push(`[${ts()}] Running ${node.title}...`);
      logs.push(`[${ts()}] Category: ${node.category}`);
      logs.push(`[${ts()}] Inputs: ${JSON.stringify(cfg)}`);
      logs.push(`[${ts()}] Step completed with code 0 (success).`);
      break;
  }

  logs.push(`[${ts()}] ##[endgroup]`);
  return logs;
}
