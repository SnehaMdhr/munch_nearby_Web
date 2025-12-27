import z from "zod";

export const loginSchema = z.object({
    email: z.email({ message: "Enter your valid email" }),
    password: z.string().min(6, { message: "Minimum 6 characters" }),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    email: z.email({ message: "Enter your valid email" }),
    role: z.enum(["Customer", "Restaurant Owner"],),
    password: z.string().min(6, { message: "Minimum 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Minimum 6 characters" }),
}).refine((v) => v.password === v.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
}).refine((data) => data.role !== undefined, {
  path: ["role"],
  message: "Role is required",
});

export type RegisterData = z.infer<typeof registerSchema>;

export const forgetPasswordSchema = z.object({
    email:z.email({message: "Enter a valid email"}),
});

export type ForgetPasswordData = z.infer<typeof forgetPasswordSchema>;