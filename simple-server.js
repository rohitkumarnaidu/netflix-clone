const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

// Serve static files from current directory
app.use(express.static(__dirname));

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Netflix Clone running at http://localhost:${PORT}`);
    console.log('Server started successfully!');
});
