import React from 'react';
import { useLocation } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Payment from './Payment';

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const { cost } = location.state as { cost: number };

  // Format the cost to two decimal places
  const formattedCost = parseFloat(cost.toFixed(2));

  const stripePromise = loadStripe('pk_test_51QFHOwLFW6LLReZdiqVxQ4aKsJgICNrVnuyyvp0LVfxlMA7w6hqx6y9Br9nUtZkXvuGzcwxFjKmNIaIWjSLa68eU00tLtvrVXW');

  return (
    <div>
      <h1 style={{ color: 'white' }}>Payment Page</h1>
      <h2 style={{ color: 'white' }}>Total Cost: ${formattedCost}</h2>
      <Elements stripe={stripePromise}>
        <Payment 
          cost={formattedCost}
          onSuccess={() => {
            alert('Payment successful!');
            // Optionally, redirect or handle success logic here
          }}
          onError={(message) => {
            alert(`Payment failed: ${message}`);
            // Optionally, handle error logic here
          }}
        />
      </Elements>
    </div>
  );
};

export default PaymentPage;
