import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

(async () => {
  try {
    console.log('ENV:', {
      port: process.env.PORT,
      db_uri: process.env.MONGODB_URI,
      bcrypt_salt: process.env.BCRYPT_SALT,
    });
    const configValidationSchema = z.object({
      port: z.number(),
      db_uri: z.string(),
      bcrypt_salt: z.number(),
    });
    configValidationSchema.parse({
      port: Number(process.env.PORT),
      db_uri: process.env.MONGODB_URI,
      bcrypt_salt: Number(process.env.BCRYPT_SALT),
    });
    return configValidationSchema;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log('=== Config Validation Error ===', error.issues);
    throw error;
  }
})();

export default {
  port: process.env.PORT || 5000,
  db_uri: process.env.MONGODB_URI,
  bcrypt_salt: process.env.BCRYPT_SALT,
};
