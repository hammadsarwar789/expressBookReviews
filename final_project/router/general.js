const express = require('express');
const axios = require('axios'); // Axios for HTTP requests
let books = require("./booksdb.js");  // Preloaded books database
const public_users = express.Router();

// Axios base URL for getting data from the server
const apiUrl = "http://localhost:5000"; // Adjust this URL based on where the API is hosted

// Get the book list available in the shop (Task 10) using async/await
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get(`${apiUrl}/books`); // Fetch books from the API
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Get book details based on ISBN (Task 11) using async/await
public_users.get('/isbn/:isbn', async function (req, res) {
    const { isbn } = req.params;
    try {
        const response = await axios.get(`${apiUrl}/books/isbn/${isbn}`); // Fetch book by ISBN
        if (response.data) {
            res.status(200).json(response.data);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching book by ISBN", error: error.message });
    }
});

// Get all books by Author (Task 12) using async/await
public_users.get('/author/:author', async function (req, res) {
    const { author } = req.params;
    try {
        const response = await axios.get(`${apiUrl}/books/author/${author}`); // Fetch books by author
        if (response.data.length > 0) {
            res.status(200).json(response.data);
        } else {
            res.status(404).json({ message: "No books found by this author" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author", error: error.message });
    }
});

// Get all books based on Title (Task 13) using async/await
public_users.get('/title/:title', async function (req, res) {
    const { title } = req.params;
    try {
        const response = await axios.get(`${apiUrl}/books/title/${title}`); // Fetch books by title
        if (response.data.length > 0) {
            res.status(200).json(response.data);
        } else {
            res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by title", error: error.message });
    }
});

module.exports.general = public_users;
