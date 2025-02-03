import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // Import your CSS file

interface Umbrella {
    id: number;
    barcode: string;
    status: string;
}

function UmbrellaList({ stationId }: { stationId: number }) {
    const [umbrellas, setUmbrellas] = useState<Umbrella[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Fetch available umbrellas for the selected station
        const fetchUmbrellas = async () => {
            try {
                const response = await axios.get<Umbrella[]>(`/rentalStations/${stationId}/umbrellas`);
                setUmbrellas(response.data);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchUmbrellas();
    }, [stationId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error fetching umbrellas: {error.message}</p>;
    }

    return (
        <div>
            <h2>Available Umbrellas</h2>
            {umbrellas.length === 0 ? (
                <p>No available umbrellas at this station.</p>
            ) : (
                <ul>
                    {umbrellas.map((umbrella) => (
                        <li key={umbrella.id}>
                            Barcode: {umbrella.barcode} - Status: {umbrella.status}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default UmbrellaList;