import * as fs from 'fs';
import { parse } from 'dotenv';

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    const isDevelopmentEnvironment = process.env.NODE_ENV !== 'production';

    if (isDevelopmentEnvironment) {
      const envFilePath = __dirname + '/../../.env';
      const envFile = fs.existsSync(envFilePath);

      if (!envFile) {
        console.log('.env file does not exist');
        process.exit(0);
      }

      this.envConfig = parse(fs.readFileSync(envFilePath));
    } else {
      this.envConfig = {
        PORT: process.env.PORT,
        DB_USERNAME: process.env.DB_USERNAME,
        DB_PASSWORD: process.env.DB_PASSWORD,
        JWT_SECRET: process.env.JWT_SECRET,
      };
    }
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
