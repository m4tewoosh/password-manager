"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptPassword = exports.encryptPassword = exports.decryptMasterKey = exports.encryptMasterKey = exports.deriveKEK = exports.verifyMainPassword = exports.hashMainPassword = exports.generateSalt = exports.generateMasterKey = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = 12;
const PBKDF2_ITERATIONS = 100000;
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const generateMasterKey = () => {
    return crypto_1.default.randomBytes(32);
};
exports.generateMasterKey = generateMasterKey;
const generateSalt = () => {
    return crypto_1.default.randomBytes(16).toString('base64');
};
exports.generateSalt = generateSalt;
const hashMainPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.hash(password, SALT_ROUNDS);
});
exports.hashMainPassword = hashMainPassword;
const verifyMainPassword = (password, hash) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.compare(password, hash);
});
exports.verifyMainPassword = verifyMainPassword;
const deriveKEK = (mainPassword, salt) => {
    const combinedKey = Buffer.from(`${mainPassword}:${process.env.ENCRYPTION_KEY_SECRET}`);
    return crypto_1.default.pbkdf2Sync(combinedKey, salt, PBKDF2_ITERATIONS, 32, 'sha256');
};
exports.deriveKEK = deriveKEK;
const encryptMasterKey = (masterKey, kek) => {
    const iv = crypto_1.default.randomBytes(12);
    const cipher = crypto_1.default.createCipheriv(ENCRYPTION_ALGORITHM, kek, iv);
    const encrypted = Buffer.concat([cipher.update(masterKey), cipher.final()]);
    const tag = cipher.getAuthTag();
    return {
        encryptedMasterKey: encrypted.toString('base64'),
        iv: iv.toString('base64'),
        tag: tag.toString('base64'),
    };
};
exports.encryptMasterKey = encryptMasterKey;
const decryptMasterKey = (encryptedMasterKey, kek, iv, tag) => {
    const decipher = crypto_1.default.createDecipheriv(ENCRYPTION_ALGORITHM, kek, Buffer.from(iv, 'base64'));
    decipher.setAuthTag(Buffer.from(tag, 'base64'));
    return Buffer.concat([
        decipher.update(Buffer.from(encryptedMasterKey, 'base64')),
        decipher.final(),
    ]);
};
exports.decryptMasterKey = decryptMasterKey;
const encryptPassword = (password, masterKey) => {
    const iv = crypto_1.default.randomBytes(12);
    const cipher = crypto_1.default.createCipheriv(ENCRYPTION_ALGORITHM, masterKey, iv);
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
exports.encryptPassword = encryptPassword;
const decryptPassword = (encryptedPassword, masterKey, iv, tag) => {
    const decipher = crypto_1.default.createDecipheriv(ENCRYPTION_ALGORITHM, masterKey, Buffer.from(iv, 'base64'));
    decipher.setAuthTag(Buffer.from(tag, 'base64'));
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedPassword, 'base64')),
        decipher.final(),
    ]);
    return decrypted.toString('utf8');
};
exports.decryptPassword = decryptPassword;
