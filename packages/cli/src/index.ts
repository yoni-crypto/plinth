import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { moduleCommand } from "./commands/module.js";
import { dbCommand } from "./commands/db.js";
import { devCommand } from "./commands/dev.js";

const program = new Command();

program
  .name("plinth")
  .description("CLI for Plinth developer platform")
  .version("0.1.0");

program.addCommand(initCommand);
program.addCommand(moduleCommand);
program.addCommand(dbCommand);
program.addCommand(devCommand);

program.parse();
