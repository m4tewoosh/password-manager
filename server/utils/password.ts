const bcrypt = require('bcrypt');
import crypto from 'crypto';

const accessTokenCookieMaxAge = 6 * 60 * 1000; // max age set to 6 minutes (minutes * seconds * milliseconds) - 1 minute longer than jwt max age
const refreshTokenCookieMaxAge = 7 * 24 * 60 * 60 * 1000; // max age set to 7 days (days * hours * minutes * seconds * milliseconds)

const generateUserSalt = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Used to hash main password
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;

  return bcrypt.hash(password, saltRounds);
};

// Used during login phase to compare sent password with hashed password
const comparePasswords = (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

// Used to encrypt passwords from passwords module
const encryptPassword = (key: Buffer, password: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + encrypted; // Łączenie IV z szyfrowanym hasłem
};

// Used to encrypt passwords from passwords module
const decryptPassword = (key: Buffer, encryptedPassword: string): string => {
  const iv = Buffer.from(encryptedPassword.slice(0, 32), 'hex'); // Pierwsze 16 bajtów to IV

  const encrypted = encryptedPassword.slice(32); // Pozostała część to zaszyfrowane hasło
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

// Function to generate encryption key based on main password
const deriveEncryptionKey = (masterPassword: string, salt: string): Buffer => {
  const combinedKey = Buffer.from(
    `${masterPassword}:${process.env.ENCRYPTION_KEY_SECRET}`
  );

  return crypto.pbkdf2Sync(combinedKey, salt, 100000, 32, 'sha256'); // 100000 iterations, 32 bytes key
};

module.exports = {
  generateUserSalt,
  hashPassword,
  comparePasswords,
  encryptPassword,
  decryptPassword,
  deriveEncryptionKey,
  accessTokenCookieMaxAge,
  refreshTokenCookieMaxAge,
};
