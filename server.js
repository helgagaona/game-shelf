// Import express using ESM syntax;
import express from 'express';

// Create an instance of an Express application
const app = express();

const name = process.env.NAME || 'Helga Gaona';

// Define a route handler for the root url ('/')
app.get('/', (req, res) => {
    res.send(`${name} - Game Shelf Project - CSE 340`)
});

// Define the port the server will listen on
const PORT = process.env.PORT || 3000;

// Start the server

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});