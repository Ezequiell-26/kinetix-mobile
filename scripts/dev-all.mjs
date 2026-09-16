import { spawn } from "node:child_process";

const processes = [
  { name: "mobile", cwd: "apps/mobile", command: process.platform === "win32" ? "npm.cmd" : "npm", args: ["run", "dev"] },
  { name: "web", cwd: "apps/web", command: process.platform === "win32" ? "npm.cmd" : "npm", args: ["run", "dev"] },
];

const children = processes.map(({ name, cwd, command, args }) => {
  const child = spawn(command, args, { cwd, stdio: "inherit", env: process.env, shell: false });
  child.on("error", (error) => console.error(`[${name}] failed to start`, error));
  return { name, child };
});

const shutdown = (signal) => {
  for (const { child } of children) {
    if (!child.killed) child.kill(signal);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

const exitCodes = await Promise.all(children.map(({ child }) => new Promise((resolve) => {
  child.on("exit", (code, signal) => resolve(signal ? 1 : (code ?? 1)));
})));

shutdown("SIGTERM");
process.exit(exitCodes.some((code) => code !== 0) ? 1 : 0);
