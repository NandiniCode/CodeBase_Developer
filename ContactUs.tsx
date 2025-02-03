// ContactUs.tsx
import React from 'react';
import { Typography, TextField, Button, Box, Container } from '@mui/material';

const ContactUs: React.FC = () => {
  return (
    <Container style={{ padding: '2rem', color: 'white' }}>
      <Typography variant="h4" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="body1" paragraph>
        Have questions or need assistance? Feel free to reach out to us!
      </Typography>

      <Box>
        <Typography variant="h6">Email:</Typography>
        <Typography variant="body2">support@umbrellarental.com</Typography>
      </Box>
      <Box>
        <Typography variant="h6">Phone:</Typography>
        <Typography variant="body2">+1 (555) 123-4567</Typography>
      </Box>
      <Box>
        <Typography variant="h6">Address:</Typography>
        <Typography variant="body2">123 Rainy St, Umbrella City, USA</Typography>
      </Box>

      <Box component="form" style={{ marginTop: '2rem' }}>
        <TextField
          label="Your Name"
          variant="outlined"
          fullWidth
          style={{ marginBottom: '1rem', backgroundColor: 'white' }}
        />
        <TextField
          label="Your Email"
          variant="outlined"
          fullWidth
          style={{ marginBottom: '1rem', backgroundColor: 'white' }}
        />
        <TextField
          label="Your Message"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          style={{ marginBottom: '1rem', backgroundColor: 'white' }}
        />
        <Button variant="contained" color="primary">
          Send Message
        </Button>
      </Box>
    </Container>
  );
};

export default ContactUs;
