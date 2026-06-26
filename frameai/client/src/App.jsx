import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Upload from './pages/Upload';
import Analysis from './pages/Analysis';
import Results from './pages/Results';
import ProductDetail from './pages/ProductDetail';
import Shop from './pages/Shop';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';

const ProtectedRoute = ({ children, adminOnly }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/dashboard" />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="upload" element={<Upload />} />
      <Route path="analyse/:clientId" element={<Analysis />} />
      <Route path="resultats/:analysisId" element={<Results />} />
      <Route path="produit/:id" element={<ProductDetail />} />
      <Route path="boutique" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
      <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
    </Route>
  </Routes>
);

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
