"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const crypto_1 = __importDefault(require("crypto"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
dotenv_1.default.config();
// db connection
mongoose_1.default
    .connect(process.env.MONGO_URL)
    .then(() => console.log('db connected'))
    .catch((error) => console.log('db error', error));
// middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, express_session_1.default)({
    name: 'sid',
    secret: crypto_1.default.randomBytes(64).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        // secure: add for prod environment
        // sameSite: to check
    },
}));
// cors
app.use((0, cors_1.default)({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true, // Allow cookies (necessary for httpOnly cookies)
}));
// routes
app.use('/', routes_1.authRoutes);
app.use('/user', routes_1.userRoutes);
app.use('/passwords', routes_1.passwordRoutes);
app.use('/documents', routes_1.documentRoutes);
const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
