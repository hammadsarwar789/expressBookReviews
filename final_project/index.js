const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Middleware to parse JSON in request body
app.use(express.json());

// Session configuration for customer authentication
app.use("/customer", session({
  secret: "fingerprint_customer", 
  resave: true, 
  saveUninitialized: true 
}));

// Authentication middleware for customer routes
app.use("/customer/auth/*", function auth(req, res, next) {
  // Check if the session contains a valid user
  if (req.session && req.session.user) {
    // If the user is already authenticated, proceed with the request
    next();
  } else {
    // If no valid session, return a 403 Unauthorized response
    return res.status(403).json({ message: "Unauthorized" });
  }
});

// User login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Assuming users are stored in an array, replace this with your database logic
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // If user is valid, store the user data in session
    req.session.user = { username: user.username, id: user.id };
    return res.status(200).json({ message: "Login successful" });
  } else {
    // If username or password is incorrect
    return res.status(400).json({ message: "Invalid username or password" });
  }
});

// Register a new user
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username already exists
  if (users.some(u => u.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Add the new user (this would be saved in your database in a real app)
  const newUser = { username, password, id: users.length + 1 };
  users.push(newUser);

  return res.status(201).json({ message: "User registered successfully" });
});

const PORT = 5000;

// Mount the customer and general routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
