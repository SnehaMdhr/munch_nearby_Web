import z from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "Enter your valid email" }),
  password: z.string().min(6, { message: "Minimum 6 characters" }),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.email({ message: "Enter your valid email" }),
    role: z.enum(["Customer", "Restaurant Owner"]),
    password: z.string().min(6, { message: "Minimum 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Minimum 6 characters" }),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })
  .refine((data) => data.role !== undefined, {
    path: ["role"],
    message: "Role is required",
  });

export type RegisterData = z.infer<typeof registerSchema>;

export const requestResetSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export type RequestResetData = z.infer<typeof requestResetSchema>;

export const resetPasswordSchema = z
  .object({
    email: z.string().email("Enter a valid email"),
    otp: z.string().min(4, "Enter valid OTP"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
