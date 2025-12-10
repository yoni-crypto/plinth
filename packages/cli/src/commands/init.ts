import { Command } from "commander";
import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";

export const initCommand = new Command("init")
  .description("Initialize a new Plinth project")
  .argument("[name]", "Project name")
  .action(async (name?: string) => {
    const spinner = ora();

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Project name:",
        when: !name,
        default: "my-plinth-app",
      },
      {
        type: "list",
        name: "database",
        message: "Database:",
        choices: ["PostgreSQL (recommended)", "SQLite"],
        default: "PostgreSQL (recommended)",
      },
      {
        type: "list",
        name: "auth",
        message: "Authentication:",
        choices: ["Email/Password (recommended)", "Magic Link", "OAuth (Google, GitHub)"],
        default: "Email/Password (recommended)",
      },
      {
        type: "list",
        name: "payments",
        message: "Payment provider:",
        choices: ["Stripe", "Chapa", "None"],
        default: "Stripe",
      },
      {
        type: "confirm",
        name: "docker",
        message: "Include Docker configuration?",
        default: true,
      },
    ]);

    const projectName = name || answers.name;
    const projectPath = path.resolve(process.cwd(), projectName);

    if (fs.existsSync(projectPath)) {
      console.log(chalk.red(`Directory ${projectName} already exists.`));
      process.exit(1);
    }

    spinner.start("Creating project...");

    try {
      // Create project structure
      await fs.ensureDir(projectPath);
      await fs.ensureDir(path.join(projectPath, "src"));
      await fs.ensureDir(path.join(projectPath, "src/app"));
      await fs.ensureDir(path.join(projectPath, "src/lib"));
      await fs.ensureDir(path.join(projectPath, "src/modules"));
      await fs.ensureDir(path.join(projectPath, "src/components"));

      // Create package.json
      const packageJson = {
        name: projectName,
        version: "0.1.0",
        private: true,
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
          lint: "next lint",
          typecheck: "tsc --noEmit",
          test: "vitest",
          "db:push": "drizzle-kit push",
          "db:generate": "drizzle-kit generate",
          "db:migrate": "drizzle-kit migrate",
          "db:studio": "drizzle-kit studio",
          "db:seed": "tsx scripts/seed.ts",
        },
        dependencies: {
          next: "^16.0.0",
          react: "^19.0.0",
          "react-dom": "^19.0.0",
        },
        devDependencies: {
          typescript: "^5.6.0",
          "@types/node": "^22.0.0",
          "@types/react": "^19.0.0",
        },
      };

      await fs.writeJson(path.join(projectPath, "package.json"), packageJson, { spaces: 2 });

      // Create tsconfig.json
      const tsConfig = {
        compilerOptions: {
          target: "ES2017",
          lib: ["dom", "dom.iterable", "esnext"],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: "esnext",
          moduleResolution: "bundler",
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: "preserve",
          increment: true,
          plugins: [{ name: "next" }],
          paths: { "@/*": ["./src/*"] },
        },
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        exclude: ["node_modules"],
      };

      await fs.writeJson(path.join(projectPath, "tsconfig.json"), tsConfig, { spaces: 2 });

      // Create .env.example
      const envExample = `# Database
DATABASE_URL=postgresql://user:password@localhost:5432/${projectName}

# Auth
AUTH_SECRET=your-secret-key-at-least-32-chars
AUTH_EXPIRES_IN=7d

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
`;
      await fs.writeFile(path.join(projectPath, ".env.example"), envExample);

      // Create README
      const readme = `# ${projectName}

Built with [Plinth](https://github.com/plinth-dev/plinth).

## Getting Started

\`\`\`bash
pnpm install
cp .env.example .env
pnpm db:push
pnpm db:seed
pnpm dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)
`;
      await fs.writeFile(path.join(projectPath, "README.md"), readme);

      // Create Docker files if requested
      if (answers.docker) {
        const dockerfile = `FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable && pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
`;
        await fs.writeFile(path.join(projectPath, "Dockerfile"), dockerfile);

        const dockerCompose = `services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${projectName}
      POSTGRES_USER: plinth
      POSTGRES_PASSWORD: plinth_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://plinth:plinth_password@db:5432/${projectName}
      AUTH_SECRET: change-me-in-production
    depends_on:
      - db

volumes:
  postgres_data:
`;
        await fs.writeFile(path.join(projectPath, "docker-compose.yml"), dockerCompose);
      }

      spinner.succeed(chalk.green(`Project ${chalk.bold(projectName)} created!`));

      console.log("");
      console.log(chalk.cyan("Next steps:"));
      console.log(`  cd ${projectName}`);
      console.log("  pnpm install");
      console.log("  cp .env.example .env");
      console.log("  pnpm db:push");
      console.log("  pnpm db:seed");
      console.log("  pnpm dev");
    } catch (error) {
      spinner.fail(chalk.red("Failed to create project"));
      console.error(error);
      process.exit(1);
    }
  });
