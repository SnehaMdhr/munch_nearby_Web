export const API = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    WHOAMI: '/auth/whoami',
    UPDATEPROFILE: "/auth/update-profile",
  },
  ADMIN: {
        Users: {
            GET_ALL: "/admin/users",
            GET_ONE: (id: string) => `/admin/users/${id}`,
            CREATE: "/admin/users/create",
            UPDATE: (id: string) => `/admin/users/${id}`,
            DELETE: (id: string) => `/admin/users/${id}`
        }
    }
};
