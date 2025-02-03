// AboutUs.tsx
import React from 'react';
import { Typography, Container, Box } from '@mui/material';

const AboutUs: React.FC = () => {
  return (
    <Container style={{ padding: '2rem', color: 'white' }}>
      <Typography variant="h4" gutterBottom>
        About Us
      </Typography>
      <Box style={{ marginBottom: '1rem' }}>
        <Typography variant="body1" paragraph>
          Welcome to Umbrella Rental Service! We are dedicated to providing convenient and affordable umbrella rentals for people on the go. Whether you’re caught in a sudden rainstorm or need some shade on a sunny day, our umbrella rental stations are here to keep you covered.
        </Typography>
        <Typography variant="body1" paragraph>
          Our goal is to make umbrellas accessible at all times, in all weather conditions. With rental kiosks located across the city, you can rent an umbrella with just a few clicks and return it at any of our locations.
        </Typography>
        <Typography variant="body1" paragraph>
          Our service is eco-friendly and designed to minimize waste by encouraging reuse. We’re committed to making your day better, rain or shine!
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutUs;
