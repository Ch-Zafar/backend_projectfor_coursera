const express = require('express');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// check if username exists
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// authenticate user
const authenticatedUser = (username, password) => {
  const user = users.find(u => u.username === username);
  return user && user.password === password;
};

// Register
regd_users.post('/signin', (req,res) => {
  const { username, password } = req.body;

  if (isValid(username)) {
    return res.status(400).send("User already exists");
  }

  users.push({ username, password });
  res.status(201).json({ 
    message: "User created successfully",
    users 
  });
});

// Login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  
  if (!isValid(username)) {
    return res.status(404).send("User not found");
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).send("Password incorrect");
  }

  req.session.username = username;
  res.send("Login successful");
});

// Add or update review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.username;
  const isbn = req.params.isbn;
  const review = req.body.review;

  if (!username) {
    return res.status(401).json({ message: "You must be logged in to add a review" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review text required" });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/modified successfully",
    reviews: books[isbn].reviews,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
