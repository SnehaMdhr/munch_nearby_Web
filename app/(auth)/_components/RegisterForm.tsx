"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { RegisterData, registerSchema } from "../schema";
import { Mail, Lock, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
    });
    const [pending, startTransition] = useTransition();
    const submit = async (values: RegisterData) => {
        startTransition(async () => {
            await new Promise((r) => setTimeout(r, 1000));
            console.log(values);
            router.push("/login");
        });
        console.log("register", values);
    };
    return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
        {/* Email */}
        <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-10 pr-3 text-sm outline-none focus:border-[#E87A5D]"
                />
            </div>
            {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
                )}
        </div>

        {/* Role */}
        <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <div className="flex gap-4">
            {["Customer", "Restaurant Owner"].map((role) => (
                <label
                key={role}
                className="flex items-center gap-2 text-sm cursor-pointer"
                >
                <input
                    type="radio"
                    value={role}
                    {...register("role")}
                    className="accent-[#E87A5D]"
                />
                {role}
                </label>
            ))}
            </div>
            {errors.role && (
            <p className="text-xs text-red-600">{errors.role.message}</p>
            )}
        </div>

        {/* Password */}
        <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
                type="password"
                {...register("password")}
                placeholder="Create password"
                className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-10 pr-10 text-sm outline-none focus:border-[#E87A5D]"
            />
            <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {errors.password && (
            <p className="text-xs text-red-600">{errors.password.message}</p>
            )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
                type="password"
                {...register("confirmPassword")}
                placeholder="Confirm password"
                className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-10 pr-3 text-sm outline-none focus:border-[#E87A5D]"
            />
            </div>
            {errors.confirmPassword && (
            <p className="text-xs text-red-600">
                {errors.confirmPassword.message}
            </p>
            )}
        </div>

        {/* Register Button */}
        <button
            type="submit"
            disabled={isSubmitting || pending}
            className="h-11 w-full rounded-full bg-[#E87A5D] text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
            {isSubmitting || pending ? "Creating account..." : "Create Account"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="h-px flex-1 bg-gray-200" />
            Or sign up with
            <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Google */}
        <div className="flex justify-center">
            <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50"
            >
            <img src="/images/google.png" alt="Google" className="h-5 w-5" />
            </button>
        </div>

        {/* Login Link */}
        <p className="text-center text-xs text-gray-500">
            Already have an account?{" "}
            <Link
            href="/login"
            className="font-semibold text-[#E87A5D] hover:underline"
            >
            Login
            </Link>
        </p>
        </form>
    );
    }
