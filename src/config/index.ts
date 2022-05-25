export enum LogTransport {
  CONSOLE = 'CONSOLE',
  LOGSTASH = 'LOGSTASH',
}

export interface Configuration {
  env: {
    value: string;
    mode: string;
    isDev: boolean;
    isTest: boolean;
  };
  port: number;
  database: {
    url: string;
  };
  log: {
    logLevel: string;
    logTransport: string;
    logstashHost: string;
    logstashPort: number;
  };
  passwordResetConfig: {
    expireIn: string;
    secret: string;
  };
  jwt: {
    secret: string;
    duration: string;
  };
  depositRange: number[];
}

const { NODE_ENV, SERVER_MODE } = process.env;

const DEVELOPMENT_ENVS = ['dev', 'development', 'local'];
const TEST_ENVS = ['jest', 'e2e', 'test'];

export default (): Configuration => ({
  env: {
    value: NODE_ENV,
    isDev: DEVELOPMENT_ENVS.includes(NODE_ENV),
    isTest: TEST_ENVS.includes(NODE_ENV),
    mode: SERVER_MODE,
  },
  port: parseInt(process.env.PORT, 10) || 8080,
  database: {
    url: process.env.MONGO_URI,
  },
  log: {
    logLevel: process.env.LOG_LEVEL,
    logTransport: process.env.LOG_TRANSPORT,
    logstashHost: process.env.LOGSTASH_HOST,
    logstashPort: parseInt(process.env.LOGSTASH_PORT, 10),
  },
  passwordResetConfig: {
    expireIn: process.env.PASSWORD_RESET_EXPIRE_IN,
    secret: process.env.PASSWORD_RESET_JWT_SECRET,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    duration: process.env.TOKEN_LIFETIME as string,
  },
  depositRange: [5, 10, 20, 50, 100],
});
