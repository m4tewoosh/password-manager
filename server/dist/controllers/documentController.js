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
const crypto_1 = require("crypto");
const path_1 = __importDefault(require("path"));
const sanitize_filename_1 = __importDefault(require("sanitize-filename"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const models_1 = require("../models");
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const acceptedFileTypes = [
    '.pdf',
    '.doc',
    '.docx',
    '.odt',
    '.rtf',
    '.txt',
    '.xls',
    '.xlsx',
    '.csv',
    '.ppt',
    '.pptx',
    '.odp',
    '.md',
    '.xml',
    '.json',
];
const saveDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { file, user: { id }, } = req;
        if (!file) {
            return res.status(400).json({ error: 'No file provided' });
        }
        const fileExtension = path_1.default.extname(file.originalname).toLowerCase();
        if (!acceptedFileTypes.includes(fileExtension)) {
            return res.status(400).json({ error: 'File type not supported' });
        }
        //sanitize originalname with @sanitize-filename
        const sanitizedFilename = (0, sanitize_filename_1.default)(file.originalname);
        const filenameWithNonASCIICharacters = Buffer.from(sanitizedFilename, 'latin1').toString('utf8');
        const uniqueFilename = `${(0, crypto_1.randomUUID)()}-${sanitizedFilename}`;
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: uniqueFilename,
            Body: file.buffer,
            ContentType: file.mimetype,
        };
        const command = new client_s3_1.PutObjectCommand(uploadParams);
        yield s3Client.send(command);
        const newDocument = yield models_1.Document.create({
            userId: id,
            fileName: sanitizedFilename,
            readableFilename: filenameWithNonASCIICharacters,
            uniqueFilename,
        });
        return res.status(201).json(newDocument);
    }
    catch (error) {
        console.error('Error uploading document:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});
const getAllDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const user = yield models_1.User.findOne({ _id: id });
        if (!user) {
            return res.status(400).json({
                error: 'Bad request',
            });
        }
        const documents = yield models_1.Document.find({ userId: id }, { readableFilename: 1, id: 1 });
        res.status(200).json(documents);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
const downloadDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const document = yield models_1.Document.findOne({ _id: id });
        if (!document) {
            return res.status(404).json({
                error: 'Document not found',
            });
        }
        const { uniqueFilename } = document;
        const downloadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: uniqueFilename,
            ResponseContentDisposition: `attachment; filename="${document.fileName}"`,
        };
        const command = new client_s3_1.GetObjectCommand(downloadParams);
        const url = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: 10 });
        res.status(200).json({ url });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
const deleteDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const document = yield models_1.Document.findOne({ _id: id });
        if (!document) {
            return res.status(404).json({
                error: 'Document not found',
            });
        }
        const { uniqueFilename } = document;
        const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: uniqueFilename,
        };
        const command = new client_s3_1.DeleteObjectCommand(deleteParams);
        yield s3Client.send(command);
        yield models_1.Document.findByIdAndDelete(id);
        res.status(200).json({ message: 'Successfully deleted document' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
module.exports = {
    saveDocument,
    getAllDocuments,
    downloadDocument,
    deleteDocument,
};
