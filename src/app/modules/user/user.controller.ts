import { Request, Response } from 'express';
import { z } from 'zod';
import { StudentValidation } from './student.validation';
import { UserService } from './user.service';
import bcrypt from 'bcrypt';
import config from '../../config';

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
    validationRes.password = await bcrypt.hash(
      validationRes.password,
      Number(config.bcrypt_salt),
    );
    console.log('validationRes', validationRes);
    const result = await UserService.addSingleUserToDB(validationRes);
    const finalRes: Record<string, unknown> = JSON.parse(
      JSON.stringify(result),
    );
    console.log('finalRes', finalRes);
    delete finalRes.password;
    delete finalRes.orders;

    return res.status(200).json({
      success: true,
      message: 'Successfully created user',
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
    } else if (error.message === 'User already exists') {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
        error: {
          code: 400,
          description: 'User already exists',
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

export const StudentController = {
  createUser,
  getUsers,
  getUserByUserId,
};
