"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { LoginData, loginSchema } from "../schema";
import { Mail, Lock, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const [pending, startTransition] = useTransition();

  const submit = async (values: LoginData) => {
    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 1000));
      console.log(values);
      router.push("/dashboard");
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

      {/* Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="password"
            {...register("password")}
            placeholder="Enter your password"
            className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-10 pr-10 text-sm outline-none focus:border-[#E87A5D]"
          />
          <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer" />
        </div>

        <div className="text-right">
          <Link
            href="/forgetpassword"
            className="text-xs text-[#E87A5D] hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {errors.password && (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Login Button */}
      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="h-11 w-full rounded-full bg-[#E87A5D] text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
      >
        {isSubmitting || pending ? "Logging in..." : "Login"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <div className="h-px flex-1 bg-gray-200" />
        Or sign in with
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

      {/* Register */}
      <p className="text-center text-xs text-gray-500">
        Don’t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-[#E87A5D] hover:underline"
        >
          Create Account
        </Link>
      </p>
    </form>
  );
}
