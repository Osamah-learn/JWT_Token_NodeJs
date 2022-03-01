/* Loading the environment variables from the `.env` file. */
require("dotenv").config();
/* Importing the `express` module from the Node.js package manager. */
const express = require("express");
/* Creating an instance of the express class. */
const app = express();
/* Importing the `jsonwebtoken` module from the Node.js package manager. */
const jwt = require("jsonwebtoken");
/* Telling the server to parse the request body as JSON. */
app.use(express.json());
/* A dummy Data. */
/* Creating an array of objects. */
const posts = [
  { username: "joi", title: "Ahmed is not good" },
  { username: "osku", title: "Saed is good" },
];

/* A route that returns the posts array. */
app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.username));
});

/* MiddaleWares */
function authenticateToken(req, res, next) {
  /* Checking if the request has a header with the key `Authorization` and if it does, it is extracting
  the value of the header. */
  const authHeader = req.headers["authorization"];
  /* This is a ternary operator that checks if the `authHeader` is not null and if it is not null, it
 will return the second element of the array that is created by splitting the string on the space
 character. */
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    /* Assigning the user object to the req.user property of the request object. */
    req.user = user;
    next();
  });
}
/* A constant Port from variable. */
const PORT = 3000;
/* A callback function that is called when the server is listening on the port. */
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
