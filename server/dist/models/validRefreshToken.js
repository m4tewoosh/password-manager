"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validRefreshTokenSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    jti: { type: String, required: true, unique: true },
});
const ValidRefreshToken = (0, mongoose_1.model)('validRefreshToken', validRefreshTokenSchema);
exports.default = ValidRefreshToken;
