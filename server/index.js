const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const voterRoutes = require('./routes/voterRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Use routes
app.use('/api/voters', voterRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
