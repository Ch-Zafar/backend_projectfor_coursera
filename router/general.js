const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();






public_users.post("/register", (req, res) => {
  //Write your code here

});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {


  try {
    res.send(JSON.stringify(books));
  } catch (error) {
    res.status(404).send(error)
  }

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const ISBN = req.params.isbn;
  try {
    res.send(books[ISBN]);

  } catch (error) {
    res.status(404).send(error)
  }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  const result = Object.values(books).filter(book => book.author === author);
  try {

    if (result.length > 0) {
      res.send(result)
    }
    else {
      res.status(404).send("Book not found");
    }
  } catch (error) {
    res.status(404).send(error)
  }

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {

  const title = req.params.title;
  const result = Object.values(books).filter(book => book.title === title)
  if (result.length > 0) {
    res.send(result);
  }
  else {
    res.status(404).send("book not found");
  }

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const result = books[isbn];
  // res.send(result)
  // const result=Object.values(books).filter(book=> book.isbn === isbn);
  if (result) {
    res.send(result.reviews)
  }
  else {
    res.status(404).send("book not found");

  }
});

module.exports.general = public_users;