"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./modules/user/user.routes"));
const app = (0, express_1.default)();
// 3rd party middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// custom middlewares
// routes
app.use('/api/users', user_routes_1.default);
app.get('/', (req, res) => {
    res.status(200).send({
        success: true,
        message: "'Server Running....",
    });
});
// 404 handler
app.all('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        error: {
            code: 404,
            description: 'Route not found!',
        },
    });
});
// global error handler
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: {
            code: 500,
            description: 'Something went wrong!',
        },
    });
});
exports.default = app;
