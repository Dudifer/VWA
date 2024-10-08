import React from 'react';
import { useLocation } from 'react-router-dom';

const UserDetails = () => {
  const location = useLocation();
  const voter = location.state.voter;

  return (
    <div className="form-container">
      <h2>Voter Details</h2>
      <p><strong>First Name:</strong> {voter.FirstName}</p>
      <p><strong>Last Name:</strong> {voter.LastName}</p>
      <p><strong>Email:</strong> {voter.email}</p>
      <p><strong>Address:</strong> {voter.Address}</p>
      {/* Add any additional details */}
    </div>
  );
};

export default UserDetails;
