import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export const servicesApi = createApi({
    reducerPath: 'servicesApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Services'],
    endpoints: (builder) => ({
        getServices: builder.query({
            query: () => '/services',
            providesTags: ['Services'],
        }),
        // Add mutations if needed for admin, but for now just viewing
    }),
});

export const { useGetServicesQuery } = servicesApi;
