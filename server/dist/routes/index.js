"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = exports.passwordRoutes = exports.documentRoutes = exports.authRoutes = void 0;
const authRoutes_1 = __importDefault(require("./authRoutes"));
exports.authRoutes = authRoutes_1.default;
const documentRoutes_1 = __importDefault(require("./documentRoutes"));
exports.documentRoutes = documentRoutes_1.default;
const passwordRoutes_1 = __importDefault(require("./passwordRoutes"));
exports.passwordRoutes = passwordRoutes_1.default;
const userRoutes_1 = __importDefault(require("./userRoutes"));
exports.userRoutes = userRoutes_1.default;
