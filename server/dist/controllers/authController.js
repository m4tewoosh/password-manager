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
exports.authorizeUser = exports.refreshToken = exports.authenticateToken = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = require("../utils/crypto");
const token_1 = require("../utils/token");
const models_1 = require("../models");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({
                error: "Field 'email' is required",
            });
        }
        if (!password) {
            return res.status(400).json({
                error: "Field 'password' is required",
            });
        }
        if (password.length < 10) {
            return res.status(400).json({
                error: "Field 'password' must  have at least 10 characters",
            });
        }
        const isEmailTaken = yield models_1.User.findOne({ email });
        if (isEmailTaken) {
            return res.status(409).json({
                error: 'Email is already taken',
            });
        }
        const masterKey = (0, crypto_1.generateMasterKey)();
        const salt = (0, crypto_1.generateSalt)();
        const passwordHash = yield (0, crypto_1.hashMainPassword)(password);
        const kek = (0, crypto_1.deriveKEK)(password, salt);
        const { encryptedMasterKey, iv, tag } = (0, crypto_1.encryptMasterKey)(masterKey, kek);
        const user = yield models_1.User.create({
            email,
            passwordHash,
            encryptedMasterKey,
            salt,
            iv,
            tag,
            passwordsModuleOn: true,
            documentsModuleOn: true,
        });
        return res.status(201).json({ id: user._id });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield models_1.User.findOne({ email });
        // add checking for random user password to prevent timing attacks
        if (!user) {
            return res.status(401).json({
                error: 'Bad credentials',
            });
        }
        const isPasswordCorrect = yield (0, crypto_1.verifyMainPassword)(password, user.passwordHash);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                error: 'Bad credentials',
            });
        }
        const kek = (0, crypto_1.deriveKEK)(password, user.salt);
        const masterKey = (0, crypto_1.decryptMasterKey)(user.encryptedMasterKey, kek, user.iv, user.tag);
        req.session.masterKey = masterKey.toString('base64');
        const accessToken = (0, token_1.generateAccessToken)(String(user._id));
        const refreshToken = yield (0, token_1.generateRefreshToken)(String(user._id));
        res
            .cookie('accessToken', accessToken, {
            maxAge: token_1.ACCESS_TOKEN_COOKIE_MAX_AGE,
            httpOnly: true,
            // secure: // add for prod environment
            // sameSite: // to check
        })
            .cookie('refreshToken', refreshToken, {
            maxAge: token_1.REFRESH_TOKEN_COOKIE_MAX_AGE,
            httpOnly: true,
            // secure: // add for prod environment
            // sameSite: // to check
        })
            .json({ id: user._id });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
exports.loginUser = loginUser;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    yield models_1.ValidRefreshToken.deleteMany({ userId: id });
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.clearCookie('sid');
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return res
            .status(200)
            .json({ message: 'Successfully logged out', redirectUrl: '/login' });
    });
});
exports.logoutUser = logoutUser;
const authenticateToken = (req, res, next) => {
    try {
        const { accessToken } = req.cookies;
        if (!accessToken) {
            return res.status(401).json({ error: 'No access token provided' });
        }
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        if (!accessTokenSecret) {
            throw new Error('ACCESS_TOKEN_SECRET is not defined in the environment variables');
        }
        jsonwebtoken_1.default.verify(accessToken, accessTokenSecret, {}, (error, user) => {
            if (error) {
                return res
                    .status(401)
                    .clearCookie('accessToken')
                    .json({ error: 'Access token is invalid or expired' });
            }
            req.user = user;
            next();
        });
    }
    catch (error) {
        console.error('Error in authenticateToken:', error);
        return res
            .status(500)
            .json({ error: 'An unexpected error occurred during authentication' });
    }
};
exports.authenticateToken = authenticateToken;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ error: 'No refresh token provided' });
        }
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        if (!refreshTokenSecret) {
            throw new Error('ACCESS_TOKEN_SECRET is not defined in the environment variables');
        }
        jsonwebtoken_1.default.verify(refreshToken, refreshTokenSecret, {}, (error, token) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                return res
                    .status(403)
                    .clearCookie('refreshToken')
                    .json({ error: 'Refresh token is invalid or expired' });
            }
            const isRefreshTokenWhitelisted = yield models_1.ValidRefreshToken.findOne({
                jti: token === null || token === void 0 ? void 0 : token.jti,
            });
            if (!isRefreshTokenWhitelisted) {
                return res
                    .status(403)
                    .clearCookie('refreshToken')
                    .json({ error: 'Refresh token is invalid or expired' });
            }
            yield models_1.ValidRefreshToken.deleteOne({ jti: token.jti });
            const newAccessToken = (0, token_1.generateAccessToken)(token.id);
            const newRefreshToken = yield (0, token_1.generateRefreshToken)(token.id);
            res
                .status(200)
                .cookie('accessToken', newAccessToken, {
                maxAge: token_1.ACCESS_TOKEN_COOKIE_MAX_AGE,
                httpOnly: true,
                // secure: // add for prod environment
                // sameSite: // to check
            })
                .cookie('refreshToken', newRefreshToken, {
                maxAge: token_1.REFRESH_TOKEN_COOKIE_MAX_AGE,
                httpOnly: true,
                // secure: // add for prod environment
                // sameSite: // to check
            })
                .json({ message: 'Access token refreshed' });
        }));
    }
    catch (error) {
        console.error('Error in refreshToken:', error);
        return res
            .status(500)
            .json({ error: 'An unexpected error occurred during token refresh' });
    }
});
exports.refreshToken = refreshToken;
const authorizeUser = (_req, res) => {
    return res.status(200).json({ message: 'User authorized' });
};
exports.authorizeUser = authorizeUser;
