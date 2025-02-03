import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Typography, Grid } from '@mui/material';

interface Umbrella {
  id: number;
  barcode: string;
}

interface RentalInfo {
  id: number;
  duration: number;
  cost: number;
  umbrella: Umbrella;
}

interface DataGridRow extends RentalInfo {
  barcode: string;
}

const RentalInfoTable: React.FC = () => {
  const [rentalInfoList, setRentalInfoList] = useState<DataGridRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchRentalInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get<RentalInfo[]>('http://localhost:8080/api/rentals', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const formattedData = response.data.map((rentalInfo) => ({
          ...rentalInfo,
          barcode: rentalInfo.umbrella.barcode,
        }));
        setRentalInfoList(formattedData);
      } catch (err) {
        setError('Failed to fetch rental information.');
        console.error('Error fetching rental info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRentalInfo();
  }, [token]);

  const columns: GridColDef[] = [
    { field: 'barcode', headerName: 'Barcode', width: 450 },
    { field: 'duration', headerName: 'Rental Duration (hours)', width: 150 },
    { field: 'cost', headerName: 'Total Cost ($)', width: 150 },
  ];

  if (loading) {
    return <Typography variant="h6" style={{ color: 'white' }}>Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" style={{ color: 'white' }}>{error}</Typography>;
  }

  if (rentalInfoList.length === 0) {
    return <Typography variant="h6" style={{ color: 'black' }}>No rental information available.</Typography>;
  }

  return (
    <Grid item xs={12}>
      <div style={{ height: 400, width: '100%', backgroundColor: '#fff' }}>
        <DataGrid
          rows={rentalInfoList}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          checkboxSelection
          autoHeight
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#ffffff', // Set header background to white
              color: '#333', // Set header text color to dark for contrast
              fontWeight: 'bold',
            },
            '& .MuiDataGrid-cell': {
              backgroundColor: '#ffffff', // Set cell background to white
              color: '#000', // Set cell text color to dark
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: '#ffffff', // Set footer background to white
            },
          }}
        />
      </div>
    </Grid>
  );
};

export default RentalInfoTable;
