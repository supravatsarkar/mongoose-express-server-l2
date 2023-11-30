import { z } from 'zod';
import validator from 'validator';

// validation for creating student
const createUserValidationSchema = z.object({
  userId: z.number(),
  username: z.string(),
  password: z.string(),
  fullName: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
  age: z.number(),
  email: z.custom(
    (value: unknown) => {
      if (!validator.isEmail((value as string).toString())) {
        return false;
      }
      return value;
    },
    { message: 'Invalid email' },
  ),
  isActive: z.boolean().optional(),
  hobbies: z.string().array(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    country: z.string(),
  }),
});
const updateUserValidationSchema = z.object({
  userId: z.number().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  fullName: z
    .object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    })
    .optional(),
  age: z.number().optional(),
  email: z
    .custom(
      (value: unknown) => {
        if (!validator.isEmail((value as string).toString())) {
          return false;
        }
        return value;
      },
      { message: 'Invalid email' },
    )
    .optional(),
  isActive: z.boolean().optional().optional(),
  hobbies: z.string().array().optional(),
  address: z
    .object({
      street: z.string(),
      city: z.string(),
      country: z.string(),
    })
    .optional(),
});

// console.log(createUserValidationSchema instanceof z.ZodSchema);

export const StudentValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
