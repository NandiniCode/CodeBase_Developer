import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: (role: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!username || !password) {
      return 'Please enter a valid username and password.';
    }
    if (username.length < 4) {
      return 'Username must be at least 4 characters long.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    return null;
  };

  const handleLogin = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.status === 200) {
        const { token, role } = response.data; // Assuming response has token and role
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('userRole', role);
        
        onLogin(role); 
        window.location.reload();
        setError(null);
      } else {
        setError('Invalid login credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data || 'An error occurred during login. Please try again later.');
      } else {
        setError('An error occurred during login. Please try again later.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: '300px', marginBottom: '1rem' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '300px', marginBottom: '1rem' }}
      />
      <button onClick={handleLogin} style={{ width: '300px' }}>Login</button>
    </div>
  );
};

export default Login;
