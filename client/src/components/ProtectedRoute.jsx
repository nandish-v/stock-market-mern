import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function ProtectedRoute(){const {user,loading}=useAuth();if(loading)return <div className="auth-page"><div className="auth-card">Loading…</div></div>;return user?<Outlet/>:<Navigate to="/login" replace/>;}
