import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sprout, ShoppingBag, Shield, MousePointer } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/farmer/Dashboard';
import BuyerDashboard from './pages/buyer/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import homePageBackground from './images/homepage.jpg';

// Role-based route guard
function PrivateRoute({ children, roles }) {
  const { user } = useAuth();

  if (user === null) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
}

// Reusable RoleCard component
function RoleCard({ icon: Icon, title, description }) {
  const { user } = useAuth();

  return (
    <div className="card text-center p-4"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // 20% opaque white
        backdropFilter: 'blur(8px)', // Optional: adds frosted glass effect
        borderRadius: '12px',
        padding: '2rem',
        width: '300px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'white',
      }}
    >
      <div className="mb-3">
        <Icon size={40} style={{ color: 'var(--primary)' }} />
      </div>
      <h3 className="mb-2">{title}</h3>
      <p className='mb-4'>{description}</p>
      {!user && (
        <a href="/register" className="btn btn-primary mt-2">
          Register as {title}
        </a>
      )}
    </div>
  );
}

// Home landing page
function Home() {
  return (
    <div style={{
      backgroundImage: `url(${homePageBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>

      <div style={{
        backgroundColor: 'rgba(39, 39, 39, 0.6)', // 60% opaque black
        minHeight: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}></div>

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <h1 className="text-center mb-5" style={{
          fontSize: '2.5rem',
          color: 'white',
          fontWeight: 'bold'
        }}>
          Welcome to Farmer's Marketplace
        </h1>

        <div className="grid" style={{
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <RoleCard
            icon={Sprout}
            title="Farmer"
            description="List your crops and accept the best bids from buyers."
          />
          <RoleCard
            icon={ShoppingBag}
            title="Buyer"
            description="Browse available crops and place competitive bids."
          />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/farmer/*"
            element={
              <PrivateRoute roles={['FARMER']}>
                <FarmerDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/buyer/*"
            element={
              <PrivateRoute roles={['BUYER']}>
                <BuyerDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/*"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
