import { TConfig } from './config.type';

export default (): TConfig => ({
  host: process.env.HOST,
  port: parseInt(process.env.PORT, 10) || 3000,
  domainURL: process.env.DOMAIN_URL,
  storage: {
    S3key: process.env.S3_KEY,
    S3secret: process.env.S3_SECRET,
    S3bucket: process.env.S3_BUCKET,
    S3region: process.env.S3_REGION,
    S3endpoint: process.env.S3_ENDPOINT,
  },
});
