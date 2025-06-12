// src/routes/AdminRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
    const { isAuthenticated, userData } = useAuth();

    if (!isAuthenticated)
        return <Navigate to="/login" replace />
    else
        if (userData?.role.roleName !== 'ADMIN') return <Navigate to="/" replace />;

    return <Outlet />;
};

export default AdminRoute;
