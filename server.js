const express = require('express');
const bodyParser = require('body-parser');
const userdataRoutes = require('./route/routes'); // Import routes

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use(userdataRoutes);

// Jalankan server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
