import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Users', 'Dashboard', 'Tips'],
    endpoints: (builder) => ({
        // Dashboard stats
        getDashboardStats: builder.query({
            query: () => '/admin/dashboard/stats',
            providesTags: ['Dashboard'],
        }),

        // Get all users
        getAllUsers: builder.query({
            query: ({ limit = 50, offset = 0 } = {}) => ({
                url: '/admin/users',
                params: { limit, offset },
            }),
            providesTags: ['Users'],
        }),

        // Get user details
        getUserDetails: builder.query({
            query: (id) => `/admin/users/${id}`,
        }),

        // Update user role
        updateUserRole: builder.mutation({
            query: ({ id, role }) => ({
                url: `/admin/users/${id}/role`,
                method: 'PATCH',
                body: { role },
            }),
            invalidatesTags: ['Users'],
        }),

        // Tips management
        createTip: builder.mutation({
            query: (tip) => ({
                url: '/admin/tips',
                method: 'POST',
                body: tip,
            }),
            invalidatesTags: ['Tips'],
        }),

        updateTip: builder.mutation({
            query: ({ id, ...tip }) => ({
                url: `/admin/tips/${id}`,
                method: 'PATCH',
                body: tip,
            }),
            invalidatesTags: ['Tips'],
        }),

        deleteTip: builder.mutation({
            query: (id) => ({
                url: `/admin/tips/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Tips'],
        }),
    }),
});

export const {
    useGetDashboardStatsQuery,
    useGetAllUsersQuery,
    useGetUserDetailsQuery,
    useUpdateUserRoleMutation,
    useCreateTipMutation,
    useUpdateTipMutation,
    useDeleteTipMutation,
} = adminApi;
