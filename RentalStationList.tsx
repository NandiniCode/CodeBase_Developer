import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css'; // Import your CSS file

interface RentalStation {
  id: number;
  name: string;
  location: string;
  availableUmbrellas: number;
}

const RentalStationList: React.FC = () => {
  const [stations, setStations] = useState<RentalStation[]>([]);
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [availableUmbrellas, setAvailableUmbrellas] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingStation, setEditingStation] = useState<RentalStation | null>(null); // State for editing a station

  // Fetch the token from localStorage
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    fetchRentalStations();
  }, []);

  // Set up Axios request config with Authorization header
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`, // Attach the token as a Bearer token
    },
  };

  const fetchRentalStations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<RentalStation[]>(
        'http://localhost:8080/api/rental-stations',
        axiosConfig
      );

      setStations(response.data);
    } catch (error) {
      setError('Error fetching rental stations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addRentalStation = async () => {
    if (!name || !location || availableUmbrellas === null) {
      setError('Please fill out all fields correctly.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post(
        'http://localhost:8080/api/rental-stations',
        {
          name,
          location,
          availableUmbrellas,
        },
        axiosConfig
      );

      fetchRentalStations();
      resetForm();
    } catch (error) {
      setError('Error adding rental station. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateRentalStation = async () => {
    if (!editingStation) return;
  
    setLoading(true);
    setError(null);
  
    try {
      await axios.put(
        `http://localhost:8080/api/rental-stations/${editingStation.id}`,
        {
          name,
          location,
          availableUmbrellas,
        },
        axiosConfig
      );
  
      fetchRentalStations();
      resetForm();
      setEditingStation(null); // Clear editing station after update
    } catch (error) {
      setError('Error updating rental station. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  const resetForm = () => {
    setName('');
    setLocation('');
    setAvailableUmbrellas(null);
  };

  const startEditing = (station: RentalStation) => {
    setEditingStation(station);
    setName(station.name);
    setLocation(station.location);
    setAvailableUmbrellas(station.availableUmbrellas);
  };

  return (
    <div className="rental-stations-container">
      <h1>Rental Stations</h1>
      {error && <p className="error-message">{error}</p>}

      <div className="form-container">
        <input
          type="text"
          placeholder="Station Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="number"
          placeholder="Available Umbrellas"
          value={availableUmbrellas || ''}
          onChange={(e) =>
            setAvailableUmbrellas(e.target.value ? Number(e.target.value) : null)
          }
        />
        {editingStation ? (
          <button onClick={updateRentalStation} disabled={loading}>
            Update Rental Station
          </button>
        ) : (
          <button onClick={addRentalStation} disabled={loading}>
            Add Rental Station
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="stations-grid">
          {stations.length > 0 ? (
            stations.map((station) => (
              <div key={station.id} className="station-card">
                <h3>{station.name}</h3>
                <p>Location: {station.location}</p>
                <p>Available Umbrellas: {station.availableUmbrellas}</p>
                <button
                  className="edit-button"
                  onClick={() => startEditing(station)} // Start editing when clicked
                  disabled={loading}
                >
                  Edit
                </button>
              </div>
            ))
          ) : (
            <p>No rental stations available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RentalStationList;
