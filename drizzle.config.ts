import "./src/config/load-env";

// Export a plain config object instead of calling `defineConfig`.
// Some CLI environments load the config with CommonJS interop and
// `defineConfig` may not be callable at runtime. A plain default
// export keeps the same semantics and avoids the runtime error.

const config = {
  schema: "./src/common/database/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
};

export default config;
