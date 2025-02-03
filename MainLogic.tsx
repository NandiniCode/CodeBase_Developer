// MainLogic.tsx
import React, { useState } from 'react';
import { Typography, Button } from '@mui/material';
import Login from './Login';
import Register from './Register';
import AdminDashboard from './AdminDashBoard';
import ConsumerDashboard from './ConsumerDashboard';

interface MainLogicProps {
  role: string | null;
}

const MainLogic: React.FC<MainLogicProps> = ({ role }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(true);

  const handleRegistrationSuccess = () => {
    setIsLoggingIn(true);
  };

  return (
    <>
      {!role ? (
        <div style={{ textAlign: 'center', color: '#e0e0e0' }}>
          {isLoggingIn ? (
            <>
              <Typography variant="h5" style={{ marginBottom: '1rem', color: '#f44336' }}>
                Login
              </Typography>
              <Login onLogin={role => role} />
              <p style={{ color: '#f44336' }}>
                Don't have an account?{' '}
                <Button color="secondary" onClick={() => setIsLoggingIn(false)}>
                  Register
                </Button>
              </p>
            </>
          ) : (
            <>
              <Typography variant="h5" style={{ marginBottom: '1rem', color: '#f44336' }}>
                Register
              </Typography>
              <Register onRegisterSuccess={handleRegistrationSuccess} />
              <p style={{ color: '#f44336' }}>
                Already have an account?{' '}
                <Button color="secondary" onClick={() => setIsLoggingIn(true)}>
                  Login
                </Button>
              </p>
            </>
          )}
        </div>
      ) : role === 'admin' ? (
        <AdminDashboard />
      ) : (
        <ConsumerDashboard />
      )}
    </>
  );
};

export default MainLogic;