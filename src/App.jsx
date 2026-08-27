import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import AgentDashboard from './pages/AgentDashboard';
import ReferralLanding from './pages/ReferralLanding';

function ProtectedAgent({ children }) {
  const { isAuthenticated, isAgent, loading } = useAuth();
  if (loading) return <div className="spinner" style={{ marginTop: 120 }} />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAgent) return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetails />} />
        <Route path="/invite/:code" element={<ReferralLanding />} />
        <Route path="/dashboard" element={<ProtectedAgent><AgentDashboard /></ProtectedAgent>} />
        <Route path="/dashboard/*" element={<ProtectedAgent><AgentDashboard /></ProtectedAgent>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)' },
        }} />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
