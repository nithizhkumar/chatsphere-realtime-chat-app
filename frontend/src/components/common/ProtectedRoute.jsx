import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { user, isRestoring } = useAuth();

  if (isRestoring) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-navy-950">
        <LoadingSpinner size="lg" label="Restoring your session" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
