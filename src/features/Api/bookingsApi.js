import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export const bookingsApi = createApi({
    reducerPath: 'bookingsApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Bookings'],
    endpoints: (builder) => ({
        createBooking: builder.mutation({
            query: (bookingData) => ({
                url: '/bookings',
                method: 'POST',
                body: bookingData,
            }),
            invalidatesTags: ['Bookings'],
        }),
        getMyBookings: builder.query({
            query: () => '/bookings/my-bookings',
            providesTags: ['Bookings'],
        }),
        getSlots: builder.query({
            query: ({ date, service_id }) => ({
                url: '/bookings/slots',
                params: { date, service_id },
            }),
        }),
    }),
});

export const {
    useCreateBookingMutation,
    useGetMyBookingsQuery,
    useGetSlotsQuery
} = bookingsApi;

