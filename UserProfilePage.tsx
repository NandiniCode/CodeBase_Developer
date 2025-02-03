import React, { useState, useEffect } from 'react';
import { Grid, Typography, Paper } from '@mui/material';
import RentalInfoTable from './RentalInfoTable'; // Adjust the path according to your folder structure
import axios from 'axios';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  // Add other fields as necessary
}

const UserProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get<UserProfile>('http://localhost:8080/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserProfile(response.data);
      } catch (err) {
        setError('Failed to fetch user profile.');
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserProfile();
    } else {
      setError('No authentication token found.');
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return <Typography variant="h6" style={{ color: 'white' }}>Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" style={{ color: 'white' }}>{error}</Typography>;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>User Profile</Typography>
      </Grid>

      {userProfile && (
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, backgroundColor: '#2a2a2a' }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>Profile Information</Typography>
            <Typography variant="body1" sx={{ color: 'white' }}>
              Welcome {userProfile.username}
            </Typography>
            {/* Add more fields as necessary */}
          </Paper>
        </Grid>
      )}

      <Grid item xs={12}>
        <Typography variant="h5" sx={{ color: 'white', mt: 3 }}>Rental History</Typography>
        <RentalInfoTable />
      </Grid>
    </Grid>
  );
};

export default UserProfilePage;
