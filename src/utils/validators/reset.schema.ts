import { z } from 'zod';
import { messages } from '@/config/messages';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '@/utils/validators/common-rules';

// form zod validation schema
export const resetPasswordSchema1 = z
  .object({
    // email: validateEmail,
    password: validatePassword,
    confirmPassword: validateConfirmPassword,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: messages.passwordsDidNotMatch,
    path: ['confirmPassword'], // Correct path for the confirmedPassword field
  });

// generate form types from zod validation schema
export type ResetPasswordSchema1 = z.infer<typeof resetPasswordSchema1>;
