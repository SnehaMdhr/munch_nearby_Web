"use server";

import { getAllUsers } from "@/lib/api/admin/user";

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
