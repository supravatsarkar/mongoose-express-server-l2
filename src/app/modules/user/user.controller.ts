import { Request, Response } from 'express';

const createUser = (req: Request, res: Response) => {
  try {
    const body = req.body;
    console.log(body);
    res.status(200).json(body);
  } catch (error) {
    console.log('user creating error:-', error);
  }
};

export const StudentController = {
  createUser,
};
