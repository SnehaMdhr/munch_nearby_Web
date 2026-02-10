
import axios from "../axios" // import from instance
import { API } from "../endpoint";

export const getAllUsers = async (
    page: number,size: number, search?: string
) => {
    try{
        const response = await axios.get(
            API.ADMIN.Users.GET_ALL, 
            {
                params: {
                    page,
                    size,
                    search
                }
            });
        return response.data;
    }catch(error: Error | any){
        throw new Error(error?.response?.data?.message || error.message);
    }
}

export const deleteUser = async (id: string) => {   
    try{
        const response = await axios.delete(API.ADMIN.Users.DELETE(id));
        return response.data;
    }catch(error: Error | any){
        throw new Error(error?.response?.data?.message || error.message);
    }
}

export const createUser = async (userData: any) => {
    try {
        const response = await axios.post(
            API.ADMIN.Users.CREATE,
            userData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data', // for file upload/multer
                }
            }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Create user failed');
    }
}

export const getUserById = async (id: string) => {
    try {
        const response = await axios.get(
            API.ADMIN.Users.GET_ONE(id)
        );
        return response.data;
    }
    catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Get user by id failed');
    }
}
