import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ChangePassword from './components/changePassword';
import RetrieveVoterID from './components/retrieveVoterID';
import './components/Home.css';
import UserDetails from './components/UserDetails';
import Register from './components/Register';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/retrieve-voterid" element={<RetrieveVoterID />} />
          <Route path="/user-details" element={<UserDetails />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
