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
exports.generateRefreshToken = exports.generateAccessToken = exports.REFRESH_TOKEN_COOKIE_MAX_AGE = exports.ACCESS_TOKEN_COOKIE_MAX_AGE = void 0;
const jwt = require('jsonwebtoken');
const crypto_1 = require("crypto");
const validRefreshToken_1 = __importDefault(require("../models/validRefreshToken"));
const ACCESS_TOKEN_COOKIE_MAX_AGE = 6 * 60 * 1000; // max age set to 6 minutes (minutes * seconds * milliseconds)
exports.ACCESS_TOKEN_COOKIE_MAX_AGE = ACCESS_TOKEN_COOKIE_MAX_AGE;
const REFRESH_TOKEN_COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // max age set to 24 hours ( hours * minutes * seconds * milliseconds)
exports.REFRESH_TOKEN_COOKIE_MAX_AGE = REFRESH_TOKEN_COOKIE_MAX_AGE;
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '5m',
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jti = (0, crypto_1.randomUUID)();
        const payload = { id, jti };
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '7d',
        });
        yield validRefreshToken_1.default.create({ userId: id, jti });
        return refreshToken;
    }
    catch (error) {
        throw new Error(`Error creating refresh token`);
    }
});
exports.generateRefreshToken = generateRefreshToken;
