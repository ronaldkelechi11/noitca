import { WorkflowNode } from '../types/workflow';

export function compileWorkflowToLoadTestScript(
  workflowName: string,
  nodes: WorkflowNode[]
): string {
  // Extract Target Server Node or fallback
  const targetNode = nodes.find(n => n.type === 'target_server' || n.category === 'Target Server' || n.config.baseUrl);
  const baseUrl = targetNode?.config.baseUrl || 'http://localhost:8080';

  // Extract Traffic Profile Node or defaults
  const trafficNode = nodes.find(n => n.type === 'traffic_profile' || n.category === 'Traffic Profile' || n.config.virtualUsers);
  const vusers = trafficNode?.config.virtualUsers || 10;
  const rampUp = trafficNode?.config.rampUpSeconds || 5;
  const duration = trafficNode?.config.durationSeconds || 30;

  // Extract SLA Node or defaults
  const slaNode = nodes.find(n => n.type === 'sla_assertion' || n.category === 'SLA & Assertions');
  const maxP95 = slaNode?.config.maxP95LatencyMs || 500;
  const maxErrPct = slaNode?.config.maxErrorPercentage || 2.0;

  // Extract User Journey / Endpoint nodes in graph topological order
  const requestNodes = nodes.filter(n =>
    n.type === 'http_request' ||
    n.category === 'User Journey' ||
    n.config.endpointPath ||
    n.config.httpMethod
  );

  const endpointSteps = requestNodes.map((node, index) => {
    const method = (node.config.httpMethod || 'GET').toUpperCase();
    const path = node.config.endpointPath || '/';
    const body = node.config.body ? node.config.body.replace(/"/g, '\\"') : '';
    const thinkTime = node.config.thinkTimeMs || 100;
    const title = node.title || `Step ${index + 1}`;

    // Header flags
    let headersArr: string[] = [];
    if (node.config.headers) {
      if (typeof node.config.headers === 'string') {
        try {
          const parsed = JSON.parse(node.config.headers);
          Object.entries(parsed).forEach(([k, v]) => headersArr.push(`-H "${k}: ${v}"`));
        } catch {
          headersArr.push(`-H "${node.config.headers}"`);
        }
      } else {
        Object.entries(node.config.headers).forEach(([k, v]) => headersArr.push(`-H "${k}: ${v}"`));
      }
    }
    if (body && !headersArr.some(h => h.toLowerCase().includes('content-type'))) {
      headersArr.push('-H "Content-Type: application/json"');
    }
    const headersStr = headersArr.join(' ');

    return {
      title,
      method,
      path,
      body,
      headersStr,
      thinkTime
    };
  });

  if (endpointSteps.length === 0) {
    endpointSteps.push({
      title: 'Default Endpoint Request',
      method: 'GET',
      path: '/api/health',
      body: '',
      headersStr: '',
      thinkTime: 100
    });
  }

  // Generate Bash Script
  const script = `#!/usr/bin/env bash
# ==============================================================================
# NOITCA LOAD TESTING SUITE
# Generated Workflow: ${workflowName}
# Target Base URL: ${baseUrl}
# Virtual Users: ${vusers} | Ramp-Up: ${rampUp}s | Duration: ${duration}s
# ==============================================================================

set -u

# --- Color Formatting ---
BOLD='\\033[1m'
GREEN='\\033[0;32m'
CYAN='\\033[0;36m'
YELLOW='\\033[1;33m'
RED='\\033[0;31m'
NC='\\033[0m' # No Color

BASE_URL="${baseUrl.replace(/\/$/, '')}"
VUSERS=${vusers}
RAMP_UP=${rampUp}
DURATION=${duration}
MAX_P95=${maxP95}
MAX_ERR_PCT=${maxErrPct}

TMP_DIR=$(mktemp -d -t noitca-loadtest-XXXXXX)
RESULTS_FILE="$TMP_DIR/results.csv"
touch "$RESULTS_FILE"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

echo -e "\${CYAN}\${BOLD}"
echo "   _  ______  ____  ______ ______ ___  "
echo "  / |/ / __ \\/  _/ /_  __/ ____/   | "
echo " /    / /_/ // /    / / / /   / /| | "
echo "/_/|_/\\____/___/   /_/ /_/__ /___|_| "
echo -e "\${NC}"
echo -e "\${BOLD}🚀 Starting Load Test: ${workflowName}\${NC}"
echo -e "▸ Target:    \${GREEN}\${BASE_URL}\${NC}"
echo -e "▸ VUsers:    \${YELLOW}\${VUSERS}\${NC} concurrent workers"
echo -e "▸ Duration:  \${YELLOW}\${DURATION}s\${NC} (Ramp-up: \${RAMP_UP}s)"
echo -e "▸ User Journey Steps: ${endpointSteps.length}"
echo "------------------------------------------------------------"

# --- Virtual User Execution Loop ---
run_vuser() {
  local vuser_id=\$1
  local end_time=$(($(date +%s) + DURATION))

  # Ramp-up delay
  if [ \$RAMP_UP -gt 0 ]; then
    local delay=$(awk -v v="\$vuser_id" -v total="\$VUSERS" -v ramp="\$RAMP_UP" 'BEGIN { print (v / total) * ramp }')
    sleep "\$delay"
  fi

  while [ $(date +%s) -lt \$end_time ]; do
${endpointSteps.map((step, idx) => `
    # Step ${idx + 1}: ${step.title}
    local start_time_\${idx}=$(date +%s%3N 2>/dev/null || python3 -c 'import time; print(int(time.time()*1000))')
    local http_code_\${idx}=$(curl -s -o /dev/null -w "%{http_code}" -X ${step.method} "\${BASE_URL}${step.path.startsWith('/') ? '' : '/'}${step.path}" ${step.headersStr} ${step.body ? `-d '${step.body}'` : ''} --max-time 10)
    local end_time_\${idx}=$(date +%s%3N 2>/dev/null || python3 -c 'import time; print(int(time.time()*1000))')
    local latency_\${idx}=$((end_time_\${idx} - start_time_\${idx}))

    echo "\$vuser_id,\${http_code_\${idx}},\${latency_\${idx}}" >> "$RESULTS_FILE"
    sleep $(awk -v t="${step.thinkTime}" 'BEGIN { print t / 1000 }')
`).join('\n')}
  done
}

echo -e "\${CYAN}⚡ Spawning \$VUSERS Virtual User threads...\${NC}"
PIDS=()
for i in $(seq 1 \$VUSERS); do
  run_vuser \$i &
  PIDS+=(\$!)
done

# --- Live Spinner / Progress Bar ---
START_STAMP=$(date +%s)
while true; do
  NOW_STAMP=$(date +%s)
  ELAPSED=$((NOW_STAMP - START_STAMP))
  if [ \$ELAPSED -ge \$DURATION ]; then
    break
  fi
  REMAINING=$((DURATION - ELAPSED))
  TOTAL_REQ=$(wc -l < "$RESULTS_FILE" 2>/dev/null || echo 0)
  echo -ne "\r▸ Running load test... [\${ELAPSED}s / \${DURATION}s] - Completed Requests: \${YELLOW}\${TOTAL_REQ}\${NC}  "
  sleep 1
done

# Wait for background processes to finish cleanly
for pid in "\${PIDS[@]}"; do
  wait \$pid 2>/dev/null || true
done

echo -e "\n\n\${GREEN}✅ Load Test Execution Complete!\${NC}"
echo "============================================================"
echo -e "\${BOLD}📊 NOITCA ANALYTICS & METRICS REPORT\${NC}"
echo "============================================================"

# --- Analytics Processing via AWK ---
awk -F',' -v max_p95="\$MAX_P95" -v max_err="\$MAX_ERR_PCT" '
BEGIN {
  count = 0;
  sum_lat = 0;
  min_lat = 999999;
  max_lat = 0;
  errors = 0;
}
{
  if ($2 != "") {
    count++;
    status = $2;
    lat = $3 + 0;

    status_counts[status]++;
    latencies[count] = lat;
    sum_lat += lat;

    if (lat < min_lat) min_lat = lat;
    if (lat > max_lat) max_lat = lat;

    if (status < 200 || status >= 400) {
      errors++;
    }
  }
}
END {
  if (count == 0) {
    print "\\033[0;31m❌ No request results collected! Check host connectivity or endpoint URL.\\033[0m";
    exit 1;
  }

  avg_lat = sum_lat / count;

  # Quick Sort latencies for Percentile calculations
  for (i = 1; i <= count; i++) {
    for (j = i + 1; j <= count; j++) {
      if (latencies[i] > latencies[j]) {
        tmp = latencies[i];
        latencies[i] = latencies[j];
        latencies[j] = tmp;
      }
    }
  }

  p95_idx = int(count * 0.95);
  if (p95_idx < 1) p95_idx = 1;
  p95_lat = latencies[p95_idx];

  p99_idx = int(count * 0.99);
  if (p99_idx < 1) p99_idx = 1;
  p99_lat = latencies[p99_idx];

  err_pct = (errors / count) * 100;
  rps = count / '${duration}';

  printf "▸ Total Requests:     \\033[1m%d\\033[0m\\n", count;
  printf "▸ Throughput (RPS):   \\033[1;36m%.2f req/sec\\033[0m\\n", rps;
  printf "▸ Min Latency:        %.2f ms\\n", min_lat;
  printf "▸ Avg Latency:        %.2f ms\\n", avg_lat;
  printf "▸ Max Latency:        %.2f ms\\n", max_lat;
  printf "▸ p95 Latency:        \\033[1;33m%.2f ms\\033[0m\\n", p95_lat;
  printf "▸ p99 Latency:        %.2f ms\\n", p99_lat;
  printf "▸ Error Rate:         %.2f%% (%d failed)\\n", err_pct, errors;

  print "\\n--- HTTP Status Distribution ---";
  for (st in status_counts) {
    printf "  HTTP %s: %d requests\\n", st, status_counts[st];
  }

  print "\\n--- SLA Threshold Verification ---";
  sla_pass = 1;
  if (p95_lat > max_p95) {
    printf "  \\033[0;31m[FAIL]\\033[0m p95 Latency (%.2f ms) exceeded threshold (%.2f ms)\\n", p95_lat, max_p95;
    sla_pass = 0;
  } else {
    printf "  \\033[0;32m[PASS]\\033[0m p95 Latency (%.2f ms) <= threshold (%.2f ms)\\n", p95_lat, max_p95;
  }

  if (err_pct > max_err) {
    printf "  \\033[0;31m[FAIL]\\033[0m Error Rate (%.2f%%) exceeded maximum allowed (%.2f%%)\\n", err_pct, max_err;
    sla_pass = 0;
  } else {
    printf "  \\033[0;32m[PASS]\\033[0m Error Rate (%.2f%%) <= maximum allowed (%.2f%%)\\n", err_pct, max_err;
  }

  if (sla_pass == 1) {
    print "\\n\\033[1;32m🎉 OVERALL SLA STATUS: PASSED\\033[0m";
  } else {
    print "\\n\\033[1;31m⚠️ OVERALL SLA STATUS: FAILED\\033[0m";
  }
}
' "$RESULTS_FILE"

echo "============================================================"
`;

  return script;
}
