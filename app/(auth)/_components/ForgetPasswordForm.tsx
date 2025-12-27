"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { ForgetPasswordData, forgetPasswordSchema } from "../schema";

export default function ForgotPasswordForm() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgetPasswordData>({
        resolver: zodResolver(forgetPasswordSchema),
    });

    const [pending, startTransition] = useTransition();

    const submit = async (values: ForgetPasswordData) => {
        startTransition(async () => {
        await new Promise((r) => setTimeout(r, 1000));
        console.log("Reset email:", values.email);

        router.push("/login");
        });
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

        {/* Submit */}
        <button
            type="submit"
            disabled={isSubmitting || pending}
            className="h-11 w-full rounded-full bg-[#E87A5D] text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
            {isSubmitting || pending ? "Sending link..." : "Send Reset Link"}
        </button>

        {/* Back to login */}
        <p className="text-center text-xs text-gray-500">
            Remembered your password?{" "}
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
