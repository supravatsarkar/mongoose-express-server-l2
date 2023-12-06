import { Request, Response } from 'express';
import { z } from 'zod';
import { StudentValidation } from './student.validation';
import { UserService } from './user.service';
import bcrypt from 'bcrypt';
import config from '../../config';
import { UserModel } from './user.model';

const validation = async (
  validationSchema: z.ZodSchema,
  dataObj: Record<string, unknown>,
) => await validationSchema.parseAsync(dataObj);

const createUser = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const validationRes = await validation(
      StudentValidation.createUserValidationSchema,
      body,
    );
    console.log('validationRes', validationRes);
    validationRes.password = await bcrypt.hash(
      validationRes.password,
      Number(config.bcrypt_salt),
    );
    const result = await UserService.addSingleUserToDB(validationRes);
    const finalRes = JSON.parse(JSON.stringify(result));
    console.log('finalRes', finalRes);

    // deleting unwanted fields from response
    delete finalRes.password;
    delete finalRes.orders;
    delete finalRes.isDeleted;
    delete finalRes._id;
    delete finalRes.createdAt;
    delete finalRes.updatedAt;
    delete finalRes.__v;
    delete finalRes.fullName._id;
    delete finalRes.address._id;

    return res.status(200).json({
      success: true,
      message: 'User created successfully!',
      data: finalRes,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log('Create user Error=>', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: {
          code: 400,
          description: 'Zod validation Error',
          error: error.format(),
        },
      });
    } else if (
      error.message === 'User already exists' ||
      error.message === 'Duplicate userId or username'
    ) {
      return res.status(400).json({
        success: false,
        message:
          error.message === 'Duplicate userId or username'
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
};
const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserService.getUsers();

    return res.status(200).json({
      success: true,
      message: 'Users fetched successfully!',
      data: result,
    });
  } catch (error) {
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
};
const getUserByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await UserService.getUserById(Number(userId));
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
  } catch (error) {
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
};
const updateSingleUserByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const body = req.body;
    const validationRes = await validation(
      StudentValidation.updateUserValidationSchema,
      body,
    );
    // if want to update password then we need to hash the password
    if (validationRes.password) {
      validationRes.password = await bcrypt.hash(
        validationRes.password,
        Number(config.bcrypt_salt),
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await UserService.updateSingleUserByUserId(
      Number(userId),
      validationRes,
    );
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalRes: Record<string, any> = result.toObject();
    console.log('result', result);

    // remote unwanted field from response
    delete finalRes.password;
    delete finalRes.orders;
    delete finalRes.isDeleted;
    delete finalRes._id;
    delete finalRes.createdAt;
    delete finalRes.updatedAt;
    delete finalRes.__v;
    delete finalRes.fullName._id;
    delete finalRes.address._id;

    return res.status(200).json({
      success: true,
      message: 'User updated successfully!',
      data: finalRes,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log('Error=>', error);
    if (error instanceof z.ZodError) {
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
    if (
      error.message === 'Duplicate user found with update body id or username'
    ) {
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
      message: error.message || 'Something went wrong!',
      error: {
        code: 500,
        description: 'Something went wrong!',
      },
    });
  }
};
const deleteSingleUserByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const result = await UserService.deleteSingleUserByUserId(Number(userId));
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
      data: null,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
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
};

const addProduct = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { userId } = req.params;
    const validationRes = await validation(
      StudentValidation.addProductValidationSchema,
      body,
    );
    if (!(await UserModel.findOne({ userId }))) {
      return res.status(404).json({
        success: false,
        message: 'User not found!',
        error: {
          code: 404,
          description: 'User not found!',
        },
      });
    }

    const result = await UserService.addProductToUser(
      Number(userId),
      validationRes,
    );
    if (result.acknowledged && result.modifiedCount > 0) {
      return res.status(200).json({
        success: true,
        message: 'Order created successfully!',
        data: null,
      });
    } else {
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
  } catch (error: any) {
    console.log('Error=>', error);
    if (error instanceof z.ZodError) {
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
};
const getOrderByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!(await UserModel.findOne({ userId }))) {
      return res.status(404).json({
        success: false,
        message: 'User not found!',
        error: {
          code: 404,
          description: 'User not found!',
        },
      });
    }

    const result = await UserService.getOrderByUserId(Number(userId));
    return res.status(200).json({
      success: true,
      message: 'Order fetched successfully!',
      data: result,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log('Error=>', error);
    if (error instanceof z.ZodError) {
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
};
const getOrderTotalPriceByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findOne({ userId });
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

    const result = await UserService.getOrderTotalPriceByUserId(Number(userId));
    return res.status(200).json({
      success: true,
      message: 'Total price calculated successfully!',
      data: result,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log('Error=>', error);
    if (error instanceof z.ZodError) {
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
};

export const StudentController = {
  createUser,
  getUsers,
  getUserByUserId,
  updateSingleUserByUserId,
  deleteSingleUserByUserId,
  addProduct,
  getOrderByUserId,
  getOrderTotalPriceByUserId,
};
