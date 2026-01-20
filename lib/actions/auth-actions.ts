"use server";
import { loginuser, registerUser } from "../api/auth";
import { setAuthToken, setUserData } from "../cookie";
export const handleRegister = async (formData: any) => {
  try {
    const res = await registerUser(formData);
    if (res.success) {
      return {
        success: true,
        data: res.data,
        message: "Registration successful",
      };
    }
    return { success: false, message: res.message || "Registration failed" };
  } catch (err: Error | any) {
    return { success: false, message: err.message || "Registration failed" };
  }
};

export const handleLogin = async (formData: any) => {
  try {
    const res = await loginuser(formData);
    if (res.success) {
      await setAuthToken(res.token);
      await setUserData(res.data);
      return {
        success: true,
        data: res.data,
        message: "Login successful",
      };
    }
    return { success: false, message: res.message || "Login failed" };
  } catch (err: Error | any) {
    return { success: false, message: err.message || "Login failed" };
  }
};
