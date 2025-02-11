const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Add this at the top of server.js for better error logging
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Promise Rejection:', error);
});

// Update CORS configuration
app.use(cors({
    origin: '*', // For development only. In production, specify your domain
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Update MongoDB connection with more detailed error logging
mongoose.connect('mongodb://127.0.0.1:27017/rentyourdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB connected successfully');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if MongoDB connection fails
});

// Add error handler for MongoDB connection
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

// Middleware
app.use(express.json());
app.use(express.static(__dirname));
app.use('/images', express.static('images'));

// Retailer Schema
const retailerSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    shopName: String,
    address: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Retailer = mongoose.model('Retailer', retailerSchema);

// API endpoint for retailer onboarding
app.post('/api/onboard-retailer', async (req, res) => {
    try {
        console.log('Received retailer data:', req.body);
        
        // Validate required fields
        if (!req.body.name || !req.body.email || !req.body.phone) {
            return res.status(400).json({ 
                error: 'Missing required fields: name, email, and phone are required' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ 
                error: 'Invalid email format' 
            });
        }

        // Validate phone number (basic validation)
        if (req.body.phone.length < 10) {
            return res.status(400).json({ 
                error: 'Phone number should be at least 10 digits' 
            });
        }

        const retailer = new Retailer(req.body);
        await retailer.save();
        
        console.log('Retailer saved successfully:', retailer);
        
        res.status(201).json({ 
            message: 'Retailer registered successfully!',
            retailer: retailer 
        });
    } catch (error) {
        console.error('Error saving retailer:', error);
        res.status(500).json({ 
            error: 'Server error occurred while processing your request',
            details: error.message 
        });
    }
});

// Add more detailed logging to the server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port 27017`);
    console.log(`API endpoint available at http://localhost:27017/api/onboard-retailer`);
});
