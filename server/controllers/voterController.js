const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Constants for account lockout
const MAX_LOGIN_ATTEMPTS = 3;
const LOCK_TIME_MINUTES = 30;

// Utility function to add lockout time
const addMinutesToNow = (minutes) => {
  const lockUntil = new Date();
  lockUntil.setMinutes(lockUntil.getMinutes() + minutes);
  return lockUntil;
};

// Register a new voter
// exports.registerVoter = (req, res) => {
//   const { firstName, lastName, email, password, phoneNumber, dlNumber, passport, dob, address, securityQ1, securityQ2, securityQ3, securityA1, securityA2, securityA3 } = req.body;

//   if (!dlNumber && !passport) {
//     return res.status(400).json({ message: 'Either passport or driving license number must be provided.' });
//   }

//   // Hash password and security answers
//   bcrypt.hash(password, 10, (hashErr, hashPassword) => {
//     if (hashErr) return res.status(500).json({ error: hashErr });

//     bcrypt.hash(securityA1, 10, (errA1, hashA1) => {
//       if (errA1) return res.status(500).json({ error: errA1 });
//       bcrypt.hash(securityA2, 10, (errA2, hashA2) => {
//         if (errA2) return res.status(500).json({ error: errA2 });
//         bcrypt.hash(securityA3, 10, (errA3, hashA3) => {
//           if (errA3) return res.status(500).json({ error: errA3 });

//           const insertQuery = `INSERT INTO voters 
//                                (FirstName, LastName, Address, email, password, phoneNumber, DLNumber, passport, DOB, securityQ1, securityQ2, securityQ3, securityA1, securityA2, securityA3, failedAttempts, isLocked, lockUntil) 
//                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, FALSE, NULL)`;

//           db.query(insertQuery, [firstName, lastName, address, email, hashPassword, phoneNumber, dlNumber, passport, dob, securityQ1, securityQ2, securityQ3, hashA1, hashA2, hashA3], (err, result) => {
//             if (err) return res.status(500).json({ error: err });

//             res.status(201).json({ message: 'Voter registered successfully', voterID: result.insertId });
//           });
//         });
//       });
//     });
//   });
// };
exports.registerVoter = (req, res) => {
    const { firstName, lastName, email, password, phoneNumber, dlNumber, passport, dob, address, securityQ1, securityQ2, securityQ3, securityA1, securityA2, securityA3 } = req.body;
  
    console.log("Received Data:", req.body); // Add this log to check received data
  
    if (!dlNumber && !passport) {
      console.log("Error: Either passport or driving license number must be provided.");
      return res.status(400).json({ message: 'Either passport or driving license number must be provided.' });
    }
  
    // Hash password and security answers
    bcrypt.hash(password, 10, (hashErr, hashPassword) => {
      if (hashErr) {
        console.log("Hashing Error:", hashErr); // Log hashing error if it happens
        return res.status(500).json({ error: hashErr });
      }
  
      bcrypt.hash(securityA1, 10, (errA1, hashA1) => {
        if (errA1) {
          console.log("Security Answer 1 Hashing Error:", errA1);
          return res.status(500).json({ error: errA1 });
        }
  
        bcrypt.hash(securityA2, 10, (errA2, hashA2) => {
          if (errA2) {
            console.log("Security Answer 2 Hashing Error:", errA2);
            return res.status(500).json({ error: errA2 });
          }
  
          bcrypt.hash(securityA3, 10, (errA3, hashA3) => {
            if (errA3) {
              console.log("Security Answer 3 Hashing Error:", errA3);
              return res.status(500).json({ error: errA3 });
            }
  
            const insertQuery = `INSERT INTO voters 
                                 (FirstName, LastName, Address, email, password, phoneNumber, DLNumber, passport, DOB, securityQ1, securityQ2, securityQ3, securityA1, securityA2, securityA3, failedAttempts, isLocked, lockUntil) 
                                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, FALSE, NULL)`;
  
            db.query(insertQuery, [firstName, lastName, address, email, hashPassword, phoneNumber, dlNumber, passport, dob, securityQ1, securityQ2, securityQ3, hashA1, hashA2, hashA3], (err, result) => {
              if (err) {
                console.log("Database Insertion Error:", err); // Log database insertion error if it happens
                return res.status(500).json({ error: err });
              }
  
              console.log("Registration Successful:", result);
              res.status(201).json({ message: 'Voter registered successfully', voterID: result.insertId });
            });
          });
        });
      });
    });
  };
  

