import crypto from 'crypto';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;
const PBKDF2_ITERATIONS = 100000;
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';

const generateMasterKey = () => {
  return crypto.randomBytes(32);
};

const generateSalt = () => {
  return crypto.randomBytes(16).toString('base64');
};

const hashMainPassword = async (password: string) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

const verifyMainPassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

const deriveKEK = (mainPassword: string, salt: string) => {
  const combinedKey = Buffer.from(
    `${mainPassword}:${process.env.ENCRYPTION_KEY_SECRET}`
  );
  return crypto.pbkdf2Sync(combinedKey, salt, PBKDF2_ITERATIONS, 32, 'sha256');
};

const encryptMasterKey = (masterKey: Buffer, kek: Buffer) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, kek, iv);
  const encrypted = Buffer.concat([cipher.update(masterKey), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    encryptedMasterKey: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
  };
};

const decryptMasterKey = (
  encryptedMasterKey: string,
  kek: Buffer,
  iv: string,
  tag: string
) => {
  const decipher = crypto.createDecipheriv(
    ENCRYPTION_ALGORITHM,
    kek,
    Buffer.from(iv, 'base64')
  );
  decipher.setAuthTag(Buffer.from(tag, 'base64'));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedMasterKey, 'base64')),
    decipher.final(),
  ]);
};

const encryptPassword = (password: string, masterKey: Buffer) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, masterKey, iv);
  const encrypted = Buffer.concat([
    cipher.update(password, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return {
    encryptedPassword: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
  };
};

const decryptPassword = (
  encryptedPassword: string,
  masterKey: Buffer,
  iv: string,
  tag: string
) => {
  const decipher = crypto.createDecipheriv(
    ENCRYPTION_ALGORITHM,
    masterKey,
    Buffer.from(iv, 'base64')
  );
  decipher.setAuthTag(Buffer.from(tag, 'base64'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedPassword, 'base64')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
};

export {
  generateMasterKey,
  generateSalt,
  hashMainPassword,
  verifyMainPassword,
  deriveKEK,
  encryptMasterKey,
  decryptMasterKey,
  encryptPassword,
  decryptPassword,
};
