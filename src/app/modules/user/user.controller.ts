import { Request, Response } from 'express';
import { z } from 'zod';
import { StudentValidation } from './student.validation';
import { UserService } from './user.service';

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

    const result = await UserService.addSingleUserToDB(validationRes);

    return res.status(200).json({
      success: true,
      message: 'Successfully created user',
      data: result,
    });
  } catch (error) {
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
      message: 'Successfully created user',
      data: result,
    });
  } catch (error) {
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
};
