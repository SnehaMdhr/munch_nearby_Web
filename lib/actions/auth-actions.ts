"use server";
import { revalidatePath } from "next/cache";
import { loginuser, registerUser, updateProfile, whoami } from "../api/auth";
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
}

export const handleWhoAmI = async () => {
    try {
        const res = await whoami();
        if (res.success) {
            return {
                success: true,
                data: res.data,
            };
        }
        return { success: false, message: res.message || "Whoami failed" };
    }catch (err: Error | any) {
        return { success: false, message: err.message || "Whoami failed" };
    }
}

export const handleUpdateProfile = async(formData: any)=>{
    try{
        const res = await updateProfile(formData);
        if(res.success){
            await setUserData(res.data); //update cookie user data
            revalidatePath("/user/profile"); //revalidate profile page/ new data
            return {
                success: true, 
                data: res.data,
                message: "Profile Updated successfully "
            };
        }
        return { success: false, message: res.message || "Update profile failed"};
    }catch (err: Error | any){
        return { success: false, message: err.message ||"Update profile failed"};
    }
}
