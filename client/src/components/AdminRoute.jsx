import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user } = useAuth();

  // Check if user exists and has admin or superadmin role
  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;
