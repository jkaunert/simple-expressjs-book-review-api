const express = require('express');
let books = require("./booksdb.js");
const { console } = require('inspector');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (isbn) {
    for (let book of Object.values(books)) {
      if (book.isbn === isbn) {
        return res.send(book);
      }
    }
    return res.status(404).json({ message: ` Book with ISBN {isbn} not found` });
  }
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  if (author) {
    const booksByAuthor = [];
    for (let book of Object.values(books)) {
      if (book.author == author) {
       booksByAuthor.push(book);
      }
    }
    return res.send(booksByAuthor);
  } else {
    return res.status(404).json({ message: `Author {author} not found` });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  if (title) {
    const booksByTitle = [];
    for (let book of Object.values(books)) {
      if (book.title == title) {
        booksByTitle.push(book);
      }
    }
    return res.send(booksByTitle);
  } else {
    return res.status(404).json({ message: `Title {title} not found` });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (isbn) {
    for (let book of Object.values(books)) {
      if (book.isbn === isbn) {
        return res.send(book.reviews);
      }
    }
    return res.status(404).json({ message: ` Book with ISBN {isbn} not found` });
  }
});

module.exports.general = public_users;
