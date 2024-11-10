// Importing necessary modules
import express from 'express'; // Express framework for setting up the web server
import fetch from 'node-fetch'; // Node.js fetch API to fetch data from the URL
import cors from 'cors'; // CORS middleware to enable cross-origin requests
import { createRequire } from 'module'; // To use CommonJS-style imports (for cheerio)

const require = createRequire(import.meta.url); // Create require function to load cheerio
const cheerio = require('cheerio'); // Cheerio library to parse HTML and extract text

// Initialize the Express application
const app = express();

// Middleware to handle CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Middleware to parse incoming JSON data
app.use(express.json());

// Define the POST route for the frequency API
app.post('/api/frequency', async (req, res) => {
  const { url, topN } = req.body; // Destructure the URL and topN (number of top words to fetch) from the request body

  try {
    // Fetch the HTML content from the provided URL
    const response = await fetch(url);
    const html = await response.text(); // Convert the response to text (HTML)

    // Load the HTML content using Cheerio to manipulate and extract the text
    const $ = cheerio.load(html);

    // Extract the body text from the HTML, convert it to lowercase, and remove non-alphabetical characters
    const text = $('body').text().toLowerCase().replace(/[^a-z\s]/g, '');

    // Split the text into words (by spaces) and filter out words that are too short (less than 4 characters)
    const words = text.split(/\s+/).filter(word => word.length > 3);

    // Initialize an object to store the word frequency count
    const frequency = {};

    // Loop through each word and count its occurrences
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1; // If word exists, increment the count, otherwise initialize it
    });

    // Convert the frequency object into an array of [word, frequency] pairs and sort by frequency in descending order
    const sortedWords = Object.entries(frequency)
      .sort(([, a], [, b]) => b - a) // Sort the words based on frequency in descending order
      .slice(0, topN); // Get the top N frequent words

    // Send the sorted words and their frequencies as a JSON response
    res.json({ words: sortedWords });

  } catch (error) {
    // If there is an error (e.g., invalid URL or network issue), send a 500 response with an error message
    res.status(500).json({ error: 'Failed to fetch or process the URL.' });
  }
});

// Start the server and listen on port 5000
app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
