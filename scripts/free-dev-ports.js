const { execSync } = require("child_process");

const PORTS = [8000, 8001];
const PROJECT_MARKER = "CodeSensei-AI-Code-Reviewer/gateway";

function sleep(ms) {
  execSync(`sleep ${ms / 1000}`);
}

function killProjectNodemon() {
  try {
    const lines = execSync("pgrep -fl nodemon", { encoding: "utf8" })
      .trim()
      .split("\n")
      .filter(Boolean);

    for (const line of lines) {
      if (!line.includes(PROJECT_MARKER)) continue;
      const pid = Number(line.split(" ")[0]);
      if (!pid) continue;
      try {
        process.kill(pid, "SIGKILL");
        console.log(`[predev] Stopped stale nodemon ${pid}`);
      } catch {
        // already exited
      }
    }
  } catch {
    // no nodemon processes
  }
}

function freePort(port) {
  try {
    const pids = execSync(`lsof -ti :${port}`, { encoding: "utf8" })
      .trim()
      .split("\n")
      .filter(Boolean);

    for (const pid of pids) {
      try {
        process.kill(Number(pid), "SIGKILL");
        console.log(`[predev] Stopped process ${pid} on port ${port}`);
      } catch {
        // process may have already exited
      }
    }
  } catch {
    // no process on this port
  }
}

killProjectNodemon();
for (const port of PORTS) {
  freePort(port);
}
sleep(400);
for (const port of PORTS) {
  freePort(port);
}
