import axiosInstance from "./axios";
import { API } from "./endpoint";



// Get all restaurants
export const getAllRestaurants = async () => {
    try {
        const response = await axiosInstance.get(API.RESTAURANT.GET_ALL);
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Fetching restaurants failed"
        );
    }
};


// Get restaurant by ID
export const getRestaurantById = async (id: string) => {
    try {
        const response = await axiosInstance.get(API.RESTAURANT.GET_ONE(id));
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Fetching restaurant failed"
        );
    }
};


// Get my restaurant
export const getMyRestaurant = async () => {
    try{
        const response = await axiosInstance.get(API.RESTAURANT.OWNER.GET_MY);
        return response.data;
    }catch(err: Error | any){
        throw new Error(
            err.response?.data?.message  // backend error message
            || err.message // general axios error message
            || "Get My Restaurant failed" // fallback message
        )
    }
};


// Create restaurant
export const createRestaurant = async (restaurantData: FormData) => {
     try{
        const response = await axiosInstance.post(
            API.RESTAURANT.OWNER.CREATE,
            restaurantData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data; // response ko body(what backend returns)
    }catch(err: Error | any){
        // if 4xx/5xx error, axios throws error
        throw new Error(
            err.response?.data?.message  // backend error message
            || err.message // general axios error message
            || "Restaurant Creation failed" // fallback message
        )
    }
};


// Update restaurant
export const updateRestaurant = async (restaurantData: FormData) => {
    try {
        const response = await axiosInstance.put(
            API.RESTAURANT.OWNER.UPDATE,
            restaurantData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Updating restaurant failed"
        );
    }
};


// Delete restaurant
export const deleteRestaurant = async () => {
    try {
        const response = await axiosInstance.delete(
            API.RESTAURANT.OWNER.DELETE
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Deleting restaurant failed"
        );
    }
};

