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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUser = void 0;
const authController_1 = require("./authController");
const crypto_1 = require("../utils/crypto");
const models_1 = require("../models");
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const user = yield models_1.User.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({
            email: user.email,
            passwordsModuleOn: user.passwordsModuleOn,
            documentsModuleOn: user.documentsModuleOn,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const { passwordsModuleOn, documentsModuleOn, currentPassword, newPassword, } = req.body;
        const updatedData = {
            passwordsModuleOn,
            documentsModuleOn,
        };
        if (newPassword) {
            if (newPassword.length < 10) {
                return res.status(400).json({
                    error: "Field 'newPassword' must  have at least 10 characters",
                });
            }
            const user = yield models_1.User.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const isCurrentPasswordValid = yield (0, crypto_1.verifyMainPassword)(currentPassword, user.passwordHash);
            if (!isCurrentPasswordValid) {
                return res.status(400).json({ error: 'Current password is incorrect' });
            }
            const { masterKey } = req.session;
            if (!masterKey) {
                return (0, authController_1.logoutUser)(req, res);
            }
            const kek = (0, crypto_1.deriveKEK)(newPassword, user.salt);
            const { encryptedMasterKey, iv, tag } = (0, crypto_1.encryptMasterKey)(Buffer.from(masterKey, 'base64'), kek);
            updatedData.passwordHash = yield (0, crypto_1.hashMainPassword)(newPassword);
            updatedData.encryptedMasterKey = encryptedMasterKey;
            updatedData.iv = iv;
            updatedData.tag = tag;
        }
        yield models_1.User.findByIdAndUpdate(id, { $set: updatedData }, {
            new: true,
        });
        if (updatedData.passwordHash) {
            return (0, authController_1.logoutUser)(req, res);
        }
        res.status(200).json({ message: 'Successfully updated user' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
exports.updateUser = updateUser;
