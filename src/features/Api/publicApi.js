import { apiSlice } from './apiSlice';

export const publicApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPublicCrops: builder.query({
            query: (params) => ({
                url: '/public/crops',
                params,
            }),
            providesTags: ['Crops'],
        }),
        getPublicProjects: builder.query({
            query: (params) => ({
                url: '/public/projects',
                params,
            }),
            providesTags: ['Projects'],
        }),
        getPublicTestimonials: builder.query({
            query: (params) => ({
                url: '/public/testimonials',
                params,
            }),
            providesTags: ['Dashboard'], // Testimonials are managed in dashboard
        }),
        getPublicServices: builder.query({
            query: (params) => ({
                url: '/public/services',
                params
            }),
            providesTags: ['Services'],
        }),
        getPublicTips: builder.query({
            query: (params) => ({
                url: '/public/tips',
                params
            }),
            providesTags: ['Tips'],
        }),
        createTestimonial: builder.mutation({
            query: (testimonial) => ({
                url: '/public/testimonials',
                method: 'POST',
                body: testimonial,
            }),
            invalidatesTags: ['Dashboard'],
        }),
    }),
});

export const {
    useGetPublicCropsQuery,
    useGetPublicProjectsQuery,
    useGetPublicTestimonialsQuery,
    useGetPublicServicesQuery,
    useGetPublicTipsQuery,
    useCreateTestimonialMutation,
} = publicApi;


