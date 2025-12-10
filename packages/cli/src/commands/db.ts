import { Command } from "commander";
import { execSync } from "child_process";

export const dbCommand = new Command("db")
  .description("Database management commands")
  .command("push")
  .description("Push schema to database")
  .action(() => {
    try {
      execSync("pnpm db:push", { stdio: "inherit" });
    } catch {
      process.exit(1);
    }
  });

dbCommand
  .command("generate")
  .description("Generate migration files")
  .action(() => {
    try {
      execSync("pnpm db:generate", { stdio: "inherit" });
    } catch {
      process.exit(1);
    }
  });

dbCommand
  .command("migrate")
  .description("Run migrations")
  .action(() => {
    try {
      execSync("pnpm db:migrate", { stdio: "inherit" });
    } catch {
      process.exit(1);
    }
  });

dbCommand
  .command("studio")
  .description("Open Drizzle Studio")
  .action(() => {
    try {
      execSync("pnpm db:studio", { stdio: "inherit" });
    } catch {
      process.exit(1);
    }
  });

dbCommand
  .command("seed")
  .description("Seed database")
  .action(() => {
    try {
      execSync("pnpm db:seed", { stdio: "inherit" });
    } catch {
      process.exit(1);
    }
  });
