import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export const publicApi = createApi({
    reducerPath: 'publicApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getPublicCrops: builder.query({
            query: (params) => ({
                url: '/public/crops',
                params,
            }),
        }),
        getPublicProjects: builder.query({
            query: (params) => ({
                url: '/public/projects',
                params,
            }),
        }),
        getPublicTestimonials: builder.query({
            query: (params) => ({
                url: '/public/testimonials',
                params,
            }),
        }),
        getPublicServices: builder.query({
            query: (params) => ({
                url: '/public/services',
                params
            })
        }),
        getPublicTips: builder.query({
            query: (params) => ({
                url: '/public/tips',
                params
            })
        })
    }),
});

export const {
    useGetPublicCropsQuery,
    useGetPublicProjectsQuery,
    useGetPublicTestimonialsQuery,
    useGetPublicServicesQuery,
    useGetPublicTipsQuery
} = publicApi;

