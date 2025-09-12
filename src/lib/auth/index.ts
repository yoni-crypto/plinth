import { betterAuth } from "better-auth";
import { twoFactor, genericOAuth, emailOTP } from "better-auth/plugins";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  database: {
    type: "postgres",
    db: {
      async create(data: any) {
        const { pool } = await import("@/lib/db/client");
        const result = await pool.query(
          `INSERT INTO ${data.model} (${Object.keys(data.values).join(",")}) VALUES (${Object.keys(data.values).map((_, i) => `$${i + 1}`).join(",")}) RETURNING *`,
          Object.values(data.values)
        );
        return result.rows[0];
      },
      async findOne(data: any) {
        const { pool } = await import("@/lib/db/client");
        const conditions = Object.entries(data.where)
          .map(([key, value], i) => `${key} = $${i + 1}`)
          .join(" AND ");
        const result = await pool.query(
          `SELECT * FROM ${data.model} WHERE ${conditions} LIMIT 1`,
          Object.values(data.where)
        );
        return result.rows[0] || null;
      },
      async findMany(data: any) {
        const { pool } = await import("@/lib/db/client");
        let query = `SELECT * FROM ${data.model}`;
        const params: any[] = [];
        if (data.where) {
          const conditions = Object.entries(data.where)
            .map(([key, value], i) => `${key} = $${i + 1}`)
            .join(" AND ");
          query += ` WHERE ${conditions}`;
          params.push(...Object.values(data.where));
        }
        if (data.limit) query += ` LIMIT ${data.limit}`;
        if (data.offset) query += ` OFFSET ${data.offset}`;
        const result = await pool.query(query, params);
        return result.rows;
      },
      async update(data: any) {
        const { pool } = await import("@/lib/db/client");
        const setClause = Object.keys(data.update)
          .map((key, i) => `${key} = $${i + 1}`)
          .join(", ");
        const params = [...Object.values(data.update), Object.values(data.where)[0]];
        await pool.query(
          `UPDATE ${data.model} SET ${setClause} WHERE ${Object.keys(data.where)[0]} = $${Object.keys(data.update).length + 1}`,
          params
        );
      },
      async delete(data: any) {
        const { pool } = await import("@/lib/db/client");
        await pool.query(
          `DELETE FROM ${data.model} WHERE ${Object.keys(data.where)[0]} = $1`,
          Object.values(data.where)
        );
      },
      async count(data: any) {
        const { pool } = await import("@/lib/db/client");
        let query = `SELECT COUNT(*) as count FROM ${data.model}`;
        const params: any[] = [];
        if (data.where) {
          const conditions = Object.entries(data.where)
            .map(([key, value], i) => `${key} = $${i + 1}`)
            .join(" AND ");
          query += ` WHERE ${conditions}`;
          params.push(...Object.values(data.where));
        }
        const result = await pool.query(query, params);
        return parseInt(result.rows[0].count);
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  user: {
    additionalFields: {
      isSuperAdmin: {
        type: "boolean",
        defaultValue: false,
      },
    },
  },
  accounts: {
    accountLinking: {
      enabled: true,
    },
  },
  plugins: [
    twoFactor({
      issuer: "Plinth",
    }),
    genericOAuth({
      config: [
        {
          providerId: "google",
          clientId: process.env.GOOGLE_CLIENT_ID || "",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        },
        {
          providerId: "github",
          clientId: process.env.GITHUB_CLIENT_ID || "",
          clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        },
      ],
    }),
    emailOTP({
      sendVerificationOTP: async ({ email, otp }) => {
        const { sendEmail } = await import("@/modules/email");
        await sendEmail({
          to: email,
          template: "magic-link",
          data: { url: otp, email },
        });
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signUp: "/register",
    verifyEmail: "/verify-email",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    twoFactor: "/2fa",
  },
});
