
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

