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
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('ENV:', {
            port: process.env.PORT,
            db_uri: process.env.MONGODB_URI,
            bcrypt_salt: process.env.BCRYPT_SALT,
        });
        const configValidationSchema = zod_1.z.object({
            port: zod_1.z.number(),
            db_uri: zod_1.z.string(),
            bcrypt_salt: zod_1.z.number(),
        });
        configValidationSchema.parse({
            port: Number(process.env.PORT),
            db_uri: process.env.MONGODB_URI,
            bcrypt_salt: Number(process.env.BCRYPT_SALT),
        });
        return configValidationSchema;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        console.log('=== Config Validation Error ===', error.issues);
        throw error;
    }
}))();
exports.default = {
    port: process.env.PORT || 5000,
    db_uri: process.env.MONGODB_URI,
    bcrypt_salt: process.env.BCRYPT_SALT,
};
