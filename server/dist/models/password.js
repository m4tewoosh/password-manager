"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const passwordSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
    },
    name: { type: String, required: true },
    encryptedPassword: { type: String, required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    faviconUrl: { type: String, required: false },
    iv: { type: String, required: true },
    tag: { type: String, required: true },
});
const PasswordModel = (0, mongoose_1.model)('Password', passwordSchema);
exports.default = PasswordModel;
