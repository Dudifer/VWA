// const mysql = require('mysql2');

// const db = mysql.createPool({
//   host: 'localhost',
//   user: 'root', // Your MySQL username
//   password: '123456789', // Your MySQL password
//   database: 'voting_db'
// });

// module.exports = db;
const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root', // Your MySQL username
  password: '123456789', // Your MySQL password (purposefully incorrect for testing)
  database: 'voting_db' // Your database name
});

// Test the database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    process.exit(1); // Exit the process with failure code
  } else {
    console.log('Connected to the database.');
    connection.release(); // Release the connection back to the pool
  }
});

module.exports = db;
