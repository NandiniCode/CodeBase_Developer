import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface PaymentProps {
  cost: number;
  onSuccess: () => void;
  onError: (message: string) => void;
}

const Payment: React.FC<PaymentProps> = ({ cost, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      onError('Card element not found.');
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
    });

    if (error) {
      onError(error.message || 'Payment failed.');
      setIsProcessing(false);
    } else {
      try {
        const costInCents = cost * 100;
        const response = await axios.post('http://localhost:8080/api/payment/create', {
          amount: costInCents,
          paymentMethodId: paymentMethod.id,
        });

        if (response.status === 200) {
          onSuccess();
          navigate('/main', {});
        } else {
          onError('Payment failed. Please try again.');
        }
      } catch (err) {
        onError('Payment failed. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Custom styles for each field, including borders
  const elementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
      },
      invalid: {
        color: '#f44336',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div style={{ marginBottom: '10px', width: '100%', maxWidth: '400px' }}>
        <label style={{ display: 'block', textAlign: 'center', marginBottom: '5px' }}>Card Number</label>
        <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '5px' }}>
          <CardNumberElement options={elementOptions} />
        </div>
      </div>
      <div style={{ marginBottom: '10px', width: '100%', maxWidth: '400px' }}>
        <label style={{ display: 'block', textAlign: 'center', marginBottom: '5px' }}>Expiration Date</label>
        <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '5px' }}>
          <CardExpiryElement options={elementOptions} />
        </div>
      </div>
      <div style={{ marginBottom: '10px', width: '100%', maxWidth: '400px' }}>
        <label style={{ display: 'block', textAlign: 'center', marginBottom: '5px' }}>CVV</label>
        <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '5px' }}>
          <CardCvcElement options={elementOptions} />
        </div>
      </div>
      <Button type="submit" disabled={!stripe || cost <= 0 || isProcessing} style={{ color: 'white', background: 'green', marginTop: '15px' }}>
        {isProcessing ? 'Processing...' : `Pay $${cost.toFixed(2)}`}
      </Button>
    </form>
  );
};

export default Payment;
