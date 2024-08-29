import { string, z } from 'zod';

const UserValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Name is must be string',
      required_error: 'Name is required',
    }),
    email: z
      .string({
        invalid_type_error: 'Email is must be string',
        required_error: 'Email is required',
      })
      .email({ message: 'Invalid email format' }),

    password: z.string({
      invalid_type_error: 'password is must be string',
      required_error: 'password is required',
    }),
    phone: z.string({
      invalid_type_error: 'Phone is must be string',
      required_error: 'Phone is required',
    }),
    role: z
      .enum(['admin', 'user'], {
        errorMap: () => ({ message: "Role must be either 'admin' or 'user'" }),
      })
      .optional(),
    address: z.string({
      invalid_type_error: 'Address is must be string',
      required_error: 'Address is required',
    }),
    profilePic: z.string({
      invalid_type_error: 'profilePic is must be string',
      required_error: 'profilePicyy is required',
    }),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: string(),
    password: string(),
  }),
});

export const UserValidation = { UserValidationSchema, loginSchema };
