import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { isTokenExpired } from './helper';

function ProtectedRoute({ element }) {
    const { isAuthenticated, token } = useSelector((state) => state.auth);

    return isAuthenticated && !isTokenExpired(token) ? element : <Navigate to={`/login`} />;
};

export default ProtectedRoute;
