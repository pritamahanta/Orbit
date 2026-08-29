import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useSelector((store) => store.auth);
    const location = useLocation();

    // Wait until authentication state is initialized
    if (loading) {
        return <div>Loading...</div>;
    }

    // User is not authenticated
    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // User is authenticated but doesn't have permission
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};