const express = require('express');
const router = express.Router();
const voterController = require('../controllers/voterController');

// Register voter
router.post('/register', voterController.registerVoter);

// Login voter
router.post('/login', voterController.loginVoter);

// Change password
router.post('/change-password', voterController.changePassword);

// Retrieve Voter ID
router.post('/retrieve-voter-id', voterController.retrieveVoterID);

module.exports = router;
