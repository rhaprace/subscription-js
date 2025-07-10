import {config} from 'dotenv';
import process from 'process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

config({
    path: join(rootDir, `.env.${process.env.NODE_ENV || 'development'}.local`)
});

export const {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    JWT_SECRET,
    JWT_EXPIRATION,
    ARCJET_KEY,
    ARCJET_ENV,
    QSTASH_URL,
    QSTASH_TOKEN,
    QSTASH_CURRENT_SIGNING_KEY,
    QSTASH_NEXT_SIGNING_KEY,
    SERVER_URL,
    EMAIL_PASSWORD,
} = process.env;

export const DB_CONFIG = {
    host: DB_HOST || 'localhost',
    port: parseInt(DB_PORT || '5432'),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD
};