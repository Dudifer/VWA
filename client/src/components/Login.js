import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ voterID: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/voters/login', formData)
      .then(res => {
        // Redirect to the user details page after a successful login
        navigate('/user-details', { state: { voter: res.data.voter } });
      })
      .catch(err => {
        console.error('Error:', err.response);
        alert('Error: ' + (err.response?.data?.message || err.message));
      });
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      {/* Use voterID instead of email */}
      <input name="voterID" type="text" placeholder="Voter ID" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
