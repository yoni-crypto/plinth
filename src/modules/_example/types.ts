export interface PlinthModule {
  name: string;
  version: string;
  description?: string;
  schema?: string;
  migrations?: string[];
  routes?: ModuleRoute[];
  hooks?: ModuleHooks;
  permissions?: ModulePermission[];
  settings?: ModuleSetting[];
}

export interface ModuleRoute {
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  handler: string;
  auth?: boolean;
  permissions?: string[];
}

export interface ModuleHooks {
  onInstall?: () => Promise<void>;
  onUninstall?: () => Promise<void>;
  onUpgrade?: (fromVersion: string, toVersion: string) => Promise<void>;
}

export interface ModulePermission {
  name: string;
  description: string;
  default?: boolean;
}

export interface ModuleSetting {
  key: string;
  type: "string" | "number" | "boolean" | "select";
  label: string;
  description?: string;
  default?: unknown;
  options?: { label: string; value: string }[];
  required?: boolean;
}

export interface ModuleManifest {
  name: string;
  version: string;
  description?: string;
  author?: string;
  dependencies?: string[];
  plinthVersion?: string;
}

export interface InstalledModule {
  name: string;
  version: string;
  installedAt: Date;
  enabled: boolean;
  settings?: Record<string, unknown>;
}
