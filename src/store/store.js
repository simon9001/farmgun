import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authReducer from '../features/Slice/AuthSlice';
import { authApi } from '../features/Api/authApi';
import { servicesApi } from '../features/Api/servicesApi';
import { bookingsApi } from '../features/Api/bookingsApi';
import { publicApi } from '../features/Api/publicApi';
import { notificationsApi } from '../features/Api/notificationsApi';
import { adminApi } from '../features/Api/adminApi';

const rootReducer = combineReducers({
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
    [bookingsApi.reducerPath]: bookingsApi.reducer,
    [publicApi.reducerPath]: publicApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
});

export const store = configureStore({
    reducer: persistReducer({ key: 'root', storage, whitelist: ['auth'] }, rootReducer),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Required for redux-persist
        }).concat(
            authApi.middleware,
            servicesApi.middleware,
            bookingsApi.middleware,
            publicApi.middleware,
            notificationsApi.middleware,
            adminApi.middleware
        ),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

