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
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const addressSchema = new mongoose_1.Schema({
    street: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
});
const orderSchema = new mongoose_1.Schema({
    productName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});
const userSchema = new mongoose_1.Schema({
    userId: {
        type: Number,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    fullName: {
        type: new mongoose_1.Schema({
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
        }),
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    hobbies: {
        type: [String],
        required: true,
        default: [],
    },
    address: {
        type: addressSchema,
        required: true,
    },
    orders: {
        type: [orderSchema],
        required: true,
        default: [],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
userSchema.statics.isUserExist = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return exports.UserModel.findOne({ userId });
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const exit = yield exports.UserModel.find().or([
            { userId: this.userId },
            { username: this.username },
        ]);
        if (exit) {
            throw new Error('Duplicate userId or username');
        }
        next();
    });
});
userSchema.pre('findOne', function (next) {
    this.findOne({ isDeleted: { $ne: true } });
    next();
});
userSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    console.log('is this run');
    next();
});
exports.UserModel = (0, mongoose_1.model)('user', userSchema);
