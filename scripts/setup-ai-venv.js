const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const AI_SERVICE = path.join(ROOT, "ai-service");
const VENV_DIR = path.join(AI_SERVICE, ".venv");
const PYTHON_BIN = path.join(VENV_DIR, "bin", "python");
const REQUIREMENTS = path.join(AI_SERVICE, "requirements-min.txt");

const PYTHON_CANDIDATES = [
  "python3.12",
  "python3.11",
  "python3.10",
  "python3",
];

function run(command, options = {}) {
  execSync(command, { stdio: "inherit", cwd: options.cwd || ROOT, ...options });
}

function resolvePython() {
  for (const candidate of PYTHON_CANDIDATES) {
    try {
      const version = execSync(`${candidate} --version`, { encoding: "utf8" }).trim();
      const minor = Number(version.replace(/[^\d.]/g, "").split(".")[1]);
      if (minor >= 10) {
        return candidate;
      }
    } catch {
      // try next candidate
    }
  }

  throw new Error(
    "Python 3.10+ is required for the AI service. Install python3.11+ and rerun npm run dev."
  );
}

function venvReady() {
  if (!fs.existsSync(PYTHON_BIN)) return false;

  try {
    const version = execSync(`"${PYTHON_BIN}" --version`, { encoding: "utf8" }).trim();
    const minor = Number(version.replace(/[^\d.]/g, "").split(".")[1]);
    if (minor < 10) return false;

    execSync(
      `"${PYTHON_BIN}" -c "import uvicorn, fastapi, dotenv, groq"`,
      { stdio: "ignore" }
    );
    return true;
  } catch {
    return false;
  }
}

const systemPython = resolvePython();

if (fs.existsSync(VENV_DIR) && !venvReady()) {
  console.log("[setup-ai-venv] Refreshing AI service virtual environment...");
}

if (!fs.existsSync(VENV_DIR)) {
  console.log(`[setup-ai-venv] Creating virtual environment with ${systemPython}...`);
  run(`${systemPython} -m venv .venv`, { cwd: AI_SERVICE });
}

if (!venvReady()) {
  console.log("[setup-ai-venv] Installing AI service dependencies...");
  run(`"${PYTHON_BIN}" -m pip install --upgrade pip`, { cwd: AI_SERVICE });
  run(`"${PYTHON_BIN}" -m pip install -r "${REQUIREMENTS}"`, { cwd: AI_SERVICE });
}

console.log("[setup-ai-venv] AI service venv is ready.");
