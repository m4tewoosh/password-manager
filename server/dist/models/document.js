"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const documentSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    fileName: { type: String, required: true },
    uniqueFilename: { type: String, required: true },
    readableFilename: { type: String, required: true },
});
const DocumentModel = (0, mongoose_1.model)('Document', documentSchema);
exports.default = DocumentModel;
