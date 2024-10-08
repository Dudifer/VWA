import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    password: '',
    phoneNumber: '',
    dlNumber: '',
    passport: '',
    dob: '',
    securityQ1: '',
    securityQ2: '',
    securityQ3: '',
    securityA1: '',
    securityA2: '',
    securityA3: ''
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

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     axios.post('http://localhost:5000/api/voters/register', formData)
//       .then(res => alert(`Registration successful! Your Voter ID is: ${res.data.voterID}`))
//       .catch(err => alert('Error: ' + err.response.data.message));
//   };
const handleSubmit = (e) => {
    e.preventDefault();
  
    // Make sure at least one of DLNumber or passport is provided
    if (!formData.dlNumber && !formData.passport) {
      alert('Please provide either a Driving License Number, a Passport Number, or both.');
      return;
    }
  
    axios.post('http://localhost:5000/api/voters/register', formData)
      .then(res => alert(`Registration successful! Your Voter ID is: ${res.data.voterID}`))
      .catch(err => {
        console.error('Error Response:', err.response);
        alert('Error: ' + (err.response?.data?.message || err.message || 'An unknown error occurred'));
      });
  };
  
  

  return (
    <form onSubmit={handleSubmit}>
      <input name="firstName" type="text" placeholder="First Name" onChange={handleChange} required />
      <input name="lastName" type="text" placeholder="Last Name" onChange={handleChange} required />
      <input name="address" type="text" placeholder="Address" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <input name="phoneNumber" type="text" placeholder="Phone Number" onChange={handleChange} required />
      <input
  name="dlNumber"
  type="text"
  placeholder="Driving License (if applicable)"
  onChange={handleChange}
/>

<input
  name="passport"
  type="text"
  placeholder="Passport (if applicable)"
  onChange={handleChange}
/>

      <input name="dob" type="date" onChange={handleChange} required />

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

      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
