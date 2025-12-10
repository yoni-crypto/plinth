import { Command } from "commander";
import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";

export const moduleCommand = new Command("module")
  .description("Add a module to your Plinth project")
  .argument("[name]", "Module name")
  .action(async (name?: string) => {
    const spinner = ora();

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Module name:",
        when: !name,
        validate: (input) => /^[a-z-]+$/.test(input) || "Use lowercase letters and hyphens only",
      },
      {
        type: "confirm",
        name: "schema",
        message: "Include database schema?",
        default: true,
      },
      {
        type: "confirm",
        name: "api",
        message: "Include API routes?",
        default: true,
      },
      {
        type: "confirm",
        name: "ui",
        message: "Include UI components?",
        default: false,
      },
    ]);

    const moduleName = name || answers.name;
    const modulePath = path.resolve("src/modules", moduleName);

    if (fs.existsSync(modulePath)) {
      console.log(chalk.red(`Module ${moduleName} already exists.`));
      process.exit(1);
    }

    spinner.start(`Creating module ${moduleName}...`);

    try {
      await fs.ensureDir(modulePath);

      // Create schema
      if (answers.schema) {
        const schema = `import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const ${moduleName.replace(/-/g, "_")} = pgTable("${moduleName.replace(/-/g, "_")}", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
`;
        await fs.writeFile(path.join(modulePath, "schema.ts"), schema);
      }

      // Create index
      const index = `import { db } from "@/lib/db/client";
${answers.schema ? `import { ${moduleName.replace(/-/g, "_")} } from "./schema";` : ""}
import { eq } from "drizzle-orm";

export async function get${moduleName.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("")}() {
  ${answers.schema ? `return db.query.${moduleName.replace(/-/g, "_")}.findMany();` : "return [];"}
}

export async function create${moduleName.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("")}(input: { name: string; description?: string }) {
  ${answers.schema ? `const [item] = await db.insert(${moduleName.replace(/-/g, "_")}).values(input).returning();
  return item;` : "return { id: '1', ...input };"}
}
`;
      await fs.writeFile(path.join(modulePath, "index.ts"), index);

      // Create API routes
      if (answers.api) {
        const apiDir = path.resolve("src/app/api", moduleName);
        await fs.ensureDir(apiDir);

        const apiRoute = `import { NextRequest, NextResponse } from "next/server";
import { get${moduleName.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("")}, create${moduleName.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("")} } from "@/modules/${moduleName}";

export async function GET() {
  const data = await get${moduleName.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("")}();
  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const data = await create${moduleName.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("")}(body);
  return NextResponse.json({ success: true, data });
}
`;
        await fs.writeFile(path.join(apiDir, "route.ts"), apiRoute);
      }

      // Create UI component
      if (answers.ui) {
        const componentDir = path.resolve("src/components", moduleName);
        await fs.ensureDir(componentDir);

        const component = `"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ${moduleName.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("")}() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>${moduleName.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Module component placeholder.</p>
      </CardContent>
    </Card>
  );
}
`;
        await fs.writeFile(path.join(componentDir, `${moduleName}.tsx`), component);
      }

      spinner.succeed(chalk.green(`Module ${chalk.bold(moduleName)} created!`));

      console.log("");
      console.log(chalk.cyan("Files created:"));
      if (answers.schema) console.log(`  src/modules/${moduleName}/schema.ts`);
      console.log(`  src/modules/${moduleName}/index.ts`);
      if (answers.api) console.log(`  src/app/api/${moduleName}/route.ts`);
      if (answers.ui) console.log(`  src/components/${moduleName}/${moduleName}.tsx`);

      if (answers.schema) {
        console.log("");
        console.log(chalk.yellow("Don't forget to:"));
        console.log(`  1. Add schema export to src/lib/db/schema/index.ts`);
        console.log(`  2. Run pnpm db:push to update database`);
      }
    } catch (error) {
      spinner.fail(chalk.red("Failed to create module"));
      console.error(error);
      process.exit(1);
    }
  });
