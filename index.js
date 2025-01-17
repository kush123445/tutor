const express = require('express');
const connectDB = require('./config/db');
const tutorRoutes = require('./routes/tutorRoutes');
const cors = require('cors'); // Import cors
require('dotenv').config();

const app = express();

// Enable CORS
app.use(cors());
app.options('*', cors());
//ct to the database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.get('/',(req,res)=>{
    res.send('hello')
})

app.use('/api', tutorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
