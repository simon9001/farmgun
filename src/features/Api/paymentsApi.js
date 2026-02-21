import { apiSlice } from './apiSlice';

export const paymentsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        initiatePayment: builder.mutation({
            query: (paymentData) => ({
                url: '/payments/initiate',
                method: 'POST',
                body: paymentData,
            }),
        }),
        verifyPayment: builder.mutation({
            query: (data) => ({
                url: '/payments/verify',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Bookings'],
        }),
        getPaymentHistory: builder.query({
            query: () => '/payments/history',
        }),
    }),
});

export const {
    useInitiatePaymentMutation,
    useVerifyPaymentMutation,
    useGetPaymentHistoryQuery
} = paymentsApi;
