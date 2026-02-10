import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const UserSchema = z
  .object({
    email: z.string().email({ message: "Enter a valid email" }),

    password: z.string().min(6, { message: "Minimum 6 characters" }),

    confirmPassword: z.string().min(6, { message: "Minimum 6 characters" }),

    name: z.string().optional(),

    // ✅ FIXED ENUM
    role: z.enum(["Customer", "Restaurant Owner", "admin"]),

    imageUrl: z
      .instanceof(File)
      .optional()
      .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
        message: "Max file size is 5MB",
      })
      .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: "Only .jpg, .jpeg, .png formats are supported",
      }),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type UserData = z.infer<typeof UserSchema>;

export const UserEditSchema = UserSchema.partial();
export type UserEditData = z.infer<typeof UserEditSchema>;
