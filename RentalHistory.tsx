import React from 'react';
import './umbrella.css';

type Rental = {
  barcode: string;
  duration: number;
  cost: number;
};

type RentalHistoryProps = {
  history: Rental[];
};

const RentalHistory: React.FC<RentalHistoryProps> = ({ history }) => {
  return (
    <div>
      <h2>Rental History</h2>
      <ul>
        {history.map((rental, index) => (
          <li key={index}>
            Umbrella {rental.barcode} - {rental.duration} hour(s) - ${rental.cost.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RentalHistory;