type Config = {
  host: string;
  port: number;
  domainURL: string;
  storage: StorageConfig;
  allowedOrigins: string[];
};

type StorageConfig = {
  S3key: string;
  S3secret: string;
  S3bucket: string;
  S3region: string;
  S3endpoint: string;
};

export type TConfig = Config;

export type TStorageConfig = StorageConfig;
