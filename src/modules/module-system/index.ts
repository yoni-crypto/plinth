import { db } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import type { PlinthModule, InstalledModule, ModuleManifest } from "./types";

const moduleRegistry = new Map<string, PlinthModule>();

export function registerModule(module: PlinthModule) {
  moduleRegistry.set(module.name, module);
}

export function getModule(name: string): PlinthModule | undefined {
  return moduleRegistry.get(name);
}

export function getRegisteredModules(): PlinthModule[] {
  return Array.from(moduleRegistry.values());
}

export async function installModule(module: PlinthModule): Promise<InstalledModule> {
  // Run onInstall hook
  if (module.hooks?.onInstall) {
    await module.hooks.onInstall();
  }

  const installed: InstalledModule = {
    name: module.name,
    version: module.version,
    installedAt: new Date(),
    enabled: true,
  };

  // Store installation record (in a real app, this would be a DB table)
  return installed;
}

export async function uninstallModule(module: PlinthModule): Promise<void> {
  // Run onUninstall hook
  if (module.hooks?.onUninstall) {
    await module.hooks.onUninstall();
  }
}

export async function upgradeModule(
  module: PlinthModule,
  fromVersion: string
): Promise<void> {
  // Run onUpgrade hook
  if (module.hooks?.onUpgrade) {
    await module.hooks.onUpgrade(fromVersion, module.version);
  }
}

export function validateModuleManifest(manifest: ModuleManifest): string[] {
  const errors: string[] = [];

  if (!manifest.name) {
    errors.push("Module name is required");
  }

  if (!manifest.version) {
    errors.push("Module version is required");
  }

  if (manifest.name && !/^[a-z-]+$/.test(manifest.name)) {
    errors.push("Module name must contain only lowercase letters and hyphens");
  }

  if (manifest.version && !/^\d+\.\d+\.\d+$/.test(manifest.version)) {
    errors.push("Module version must follow semantic versioning (x.y.z)");
  }

  return errors;
}

export async function loadModuleFromPath(path: string): Promise<PlinthModule> {
  const manifest = await import(`${path}/manifest.js`);
  return manifest.default || manifest;
}
