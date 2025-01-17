const express = require('express');
const connectDB = require('./config/db');
const tutorRoutes = require('./routes/tutorRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable CORS
app.use(cors());

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api', tutorRoutes);

app.get('/',(req,res)=>{
    res.send('hello')
})

// Export the express app to be used as a serverless function in Vercel
module.exports = (req, res) => {
    app(req, res); // Use the express app to handle the request and response
};
