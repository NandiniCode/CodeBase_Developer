import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import umbrellaImage from './assets/umbrella.jpeg';
import PaymentPage from './PaymentPage';
import MainLogic from './MainLogic';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';
import HomePage from './HomePage';
import UserProfilePage from './UserProfilePage';
import UmbrellaTrackingPage from './UmbrellaTracking';
import RentalStationList from './RentalStationList';
import UmbrellaRental from './UmbrellaRental';

interface LayoutProps {
  role: string | null;
  setRole: (role: string | null) => void;
}

const Layout: React.FC<LayoutProps> = ({ role, setRole }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/main');
  };

  const handleLogout = () => {
    setRole(null);
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleTrackingClick = () => {
    navigate('/umbrella-tracking');
  };

  const handleRentalStationClick = () => {
    navigate('/rental-stations');
  };

  const handleUmbrellaRentalClick = () => {
    navigate('/umbrella-rental');
  };

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
        <Toolbar style={{ justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0)' }}>
          <img src={umbrellaImage} alt="Umbrella" style={{ width: '80px', marginRight: '10px' }} />
          <Typography variant="h5" sx={{ flexGrow: 1, textAlign: 'center', color: 'white' }}>
            Umbrella Rental Service
          </Typography>
          <Button style={{ color: '#ffffff' }} href="/">Home</Button>
          <Button style={{ color: '#ffffff' }} href="/about">About Us</Button>
          <Button style={{ color: '#ffffff' }} href="/contact">Contact Us</Button>

          {role === 'consumer' && (
            <>
              <Button style={{ color: '#ffffff' }} onClick={handleProfileClick}>Profile</Button>
              <Button style={{ color: '#ffffff' }} onClick={handleUmbrellaRentalClick}>Rent an Umbrella</Button>
            </>
          )}

          {role === 'admin' && (
            <>
              <Button style={{ color: '#ffffff' }} onClick={handleRentalStationClick}>Rental Station</Button>
              <Button style={{ color: '#ffffff' }} onClick={handleTrackingClick}>Umbrella Tracking</Button>
            </>
          )}

          {role ? (
            <Button style={{ color: '#ffffff' }} onClick={handleLogout}>Logout</Button>
          ) : (
            <Button style={{ color: '#ffffff' }} onClick={handleLoginClick}>Login</Button>
          )}
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="lg"
        className="container"
        style={{
          marginTop: '2rem',
          minHeight: '400px',
          overflowY: 'auto',
          maxHeight: '80vh',
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/main" element={<MainLogic role={role} />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/umbrella-tracking" element={<UmbrellaTrackingPage />} />
          <Route path="/rental-stations" element={role === 'admin' ? <RentalStationList /> : <Navigate to="/" />} />
          <Route path="/umbrella-rental" element={role === 'consumer' ? <UmbrellaRental /> : <Navigate to="/" />} />

          {/* Default route based on role */}
          {role === 'admin' && <Route path="*" element={<Navigate to="/rental-stations" />} />}
          {role === 'consumer' && <Route path="*" element={<Navigate to="/umbrella-rental" />} />}
        </Routes>
      </Container>
    </>
  );
};

export default Layout;
