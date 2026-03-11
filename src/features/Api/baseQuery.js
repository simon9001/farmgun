import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { logout } from '../Slice/AuthSlice'; // Adjust path if needed
import { apiDomain } from '../../apiDomain/apiDomain';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
    baseUrl: apiDomain,
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
    // wait until the mutex is available without locking it
    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            try {
                // If we get a 401, it means the token is invalid or expired.
                // Since the backend doesn't support refresh tokens yet, 
                // we should just log the user out.
                localStorage.setItem('sessionExpired', 'true');
                api.dispatch(logout());

                // We don't need to do anything else here as the protected routes 
                // (UserRoute/AdminRoute) will detect the change in isAuthenticated 
                // and redirect the user automatically.
            } finally {
                release();
            }
        } else {
            // Wait for the first 401 handler to finish (which will logout the user)
            await mutex.waitForUnlock();
            // After logout, subsequent calls will fail anyway, which is fine.
            result = await baseQuery(args, api, extraOptions);
        }
    }
    return result;
};
