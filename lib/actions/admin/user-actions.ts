"use server";

import { createUser, deleteUser, getAllUsers, getUserById } from "@/lib/api/admin/user";
import { revalidatePath } from "next/cache";

export const handleGetAllUsers = async (
    page: number,
    size: number,
    search?: string
) => {
    try {
        const response = await getAllUsers(page, size, search);

        if (response.success) {
            return {
                success: true,
                message: response.message,
                users: response.data,
                pagination: response.pagination,
            };
        }

        return {
            success: false,
            message: response.message,
        };
    } catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "Failed to fetch users",
        };
    }
};

export const handleDeleteUser= async (id: string) => {
    try {
        const response = await deleteUser(id);
        if(response.success){
            revalidatePath('/admin/users');
            return {
                success: true,
                message: response.message,
            }
        }
        return {
            success: false,
            message: response.message,
        }
    } catch (error: Error | any) {
        return {
            success: false,
            message: error.message || 'Failed to delete user',
        };
    }
}

export const handleCreateUser = async (data: FormData) => {
    try {
        const response = await createUser(data)
        if (response.success) {
            revalidatePath('/admin/users');
            return {
                success: true,
                message: 'Registration successful',
                data: response.data
            }
        }
        return {
            success: false,
            message: response.message || 'Registration failed'
        }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Registration action failed' }
    }
}

export const handleGetOneUser = async (id: string) => {
    try {
        const response = await getUserById(id);
        if (response.success) {
            return {
                success: true,
                message: 'Get user by id successful',
                data: response.data
            }
        }
        return {
            success: false,
            message: response.message || 'Get user by id failed'
        }
    } catch (error: Error | any) {
        return {
            success: false,
            message: error.message || 'Get user by id action failed'
        }
    }
}
   