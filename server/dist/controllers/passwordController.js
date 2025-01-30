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
const faviconController_1 = require("./faviconController");
const authController_1 = require("./authController");
const crypto_1 = require("../utils/crypto");
const url_1 = require("../utils/url");
const models_1 = require("../models");
const savePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, name, password } = req.body;
        const { id } = req.user;
        const { masterKey } = req.session;
        if (!masterKey) {
            return (0, authController_1.logoutUser)(req, res);
        }
        const { encryptedPassword, iv, tag } = (0, crypto_1.encryptPassword)(password, Buffer.from(masterKey, 'base64'));
        let faviconUrl;
        if ((0, url_1.isValidUrl)(name)) {
            faviconUrl = yield (0, faviconController_1.extractFaviconURL)(name);
        }
        const newPassword = yield models_1.Password.create({
            userId: id,
            username,
            name,
            faviconUrl,
            encryptedPassword,
            iv,
            tag,
        });
        res.status(201).json(newPassword);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, username, password } = req.body;
        const { masterKey } = req.session;
        if (!masterKey) {
            return (0, authController_1.logoutUser)(req, res);
        }
        const { encryptedPassword, iv, tag } = (0, crypto_1.encryptPassword)(password, Buffer.from(masterKey, 'base64'));
        let faviconUrl;
        if ((0, url_1.isValidUrl)(name)) {
            try {
                faviconUrl = yield (0, faviconController_1.extractFaviconURL)(name);
            }
            catch (error) {
                console.error(`Error extracting favicon: ${error}`);
                faviconUrl = null;
            }
        }
        const updatedData = {
            username,
            name,
            faviconUrl: (0, url_1.isValidUrl)(name) ? faviconUrl : null,
            encryptedPassword,
            iv,
            tag,
        };
        const updatedPassword = yield models_1.Password.findByIdAndUpdate(id, updatedData, {
            new: true,
        });
        if (!updatedPassword) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.status(200).json(updatedPassword);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
const deletePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield models_1.User.findOne({ _id: req.user.id });
        yield models_1.Password.findByIdAndDelete(id);
        res.status(200).json({ message: 'Successfully deleted password' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
const getAllPasswords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const user = yield models_1.User.findOne({ _id: id });
        if (!user) {
            return res.status(400).json({
                error: 'Bad request',
            });
        }
        const passwords = yield models_1.Password.find({ userId: id });
        const { masterKey } = req.session;
        if (!masterKey) {
            return (0, authController_1.logoutUser)(req, res);
        }
        const decryptedPasswords = passwords.map(({ id, username, name, encryptedPassword, faviconUrl, iv, tag }) => {
            const decryptedPassword = (0, crypto_1.decryptPassword)(encryptedPassword, Buffer.from(masterKey, 'base64'), iv, tag);
            return {
                id,
                username,
                name,
                password: decryptedPassword,
                faviconUrl,
            };
        });
        res.status(200).json(decryptedPasswords);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
module.exports = {
    savePassword,
    updatePassword,
    deletePassword,
    getAllPasswords,
};
