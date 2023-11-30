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
exports.UserService = void 0;
const user_model_1 = require("./user.model");
function addSingleUserToDB(userData) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield user_model_1.UserModel.isUserExist(userData.userId)) {
            throw new Error('User already exists');
        }
        return yield user_model_1.UserModel.create(userData);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    });
}
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        // return await UserModel.aggregate([
        //   {
        //     $project: {
        //       _id: 0,
        //       username: 1,
        //       fullName: { firstName: 1, lastName: 1 },
        //       age: 1,
        //       email: 1,
        //       address: { street: 1, city: 1, country: 1 },
        //     },
        //   },
        // ]);
        return yield user_model_1.UserModel.find({}, {
            _id: 0,
            password: 0,
            isDeleted: 0,
            'fullName._id': 0,
            'address._id': 0,
            createdAt: 0,
            updatedAt: 0,
            orders: 0,
            __v: 0,
        });
    });
}
function getUserById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield user_model_1.UserModel.isUserExist(userId))) {
            return null;
        }
        return yield user_model_1.UserModel.findOne({ userId }, {
            _id: 0,
            password: 0,
            'fullName._id': 0,
            'address._id': 0,
            isDeleted: 0,
            createdAt: 0,
            updatedAt: 0,
            orders: 0,
            __v: 0,
        });
    });
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getUserByFilter(filter) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield user_model_1.UserModel.aggregate([
            {
                $match: filter,
                $project: {
                    _id: 0,
                    username: 1,
                    fullName: { firstName: 1, lastName: 1 },
                    age: 1,
                    email: 1,
                    address: { street: 1, city: 1, country: 1 },
                },
            },
        ]);
    });
}
function updateSingleUserByUserId(userId, updateBody) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('updateBody', updateBody);
        const userExist = yield user_model_1.UserModel.isUserExist(userId);
        if (!userExist) {
            return null;
        }
        //  else if (
        //   (updateBody.userId || updateBody.username) &&
        //   (userExist.userId !== updateBody.userId ||
        //     userExist.username !== updateBody.username)
        // ) {
        //   let user: TUser | null;
        //   if (updateBody.userId && userExist.userId !== updateBody.userId) {
        //     console.log('if block');
        //     user = await UserModel.findOne({
        //       userId: { $eq: updateBody.userId, $ne: userExist.userId },
        //     });
        //   } else {
        //     console.log('else block', updateBody);
        //     console.log('updateBody.username', updateBody.username);
        //     user = await UserModel.findOne({
        //       username: { $eq: updateBody.username, $ne: userExist.username },
        //     });
        //   }
        //   console.log('user=>', user);
        //   if (user) {
        //     throw new Error(`Duplicate user found with update body id or username`);
        //   }
        // }
        return yield user_model_1.UserModel.updateOne({ userId }, updateBody);
    });
}
function deleteSingleUserByUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userExist = yield user_model_1.UserModel.isUserExist(userId);
        if (!userExist) {
            return null;
        }
        return yield user_model_1.UserModel.updateOne({ userId }, { isDeleted: true });
    });
}
function addProductToUser(userId, productData) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield user_model_1.UserModel.updateOne({ userId }, { $addToSet: { orders: productData } });
    });
}
function getOrderByUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield user_model_1.UserModel.aggregate([
            {
                $match: { userId },
            },
            {
                $project: {
                    _id: 0,
                    orders: { productName: 1, quantity: 1, price: 1 },
                },
            },
        ]);
    });
}
function getOrderTotalPriceByUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield user_model_1.UserModel.aggregate([
            {
                $match: { userId },
            },
            {
                $project: {
                    _id: 0,
                    orders: { productName: 1, quantity: 1, price: 1 },
                },
            },
            {
                $unwind: '$orders',
            },
            {
                $project: {
                    total: { $multiply: ['$orders.quantity', '$orders.price'] },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPrice: { $sum: '$total' },
                },
            },
            {
                $project: {
                    _id: 0,
                },
            },
        ]);
    });
}
exports.UserService = {
    addSingleUserToDB,
    getUsers,
    getUserByFilter,
    getUserById,
    updateSingleUserByUserId,
    deleteSingleUserByUserId,
    addProductToUser,
    getOrderByUserId,
    getOrderTotalPriceByUserId,
};