// Login voter
// Login voter
// Login voter
exports.loginVoter = (req, res) => {
  const { voterID, password } = req.body; // Extract voterID and password from request body

  db.query('SELECT * FROM voters WHERE VoterID = ?', [voterID], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(400).json({ message: 'Invalid voterID or password' });

    const voter = results[0];
    const currentTime = new Date();

    // Check if account is locked
    if (voter.isLocked && voter.lockUntil > currentTime) {
      const remainingLockTime = (new Date(voter.lockUntil) - currentTime) / 60000; // Remaining time in minutes
      return res.status(403).json({ message: `Account is locked. Try again in ${Math.ceil(remainingLockTime)} minutes` });
    }

    // Compare passwords
    bcrypt.compare(password, voter.password, (compareErr, isMatch) => {
      if (compareErr) return res.status(500).json({ error: compareErr });

      if (!isMatch) {
        // Update failed attempts
        const failedAttempts = voter.failedAttempts + 1;
        const isLocked = failedAttempts >= MAX_LOGIN_ATTEMPTS;

        let lockUntil = null;
        if (isLocked) {
          lockUntil = addMinutesToNow(LOCK_TIME_MINUTES); // Lock the account for a set period
        }

        db.query('UPDATE voters SET failedAttempts = ?, isLocked = ?, lockUntil = ? WHERE VoterID = ?', 
          [failedAttempts, isLocked, lockUntil, voterID]);

        return res.status(400).json({ message: 'Invalid voterID or password' });
      }

      // If successful login, reset failed attempts and lock status
      db.query('UPDATE voters SET failedAttempts = 0, isLocked = FALSE, lockUntil = NULL WHERE VoterID = ?', [voterID]);
      res.status(200).json({ message: 'Login successful', voter });
    });
  });
};

// Change password for voter
exports.changePassword = (req, res) => {
  const { voterID, securityQ1, securityQ2, securityQ3, securityA1, securityA2, securityA3, newPassword } = req.body;

  db.query('SELECT * FROM voters WHERE VoterID = ?', [voterID], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    const voter = results[0];

    // Validate security answers
    bcrypt.compare(securityA1, voter.securityA1, (errA1, isMatchA1) => {
      if (errA1 || !isMatchA1) return res.status(400).json({ message: 'Security answer 1 is incorrect' });

      bcrypt.compare(securityA2, voter.securityA2, (errA2, isMatchA2) => {
        if (errA2 || !isMatchA2) return res.status(400).json({ message: 'Security answer 2 is incorrect' });

        bcrypt.compare(securityA3, voter.securityA3, (errA3, isMatchA3) => {
          if (errA3 || !isMatchA3) return res.status(400).json({ message: 'Security answer 3 is incorrect' });

          // Hash new password and update
          bcrypt.hash(newPassword, 10, (hashErr, hashNewPassword) => {
            if (hashErr) return res.status(500).json({ error: hashErr });

            db.query('UPDATE voters SET password = ? WHERE VoterID = ?', [hashNewPassword, voterID], (updateErr) => {
              if (updateErr) return res.status(500).json({ error: updateErr });
              res.status(200).json({ message: 'Password changed successfully' });
            });
          });
        });
      });
    });
  });
};

// Retrieve VoterID using security questions and either DLNumber or passport
exports.retrieveVoterID = (req, res) => {
  const { securityQ1, securityQ2, securityQ3, securityA1, securityA2, securityA3, dlNumber, passport } = req.body;

  if (!dlNumber && !passport) {
    return res.status(400).json({ message: 'Either passport or driving license number must be provided.' });
  }

  // Build query conditions
  let query = 'SELECT * FROM voters WHERE securityQ1 = ? AND securityQ2 = ? AND securityQ3 = ? AND (';
  const params = [securityQ1, securityQ2, securityQ3];

  if (dlNumber) {
    query += 'DLNumber = ?)';
    params.push(dlNumber);
  } else {
    query += 'passport = ?)';
    params.push(passport);
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'No matching record found' });

    const voter = results[0];

    // Validate security answers
    bcrypt.compare(securityA1, voter.securityA1, (errA1, isMatchA1) => {
      if (errA1 || !isMatchA1) return res.status(400).json({ message: 'Security answer 1 is incorrect' });

      bcrypt.compare(securityA2, voter.securityA2, (errA2, isMatchA2) => {
        if (errA2 || !isMatchA2) return res.status(400).json({ message: 'Security answer 2 is incorrect' });

        bcrypt.compare(securityA3, voter.securityA3, (errA3, isMatchA3) => {
          if (errA3 || !isMatchA3) return res.status(400).json({ message: 'Security answer 3 is incorrect' });

          // Return the VoterID
          res.status(200).json({ message: 'Voter ID retrieved successfully', voterID: voter.VoterID });
        });
      });
    });
  });
};
