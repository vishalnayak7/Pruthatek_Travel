import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NODE_ENV = process.env.NODE_ENV ?? (process.argv.includes('--production') ? 'production' : 'development');

const envFile = NODE_ENV === 'production' ? '.env.production' : '.env';

// Load environment variables
dotenv.config({
  path: path.resolve(__dirname, `../../${envFile}`),
});

console.log(`✅ Loaded environment from ${envFile} (NODE_ENV=${NODE_ENV})`);
