import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    voterID: '',
    securityQ1: '',
    securityQ2: '',
    securityQ3: '',
    securityA1: '',
    securityA2: '',
    securityA3: '',
    newPassword: ''
  });

  const securityQuestions = [
    "What was the name of your first pet?",
    "What is your mother's maiden name?",
    "What was the name of your elementary school?",
    "What is your favorite food?",
    "What is the name of your best friend?",
    "What was your first car?"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/voters/change-password', formData)
      .then(res => alert('Password changed successfully'))
      .catch(err => alert('Error: ' + err.response.data.message));
  };

  return (
    
    <form className="form-container" onSubmit={handleSubmit}>
      <input name="voterID" type="text" placeholder="Voter ID" onChange={handleChange} required />

      <label>Security Question 1</label>
      <select name="securityQ1" onChange={handleChange} required>
        <option value="">Select a question...</option>
        {securityQuestions.map((question, index) => (
          <option key={index} value={question}>{question}</option>
        ))}
      </select>
      <input name="securityA1" type="text" placeholder="Answer 1" onChange={handleChange} required />

      <label>Security Question 2</label>
      <select name="securityQ2" onChange={handleChange} required>
        <option value="">Select a question...</option>
        {securityQuestions.map((question, index) => (
          <option key={index} value={question}>{question}</option>
        ))}
      </select>
      <input name="securityA2" type="text" placeholder="Answer 2" onChange={handleChange} required />

      <label>Security Question 3</label>
      <select name="securityQ3" onChange={handleChange} required>
        <option value="">Select a question...</option>
        {securityQuestions.map((question, index) => (
          <option key={index} value={question}>{question}</option>
        ))}
      </select>
      <input name="securityA3" type="text" placeholder="Answer 3" onChange={handleChange} required />

      <input name="newPassword" type="password" placeholder="New Password" onChange={handleChange} required />
      <button type="submit">Change Password</button>
    </form>
  );
};

export default ChangePassword;
