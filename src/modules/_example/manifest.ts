import type { PlinthModule } from "./types";

const exampleModule: PlinthModule = {
  name: "example",
  version: "0.1.0",
  description: "Example module demonstrating the module system",
  permissions: [
    { name: "example.read", description: "Read example data" },
    { name: "example.write", description: "Write example data" },
  ],
  settings: [
    {
      key: "greeting",
      type: "string",
      label: "Greeting message",
      default: "Hello from Example module!",
    },
    {
      key: "maxItems",
      type: "number",
      label: "Maximum items",
      default: 100,
    },
  ],
  hooks: {
    onInstall: async () => {
      console.log("Example module installed!");
    },
    onUninstall: async () => {
      console.log("Example module uninstalled!");
    },
    onUpgrade: async (from, to) => {
      console.log(`Example module upgraded from ${from} to ${to}`);
    },
  },
};

export default exampleModule;
