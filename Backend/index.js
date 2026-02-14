const path = require('path');
const express = require('express');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const cors = require('cors');
const connectDB = require('./src/Config/db');
const meetingRoutes = require('./src/routes/meetingRoutes');
const prepRoutes = require('./src/routes/prepRoutes');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (_, res) => {
  res.status(200).json({ message: 'AI Meeting Prep Assistant API' });
});

app.use('/api/meetings', meetingRoutes);
app.use('/api/prep', prepRoutes);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;