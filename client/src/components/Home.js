import React from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import './Home.css';

const Home = () => {
  const navigate = useNavigate(); // Use React Router's useNavigate for redirection

  return (
    // <meta name
    <div className="home-container">
      <h1>Voting Web App</h1>

      <div className="form-container">
        <h2>Login</h2>
        <Login />
        <div className="link-container">
          <button onClick={() => navigate('/register')} className="link-button">New Voter? Register here</button>
        </div>
        <div className="link-container">
          <button onClick={() => navigate('/change-password')} className="link-button">Forgot Password?</button>
          <button onClick={() => navigate('/retrieve-voterid')} className="link-button">Retrieve Voter ID?</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
