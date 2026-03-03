// Actual backend API calls
import axios from './axios'; // IMPORTANT: axios instance with base URL
import { API } from './endpoint';


export const registerUser = async(registerData: any) => {
    try{
        const response = await axios.post(API.AUTH.REGISTER, registerData);
        return response.data; // response ko body(what backend returns)
    }catch(err: Error | any){
        // if 4xx/5xx error, axios throws error
        throw new Error(
            err.response?.data?.message  // backend error message
            || err.message // general axios error message
            || "Registration failed" // fallback message
        )
    }
}
export const loginuser = async(loginData: any) => {
    try{
        const response = await axios.post(API.AUTH.LOGIN, loginData);
        return response.data; // response ko body(what backend returns)
    }catch(err: Error | any){
        // if 4xx/5xx error, axios throws error
        throw new Error(
            err.response?.data?.message  // backend error message
            || err.message // general axios error message
            || "Login failed" // fallback message
        )
    }
}
export const whoami = async() => {
    try{
        const response = await axios.get(API.AUTH.WHOAMI);
        return response.data;
    }catch(err: Error | any){
        throw new Error(
            err.response?.data?.message  // backend error message
            || err.message // general axios error message
            || "Whoami failed" // fallback message
        )
    }
}

export const updateProfile = async(profileData: any) => {
    try{
        const response = await axios.put(
            API.AUTH.UPDATEPROFILE,
            profileData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data' // for file upload/multer
                }
            }
        );
        return response.data;
    } catch(err: Error | any){
        throw new Error(
            err.response?.data?.message //  backend error message
            || err.message // general axios error message
            || "Update profile failed" // fallback message
        )
    }
}


export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axios.post(API.AUTH.REQUEST_PASSWORD_RESET, { email });
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || 
      err.message ||                
      "Request password reset failed" 
    );
  }
};

// Reset password
export const resetPassword = async (data: {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  try {
    const response = await axios.post(API.AUTH.RESET_PASSWORD, data);
    return response.data; 
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || 
      err.message ||                
      "Reset password failed"       
    );
  }
};
export const googleLogin = async (token: string) => {
  try {
    const response = await axios.post(API.AUTH.GOOGLE_LOGIN, { token });
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message ||
      err.message ||
      "Google login failed"
    );
  }
};

export const changePassword = async (data: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  try {
    const response = await axios.post(
      API.AUTH.CHANGE_PASSWORD,
      data
    );

    return response.data;

  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message ||
      err.message ||
      "Change password failed"
    );
  }
};