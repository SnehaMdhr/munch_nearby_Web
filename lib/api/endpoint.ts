export const API = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    WHOAMI: '/auth/whoami',
    GOOGLE_LOGIN: "/auth/google-login",
    UPDATEPROFILE: "/auth/update-profile",
    REQUEST_PASSWORD_RESET: "/auth/request-password-reset",
    RESET_PASSWORD: "/auth/reset-password", 
    CHANGE_PASSWORD: "/auth/change-password", 
  },
  ADMIN: {
        Users: {
            GET_ALL: "/admin/users",
            GET_ONE: (id: string) => `/admin/users/${id}`,
            CREATE: "/admin/users/create",
            UPDATE: (id: string) => `/admin/users/${id}`,
            DELETE: (id: string) => `/admin/users/${id}`
        },
        RESTAURANTS: {
          GET_ALL: "restaurant/admin/restaurants",
          APPROVE: (id: string) => `restaurant/admin/restaurants/${id}/approve`,
          REJECT: (id: string) => `restaurant/admin/restaurants/${id}/reject`,
          SUSPEND: (id: string) => `restaurant/admin/restaurants/${id}/suspend`,
          DELETE: (id: string) => `restaurant/admin/restaurants/${id}`,
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
  MENU: {
    GET_ALL: "/menu",
    GET_ONE: (id: string) => `/menu/${id}`,
    GET_BY_RESTAURANT: (restaurantId: string) => `/menu/restaurant/${restaurantId}`,

    OWNER: {
      CREATE: "/menu/create",
      UPDATE: (id: string) => `/menu/update/${id}`,
      DELETE: (id: string) => `/menu/delete/${id}`
    }
  },
  FAVOURITE: {
    ADD: (restaurantId: string) => `/favourite/${restaurantId}`,
    REMOVE: (restaurantId: string) => `/favourite/${restaurantId}`,
    GET_MY: "/favourite/my",
  },
  REVIEW: {
    GET_BY_RESTAURANT: (restaurantId: string) => `/review/restaurant/${restaurantId}`,
    CREATE: (restaurantId: string) => `/review/restaurant/${restaurantId}`,
    UPDATE: (id: string) => `/review/${id}`,
    DELETE: (id: string) => `/review/${id}`,

    OWNER: {
    GET_MY: "/review/owner/my-reviews",
  }
  },
};
