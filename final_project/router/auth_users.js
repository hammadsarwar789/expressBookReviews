const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the username already exists
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Check if the username and password match
const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username);
  return user && user.password === password;
};

// Register new user
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Username and Password are required." });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists!" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered!" });
});

// Login registered user (Task 7)
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and Password are required." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
  return res.status(200).json({ message: "Login successful", token });
});

// Add or modify a book review (Task 8)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { username } = req.session.user;  // assuming username is stored in session after login
  const { isbn } = req.params;
  const { review } = req.body;

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or modify the review for the book by the user
  book.reviews[username] = review;
  return res.status(200).json({ message: "Review added/modified successfully" });
});

// Delete a book review (Task 9)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { username } = req.session.user;  // assuming username is stored in session after login
  const { isbn } = req.params;

  const book = books[isbn];
  if (!book || !book.reviews[username]) {
    return res.status(404).json({ message: "Review not found" });
  }

  // Delete the review of the logged-in user for this book
  delete book.reviews[username];
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
