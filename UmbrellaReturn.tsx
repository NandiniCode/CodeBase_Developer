import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

interface Transaction {
  umbrella: Umbrella;
  startTime: string;
  duration: number;
}

interface UmbrellaReturnProps {
  rentedUmbrellas: Transaction[];
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  token: string | null;
  selectedRentedUmbrella: number | null;
  setSelectedRentedUmbrella: React.Dispatch<React.SetStateAction<number | null>>;
  stations: Station[];
  selectedStation: number | null;
  setSelectedStation: React.Dispatch<React.SetStateAction<number | null>>;
  fetchRentedUmbrellas(): void;
}

const UmbrellaReturn: React.FC<UmbrellaReturnProps> = ({
  rentedUmbrellas,
  setErrorMessage,
  token,
  selectedRentedUmbrella,
  setSelectedRentedUmbrella,
  stations,
  selectedStation,
  setSelectedStation,
  fetchRentedUmbrellas,
}) => {
  const [loading, setLoading] = useState(false); // To manage loading state
  const [successMessage, setSuccessMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleReturn = async () => {

    if (!selectedRentedUmbrella || !selectedStation) {
      setErrorMessage('Please select an umbrella and a station to return it.');
      return;
    }

    // Show loading state
    setLoading(true);
   
    try {
      // Make the API call to return the umbrella
      const response = await fetch('http://localhost:8080/api/returnUmbrella', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Assuming the token is required for authentication
        },
        body: JSON.stringify({
          umbrellaId: selectedRentedUmbrella,
          stationId: selectedStation,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to return umbrella');
      }

      // If the API call is successful
      setSuccessMessage('Umbrella returned successfully!');
      setErrorMessage('');
      fetchRentedUmbrellas();

      // Clear selections after successful return
      setSelectedRentedUmbrella(null);
      setSelectedStation(null);
      debugger;
      // Parse the JSON response
      const responseData = await response.json();

      // Assuming the response contains a field for the cost
      const returnedCost = responseData.cost; // Adjust this based on your actual response structure
      navigate('/payment', { state: { cost: returnedCost } });
      
    } catch (error: any) {
      // Handle error
      setErrorMessage(error.message || 'An error occurred while returning the umbrella');
    } finally {
      // Hide loading state
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '30rem',
        backgroundColor: '#f4f4f9', // Light background for better contrast
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2 style={{ color: '#333' }}>Return Umbrella</h2>

      <div style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#555',
          }}
        >
          Select an Umbrella:
        </label>
        <select
          value={selectedRentedUmbrella ?? ''}
          onChange={(e) => setSelectedRentedUmbrella(Number(e.target.value))}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '16px',
            marginBottom: '20px',
          }}
        >
          <option value="">-- Select Umbrella --</option>
          {rentedUmbrellas.map((transaction) => (
            <option key={transaction.umbrella.id} value={transaction.umbrella.id}>
              {transaction.umbrella.barcode} (Start Time: {transaction.startTime})
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#555',
          }}
        >
          Select Return Station:
        </label>
        <select
          value={selectedStation ?? ''}
          onChange={(e) => setSelectedStation(Number(e.target.value))}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '16px',
            marginBottom: '20px',
          }}
        >
          <option value="">-- Select Station --</option>
          {stations.map((station) => (
            <option key={station.id} value={station.id}>
              {station.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleReturn}
        disabled={loading}
        style={{
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: 'pointer',
          width: '100%',
          maxWidth: '400px',
          marginBottom: '20px',
        }}
      >
        {loading ? 'Returning...' : 'Return Umbrella'}
      </button>


      {/* Display success message if the umbrella is successfully returned */}
      {successMessage && (
        <div
          style={{
            color: '#28a745',
            fontSize: '16px',
            fontWeight: 'bold',
            marginTop: '20px',
          }}
        >
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default UmbrellaReturn;
