"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
router.post('/', user_controller_1.StudentController.createUser);
router.get('/', user_controller_1.StudentController.getUsers);
router.get('/:userId', user_controller_1.StudentController.getUserByUserId);
router.put('/:userId', user_controller_1.StudentController.updateSingleUserByUserId);
router.delete('/:userId', user_controller_1.StudentController.deleteSingleUserByUserId);
router.put('/:userId/orders', user_controller_1.StudentController.addProduct);
router.get('/:userId/orders', user_controller_1.StudentController.getOrderByUserId);
router.get('/:userId/orders/total-price', user_controller_1.StudentController.getOrderTotalPriceByUserId);
exports.default = router;
