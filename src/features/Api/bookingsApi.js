import { apiSlice } from './apiSlice';

export const bookingsApi = apiSlice.injectEndpoints({
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
            query: () => '/bookings',
            providesTags: ['Bookings'],
        }),
        getBooking: builder.query({
            query: (id) => `/bookings/${id}`,
            providesTags: (result, error, id) => [{ type: 'Bookings', id }],
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
    useGetBookingQuery,
    useGetSlotsQuery
} = bookingsApi;



