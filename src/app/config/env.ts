import dotenv from "dotenv";

dotenv.config();

export interface EnvConfig {
  PORT: string;
  NODE_ENV: string;
  FRONTEND_URL: string;
  DB_URL: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredVars = ["PORT", "NODE_ENV", "FRONTEND_URL", "DB_URL"];

  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`Environment variable ${varName} is not set.`);
    }
  });

  return {
    PORT: process.env.PORT || "8000",
    NODE_ENV: process.env.NODE_ENV || "development",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    DB_URL: process.env.DB_URL || "",
  };
};

export const envVars = loadEnvVariables();
