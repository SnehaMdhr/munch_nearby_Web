export const API = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    WHOAMI: '/auth/whoami',
    UPDATEPROFILE: "/auth/update-profile",
    REQUEST_PASSWORD_RESET: '/auth/request-password-reset',
    RESET_PASSWORD: (token: string) => `/auth/reset-password/${token}`
  },
  ADMIN: {
        Users: {
            GET_ALL: "/admin/users",
            GET_ONE: (id: string) => `/admin/users/${id}`,
            CREATE: "/admin/users/create",
            UPDATE: (id: string) => `/admin/users/${id}`,
            DELETE: (id: string) => `/admin/users/${id}`
        }
    },
    RESTAURANT: {
    GET_ALL: "/restaurant",
    GET_ONE: (id: string) => `/restaurant/${id}`,

    OWNER: {
      GET_MY: "/restaurant/my-restaurant",
      CREATE: "/restaurant/create",
      UPDATE: "/restaurant/update",
      DELETE: "/restaurant/delete"
    }
  },
};
