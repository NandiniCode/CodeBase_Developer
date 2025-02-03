// HomePage.tsx
import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Umbrella Rental Service
      </Typography>
      <Typography variant="body1" paragraph style={{ maxWidth: '600px', margin: '0 auto' }}>
        Experience convenience at its best! Whether it’s a sudden rainstorm or a sunny day, 
        our umbrellas are here to keep you comfortable. Rent an umbrella in seconds and return it 
        at any of our convenient locations around the city. Eco-friendly, hassle-free, and affordable.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/about')}
        style={{ margin: '1rem' }}
      >
        Learn More About Us
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate('/main')}
        style={{ margin: '1rem' }}
      >
        Start Renting Now
      </Button>
    </Box>
  );
};

export default HomePage;
