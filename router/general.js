const express = require('express');
let books = require("./booksdb.js");
const { console } = require('inspector');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User registered successfully" });
    } else {
      return res.status(400).json({ message: "User already exists" });
    }
  }
  return res.status(400).json({ message: "Unable to register user" });
});

// get all books using async/await
public_users.get('/', async (req, res) => {
  try {
    const booklist = await res.send(JSON.stringify(books, null, 4));
    return booklist;
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error: " + error.message });
  }
});

const getBooksByISBN = async (isbn) => {
  for (let matchingBook of Object.values(books)) {
    if (matchingBook.isbn === isbn) {
      return matchingBook;
    }
  }
};
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = await getBooksByISBN(isbn);
    if (book) {
      return res.send(book);
    } else {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error: " + error.message });
  }
});

const getBooksByAuthor = async (author) => {
  const booksByAuthor = [];
  for (let book of Object.values(books)) {
    if (book.author == author) {
      booksByAuthor.push(book);
    }
  }
  return booksByAuthor;
};
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const booksByAuthor = await getBooksByAuthor(author);
    if (booksByAuthor.length > 0) {
      return res.send(booksByAuthor);
    }
    return res.status(404).json({ message: `Author ${author} not found` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error: " + error.message });
  };
});

const getBooksByTitle = async (title) => {
  const booksByTitle = [];
  for (let book of Object.values(books)) {
    if (book.title == title) {
      booksByTitle.push(book);
    }
  }
  return booksByTitle;
};
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const booksByTitle = await getBooksByTitle(title);
    if (booksByTitle.length > 0) {
      return res.send(booksByTitle);
    }
    return res.status(404).json({ message: `Title ${title} not found` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error: " + error.message });
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
    return res.status(404).json({ message: ` Book with ISBN ${isbn} not found` });
  }
});

module.exports.general = public_users;
