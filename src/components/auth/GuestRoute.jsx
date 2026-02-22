import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../features/Slice/AuthSlice';

const GuestRoute = ({ children }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const location = useLocation();

    if (isAuthenticated) {
        // Redirect to dashboard if already logged in
        // If there's a 'from' location in state, we could use that, 
        // but usually dashboard is the best default for logged in users.
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default GuestRoute;
