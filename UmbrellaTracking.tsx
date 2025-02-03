// UmbrellaTrackingPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Typography, Grid } from '@mui/material';

interface Umbrella {
  id: number;
  barcode: string;
  status: string; // e.g., "Available", "Rented", "Maintenance"
  userName: string; // Name of the user who has rented the umbrella
  location: string; // Location where the umbrella is located
  contact: string; // Contact information of the user
}

const UmbrellaTrackingPage: React.FC = () => {
  const [umbrellas, setUmbrellas] = useState<Umbrella[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUmbrellas = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Umbrella[]>('http://localhost:8080/api/rental-stations/rentedUmbrellas'); // Adjust the API endpoint as needed
        setUmbrellas(response.data);
      } catch (err) {
        setError('Failed to fetch umbrella information.');
        console.error('Error fetching umbrellas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUmbrellas();
  }, []);

  const columns: GridColDef[] = [
    { field: 'barcode', headerName: 'Barcode', width: 400 },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'userName', headerName: 'User Name', width: 150 },
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'contact', headerName: 'Contact', width: 150 },
  ];

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6">{error}</Typography>;
  }

  if (umbrellas.length === 0) {
    return <Typography variant="h6">No umbrellas found.</Typography>;
  }

  return (
    <Grid item xs={12}>
      <Typography variant="h5">Umbrella Tracking</Typography>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={umbrellas}
          columns={columns}
          getRowId={(row) => row.barcode} // Specify the unique identifier
          sx={{
            backgroundColor: 'white',      // Entire grid background
            color: 'black',                // Text color for grid
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'white',     // Header background
              color: 'black',               // Header text color
            },
            '& .MuiDataGrid-cell': {
              color: 'black',               // Cell text color
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: 'white',     // Footer background
              color: 'black',               // Footer text color
            },
          }}
        />
      </div>
    </Grid>
  );
};

export default UmbrellaTrackingPage;
