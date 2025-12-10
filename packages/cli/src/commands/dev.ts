import { Command } from "commander";
import { spawn } from "child_process";

export const devCommand = new Command("dev")
  .description("Start development server")
  .option("-p, --port <port>", "Port number", "3000")
  .action((options) => {
    const child = spawn("pnpm", ["dev", "--port", options.port], {
      stdio: "inherit",
      shell: true,
    });

    child.on("error", (error) => {
      console.error("Failed to start dev server:", error);
      process.exit(1);
    });
  });
