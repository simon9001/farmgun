import { apiSlice } from './apiSlice';

export const partnersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getActivePartners: builder.query({
            query: () => '/partners/active',
            providesTags: ['Partners'],
        }),
        getFeaturedPartners: builder.query({
            query: () => '/partners/featured',
            providesTags: ['Partners'],
        }),
        adminGetAllPartners: builder.query({
            query: () => '/partners/admin/all',
            providesTags: ['Partners'],
        }),
        createPartner: builder.mutation({
            query: (newPartner) => ({
                url: '/partners',
                method: 'POST',
                body: newPartner,
            }),
            invalidatesTags: ['Partners'],
        }),
        updatePartner: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/partners/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: ['Partners'],
        }),
        deletePartner: builder.mutation({
            query: (id) => ({
                url: `/partners/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Partners'],
        }),
    }),
});

export const {
    useGetActivePartnersQuery,
    useGetFeaturedPartnersQuery,
    useAdminGetAllPartnersQuery,
    useCreatePartnerMutation,
    useUpdatePartnerMutation,
    useDeletePartnerMutation,
} = partnersApi;
