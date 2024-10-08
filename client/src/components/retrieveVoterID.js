import React, { useState } from 'react';
import axios from 'axios';

const RetrieveVoterID = () => {
  const [formData, setFormData] = useState({
    securityQ1: '',
    securityQ2: '',
    securityQ3: '',
    securityA1: '',
    securityA2: '',
    securityA3: '',
    dlNumber: '',
    passport: ''
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
    axios.post('http://localhost:5000/api/voters/retrieve-voter-id', formData)
      .then(res => alert(`Voter ID retrieved successfully: ${res.data.voterID}`))
      .catch(err => alert('Error: ' + err.response.data.message));
  };

  return (
   
    <form className="form-container" onSubmit={handleSubmit}>
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

      <input name="dlNumber" type="text" placeholder="Driving License (if applicable)" onChange={handleChange} />
      <input name="passport" type="text" placeholder="Passport (if applicable)" onChange={handleChange} />

      <button type="submit">Retrieve Voter ID</button>
    </form>
  );
};

export default RetrieveVoterID;
