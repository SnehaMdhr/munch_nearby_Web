import axios from "axios";
import { API } from "./endpoint";



// Get all restaurants
export const getAllRestaurants = async () => {
    try {
        const response = await axios.get(API.RESTAURANT.GET_ALL);
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
        const response = await axios.get(API.RESTAURANT.GET_ONE(id));
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
        const response = await axios.get(API.RESTAURANT.OWNER.GET_MY);
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
    try {
        const response = await axios.post(
            API.RESTAURANT.OWNER.CREATE,
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
            "Creating restaurant failed"
        );
    }
};


// Update restaurant
export const updateRestaurant = async (restaurantData: FormData) => {
    try {
        const response = await axios.put(
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
        const response = await axios.delete(
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

