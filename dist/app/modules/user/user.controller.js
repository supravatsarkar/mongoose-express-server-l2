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
exports.StudentController = void 0;
const zod_1 = require("zod");
const student_validation_1 = require("./student.validation");
const user_service_1 = require("./user.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const user_model_1 = require("./user.model");
const validation = (validationSchema, dataObj) => __awaiter(void 0, void 0, void 0, function* () { return yield validationSchema.parseAsync(dataObj); });
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const validationRes = yield validation(student_validation_1.StudentValidation.createUserValidationSchema, body);
        validationRes.password = yield bcrypt_1.default.hash(validationRes.password, Number(config_1.default.bcrypt_salt));
        console.log('validationRes', validationRes);
        const result = yield user_service_1.UserService.addSingleUserToDB(validationRes);
        const finalRes = JSON.parse(JSON.stringify(result));
        console.log('finalRes', finalRes);
        delete finalRes.password;
        delete finalRes.orders;
        return res.status(200).json({
            success: true,
            message: 'Successfully created user',
            data: finalRes,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        console.log('Create user Error=>', error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                error: {
                    code: 400,
                    description: 'Zod validation Error',
                    error: error.format(),
                },
            });
        }
        else if (error.message === 'User already exists' ||
            error.message === 'Duplicate userId or username') {
            return res.status(400).json({
                success: false,
                message: error.message === 'Duplicate userId or username'
                    ? `${error.message}. Please change userId or username`
                    : error.message,
                error: {
                    code: 400,
                    description: error.message,
                },
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Something went wrong!',
            error: {
                code: 500,
                description: 'Something went wrong!',
            },
        });
    }
});
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_service_1.UserService.getUsers();
        return res.status(200).json({
            success: true,
            message: 'Users fetched successfully!',
            data: result,
        });
    }
    catch (error) {
        console.log('Error=>', error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong!',
            error: {
                code: 500,
                description: 'Something went wrong!',
            },
        });
    }
});
const getUserByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = yield user_service_1.UserService.getUserById(Number(userId));
        // console.log('result', result);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'User not found!',
                error: {
                    code: 404,
                    description: 'User not found!',
                },
            });
        }
        return res.status(200).json({
            success: true,
            message: 'User fetched successfully!',
            data: result,
        });
    }
    catch (error) {
        console.log('Error=>', error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong!',
            error: {
                code: 500,
                description: 'Something went wrong!',
            },
        });
    }
});
const updateSingleUserByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const body = req.body;
        const validationRes = yield validation(student_validation_1.StudentValidation.updateUserValidationSchema, body);
        if (validationRes.password) {
            validationRes.password = yield bcrypt_1.default.hash(validationRes.password, Number(config_1.default.bcrypt_salt));
        }
        const result = yield user_service_1.UserService.updateSingleUserByUserId(Number(userId), validationRes);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'User not found!',
                error: {
                    code: 404,
                    description: 'User not found!',
                },
            });
        }
        console.log('result', result);
        return res.status(200).json({
            success: true,
            message: 'User updated successfully!',
            data: result,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        console.log('Error=>', error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                error: {
                    code: 400,
                    description: 'Zod validation Error',
                    error: error.format(),
                },
            });
        }
        if (error.message === 'Duplicate user found with update body id or username') {
            return res.status(404).json({
                success: false,
                message: error.message,
                error: {
                    code: 404,
                    description: error.message,
                },
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Something went wrong!',
            error: {
                code: 500,
                description: 'Something went wrong!',
            },
        });
    }
});
const deleteSingleUserByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = yield user_service_1.UserService.deleteSingleUserByUserId(Number(userId));
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'User not found!',
                error: {
                    code: 404,
                    description: 'User not found!',
                },
            });
        }
        console.log('result', result);
        return res.status(200).json({
            success: true,
            message: 'User deleted successfully!',
            data: result,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        console.log('Error=>', error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong!',
            error: {
                code: 500,
                description: 'Something went wrong!',
            },
        });
    }
});
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { userId } = req.params;
        const validationRes = yield validation(student_validation_1.StudentValidation.addProductValidationSchema, body);
        if (!(yield user_model_1.UserModel.findOne({ userId }))) {
            return res.status(404).json({
                success: false,
                message: 'User not found!',
                error: {
                    code: 404,
                    description: 'User not found!',
                },
            });
        }
        const result = yield user_service_1.UserService.addProductToUser(Number(userId), validationRes);
        if (result.acknowledged && result.modifiedCount > 0) {
            return res.status(200).json({
                success: true,
                message: 'Order created successfully!',
                data: null,
            });
        }
        else {
            return res.status(500).json({
                success: false,
                message: 'Failed to create order!',
                error: {
                    code: 500,
                    description: 'Failed to create order',
                },
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        console.log('Error=>', error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                error: {
                    code: 400,
                    description: 'Zod validation Error',
                    error: error.format(),
                },
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Something went wrong!',
            error: {
                code: 500,
                description: 'Something went wrong!',
            },
        });
    }
});
const getOrderByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!(yield user_model_1.UserModel.findOne({ userId }))) {
            return res.status(404).json({
                success: false,
                message: 'User not found!',
                error: {
                    code: 404,
                    description: 'User not found!',
                },
            });
        }
        const result = yield user_service_1.UserService.getOrderByUserId(Number(userId));
        return res.status(200).json({
            success: true,
            message: 'Order fetched successfully!',
            data: result,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        console.log('Error=>', error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                error: {
                    code: 400,
                    description: 'Zod validation Error',
                    error: error.format(),
                },
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Something went wrong!',
            error: {
                code: 500,
                description: 'Something went wrong!',
            },
        });
    }
});
const getOrderTotalPriceByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield user_model_1.UserModel.findOne({ userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found!',
                error: {
                    code: 404,
                    description: 'User not found!',
                },
            });
        }
        if (user.orders && user.orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No orders found!',
                error: {
                    code: 404,
                    description: 'No orders found!',
                },
            });
        }
        const result = yield user_service_1.UserService.getOrderTotalPriceByUserId(Number(userId));
        return res.status(200).json({
            success: true,
            message: 'Total price calculated successfully!',
            data: result,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        console.log('Error=>', error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                error: {
                    code: 400,
                    description: 'Zod validation Error',
                    error: error.format(),
                },
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Something went wrong!',
            error: {
                code: 500,
                description: 'Something went wrong!',
            },
        });
    }
});
exports.StudentController = {
    createUser,
    getUsers,
    getUserByUserId,
    updateSingleUserByUserId,
    deleteSingleUserByUserId,
    addProduct,
    getOrderByUserId,
    getOrderTotalPriceByUserId,
};
