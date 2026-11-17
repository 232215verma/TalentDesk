import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
export default function ProtectedRoute({ children, admin = false }) { const { user, loading } = useAuth(); const location = useLocation(); if (loading) return <div className="loading-screen"><span className="brand-mark">l.</span><span>Getting your space ready…</span></div>; if (!user) return <Navigate to="/login" state={{ from: location }} replace />; if (admin && user.role !== 'admin') return <Navigate to="/app" replace />; return children; }
