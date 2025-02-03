import React, { useState } from 'react';
import axios from 'axios';
import './styles.css'; // Import your CSS file

interface RegisterProps {
  onRegisterSuccess: () => void; // To trigger login after successful registration
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const role = 'customer'; // Directly set role to 'customer'

  const validateInputs = () => {
    if (!name || !username || !password || !location || !contact) {
      return 'Please fill in all fields.';
    }
    if (username.length < 4) {
      return 'Username must be at least 4 characters long.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(contact)) {
      return 'Contact must be a valid 10-digit phone number.';
    }
    return null;
  };

  const handleRegister = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/register', {
        name,
        username,
        password,
        role, // Send 'customer' role by default
        location,
        contact,
      });

      if (response.status === 200) {
        onRegisterSuccess();
        alert('Registration successful! You can now log in.');
      }
    } catch (error) {
      setErrorMessage('Registration failed. Please try again.');
      console.error(error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <input 
        type="text" 
        placeholder="Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        style={{ width: '250px', marginBottom: '10px' }}
      />
      <input 
        type="text" 
        placeholder="Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        style={{ width: '250px', marginBottom: '10px' }}
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        style={{ width: '250px', marginBottom: '10px' }}
      />
      <input 
        type="text" 
        placeholder="Location" 
        value={location} 
        onChange={(e) => setLocation(e.target.value)} 
        style={{ width: '250px', marginBottom: '10px' }}
      />
      <input 
        type="text" 
        placeholder="Contact (10-digit number)" 
        value={contact} 
        onChange={(e) => setContact(e.target.value)} 
        style={{ width: '250px', marginBottom: '10px' }}
      />
      <button onClick={handleRegister}>Register</button>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default Register;
