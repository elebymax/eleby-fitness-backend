import dotenv from 'dotenv';
dotenv.config();

interface Config {
  app: {
    port: number,
    baseApi: string,
    uuidNamespace: string,
    passwordKey: string,
    jwtSecret: string,
  },
  postgres: {
    host: string,
    user: string,
    password: string,
    database: string,
    port: number,
  }
}

export default {
  app: {
    port: parseInt(process.env.APP_PORT || '9888'),
    baseApi: process.env.APP_BASE_API,
    uuidNamespace: process.env.APP_UUID_NAMESPACE,
    passwordKey: process.env.APP_PASSWORD_KEY,
    jwtSecret: process.env.APP_JWT_SECRET,
  },
  postgres: {
    host : process.env.PG_HOST,
    user : process.env.PG_USER,
    password : process.env.PG_PASSWORD,
    database : process.env.PG_DB_NAME,
    port: parseInt(process.env.PG_PORT || '5432'),
  }
} as Config
