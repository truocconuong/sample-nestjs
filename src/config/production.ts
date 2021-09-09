
import * as dotenv from 'dotenv';
import * as fs from 'fs';
const environment = process.env.NODE_ENV || '';
const dataEnv: any = dotenv.parse(fs.readFileSync(`.env.${environment}`));

export const config = {
  db: {
    type: dataEnv.DB_TYPE || 'mysql',
    // https://typeorm.io/#/connection-options/common-connection-options
    synchronize: false,
    logging: false,
    host: dataEnv.DB_HOST || '127.0.0.1',
    port: dataEnv.DB_PORT || 3306,
    username: dataEnv.DB_USER || 'username',
    password: dataEnv.DB_PASSWORD || 'password',
    database: dataEnv.DB_NAME || 'dbname',
    extra: {
      connectionLimit: 10,
    },
  },
  foo: 'production-bar',
};