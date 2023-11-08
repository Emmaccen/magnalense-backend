const config = {
  port: process.env?.PORT ? parseInt(process.env.PORT) : 4000,
  dbUrl: process.env.DB_URL,
  environment: process.env.NODE_ENV,
};

export const configService = <T extends keyof typeof config>(key: T) => {
  if (!Object.prototype.hasOwnProperty.call(config, key)) {
    throw new Error(`Key ${key} not found in config`);
  }

  return config[key];
};
