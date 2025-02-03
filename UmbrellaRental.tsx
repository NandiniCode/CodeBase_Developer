import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import './UmbrellaRental.css';
import {
  Container,
  Typography,
  Grid,
  Button,
  TextField,
  FormControl,
  Snackbar,
  Alert,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material';
import UmbrellaReturn from './UmbrellaReturn';

interface Station {
  id: number;
  name: string;
  location: string;
  availableUmbrellas: number;
}

interface Umbrella {
  id: number;
  barcode: string;
  status: string;
}

interface RentalInfo {
  umbrella: {
    id: number;
    barcode: string;
  };
  duration: number;
  cost: number;
  startTime: string;
}

interface Transaction {
  umbrella: Umbrella;
  startTime: string;
  duration: number;
}

const UmbrellaRental: React.FC = () => {
  const [barcode, setBarcode] = useState<string>('');
  const [stations, setStations] = useState<Station[]>([]);
  const [umbrellas, setUmbrellas] = useState<Umbrella[]>([]);
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [rentedUmbrellas, setRentedUmbrellas] = useState<Transaction[]>([]);
  const [rentalInfo, setRentalInfo] = useState<RentalInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [selectedRentedUmbrella, setSelectedRentedUmbrella] = useState<number | null>(null);

  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    fetchStations();
    fetchRentedUmbrellas();
  }, []);

  const fetchRentedUmbrellas = async () => {
    try {
      if (!token) {
        console.error('Authorization token is missing');
        return;
      }

      const response = await axios.get<Transaction[]>('http://localhost:8080/api/rentals/inProgressRentalInfo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setRentedUmbrellas(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch rented umbrellas:', error);
    }
  };

  const fetchStations = async () => {
    try {
      const response = await axios.get<Station[]>('http://localhost:8080/api/rental-stations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStations(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  const handleStationChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    const stationId = Number(event.target.value);
    setSelectedStation(stationId);
    setBarcode('');
    setUmbrellas([]); // Clear the umbrella list when changing station

    if (stationId) {
      try {
        const response = await axios.get<Umbrella[]>(`http://localhost:8080/api/rental-stations/available/${stationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUmbrellas(response.data); // Set the umbrellas when a station is selected
      } catch (error) {
        console.error('Error fetching umbrellas:', error);
      }
    }
  };

  const reloadUmbrellasList = async (stationId : number) => {
    setSelectedStation(stationId);
    setBarcode('');
    setUmbrellas([]); // Clear the umbrella list when changing station

    if (stationId) {
      try {
        const response = await axios.get<Umbrella[]>(`http://localhost:8080/api/rental-stations/available/${stationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUmbrellas(response.data); // Set the umbrellas when a station is selected
      } catch (error) {
        console.error('Error fetching umbrellas:', error);
      }
    }
  };

  const handleScan = (event: ChangeEvent<HTMLInputElement>) => {
    setBarcode(event.target.value);
  };

  const startRental = async () => {
    try {
      if (barcode && selectedStation !== null) {
        const response = await axios.post<RentalInfo>(
          'http://localhost:8080/api/rentals/rent',
          { barcode },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setErrorMessage('');
        setSnackbarOpen(true);
        localStorage.setItem('rentalInfo', JSON.stringify(response.data));
        fetchStations();
        fetchRentedUmbrellas(); // Refresh the rented umbrellas list
        setBarcode('');
        reloadUmbrellasList(selectedStation);
      } else {
        alert('Please select a rental station and scan a valid barcode.');
      }
    } catch (error) {
      setErrorMessage('Unable to start rental. Please try again.');
      console.error(error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }} className="umbrella-rental-container">
      <Typography variant="h4" component="h1" gutterBottom className="text-white">
        Umbrella Rental Service
      </Typography>

      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={8}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="Select Rental Station"
              select
              value={selectedStation ?? ''}
              onChange={handleStationChange}
              fullWidth
              SelectProps={{
                MenuProps: { PaperProps: { style: { maxHeight: 200, overflowY: 'auto' } } },
              }}
            >
              <MenuItem value="" className="text-white">
                <em>Select Rental Station</em>
              </MenuItem>
              {stations.map((station) => (
                <MenuItem key={station.id} value={station.id} className="text-white">
                  {station.name} - {station.location} (Available: {station.availableUmbrellas})
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>

        {selectedStation && umbrellas.length > 0 && (
          <Grid item xs={12} sm={8}>
            <Typography variant="h6" className="text-white">Available Umbrellas</Typography>
            <Grid container spacing={2}>
              {umbrellas.map((umbrella) => (
                <Grid item xs={12} sm={6} md={4} key={umbrella.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" className="text-white">{umbrella.barcode}</Typography>
                      <Typography className="text-white">Status: {umbrella.status}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}

        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Scan umbrella barcode"
            value={barcode}
            onChange={handleScan}
            variant="outlined"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={startRental}
            style={{ marginTop: '1rem', width: '100%' }}
          >
            Rent Umbrella
          </Button>
        </Grid>

        {errorMessage && (
          <Grid item xs={12} sm={8}>
            <Alert severity="error" className="text-white">{errorMessage}</Alert>
          </Grid>
        )}

        {/* Centering the UmbrellaReturn component */}
        <Grid container justifyContent="center" alignItems="center">
          <UmbrellaReturn
            rentedUmbrellas={rentedUmbrellas} 
            setErrorMessage={setErrorMessage}
            token={token}
            selectedRentedUmbrella={selectedRentedUmbrella}  
            setSelectedRentedUmbrella={setSelectedRentedUmbrella}  
            stations={stations}  
            selectedStation={selectedStation}  
            setSelectedStation={setSelectedStation}  
            fetchRentedUmbrellas= {fetchRentedUmbrellas}
          />
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Umbrella rented successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UmbrellaRental;
