"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentValidation = void 0;
const zod_1 = require("zod");
const validator_1 = __importDefault(require("validator"));
// validation for creating student
const createUserValidationSchema = zod_1.z.object({
    userId: zod_1.z.number(),
    username: zod_1.z.string(),
    password: zod_1.z.string(),
    fullName: zod_1.z.object({
        firstName: zod_1.z.string(),
        lastName: zod_1.z.string(),
    }),
    age: zod_1.z.number(),
    email: zod_1.z.custom((value) => {
        if (!validator_1.default.isEmail(value.toString())) {
            return false;
        }
        return value;
    }, { message: 'Invalid email' }),
    isActive: zod_1.z.boolean().optional(),
    hobbies: zod_1.z.string().array(),
    address: zod_1.z.object({
        street: zod_1.z.string(),
        city: zod_1.z.string(),
        country: zod_1.z.string(),
    }),
});
const updateUserValidationSchema = zod_1.z.object({
    userId: zod_1.z.number().optional(),
    username: zod_1.z.string().optional(),
    password: zod_1.z.string().optional(),
    fullName: zod_1.z
        .object({
        firstName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().optional(),
    })
        .optional(),
    age: zod_1.z.number().optional(),
    email: zod_1.z
        .custom((value) => {
        if (!validator_1.default.isEmail(value.toString())) {
            return false;
        }
        return value;
    }, { message: 'Invalid email' })
        .optional(),
    isActive: zod_1.z.boolean().optional().optional(),
    hobbies: zod_1.z.string().array().optional(),
    address: zod_1.z
        .object({
        street: zod_1.z.string(),
        city: zod_1.z.string(),
        country: zod_1.z.string(),
    })
        .optional(),
});
const addProductValidationSchema = zod_1.z.object({
    productName: zod_1.z.string(),
    price: zod_1.z.number(),
    quantity: zod_1.z.number(),
});
// console.log(createUserValidationSchema instanceof z.ZodSchema);
exports.StudentValidation = {
    createUserValidationSchema,
    updateUserValidationSchema,
    addProductValidationSchema,
};
