const { execSync } = require("child_process");
const path = require("path");

const {
  INPUT_COURSES_JSON,
  INPUT_CANVAS_API_TOKEN,
  INPUT_CLICKUP_API_KEY,
  INPUT_DB_FILE,
  GITHUB_ACTIONS,
  GITHUB_WORKSPACE,
} = process.env;

if (!GITHUB_ACTIONS) {
  throw new Error("This file should be run in GitHub Actions");
}

process.env.CANVAS_API_TOKEN = INPUT_CANVAS_API_TOKEN;
process.env.CLICKUP_API_KEY = INPUT_CLICKUP_API_KEY;
process.env.COURSES_JSON = path.resolve(GITHUB_WORKSPACE, INPUT_COURSES_JSON);
process.env.DATABASE_URL = `file:${path.resolve(
  GITHUB_WORKSPACE,
  INPUT_DB_FILE
)}`;
const ACTION_PATH = __dirname;
execSync(
  `cd ${ACTION_PATH}
  npx prisma db push
  node dist/main.js`,
  {
    stdio: "inherit",
  }
);
