import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT,

  corsOrigins: [
    process.env.HUB_ORIGIN,
    process.env.BUDGET_MANAGER_ORIGIN,
  ].filter(Boolean),

  nodeEnv: process.env.NODE_ENV,
};
