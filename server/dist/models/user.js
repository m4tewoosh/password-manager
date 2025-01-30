"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    passwordHash: { type: String, required: true },
    encryptedMasterKey: { type: String, required: true },
    salt: { type: String, required: true },
    iv: { type: String, required: true },
    tag: { type: String, required: true },
    passwordsModuleOn: { type: Boolean, required: true },
    documentsModuleOn: { type: Boolean, required: true },
});
const UserModel = (0, mongoose_1.model)('User', userSchema);
exports.default = UserModel;
