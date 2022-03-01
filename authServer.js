/* Here we show the power of JWT becuse session cokies cant veryfiy reqs with many servers */
/* Loading the environment variables from the `.env` file. */
require("dotenv").config();
/* Importing the `express` module from the Node.js package manager. */
const express = require("express");
const { send } = require("express/lib/response");
/* Creating an instance of the express class. */
const app = express();
/* Importing the `jsonwebtoken` module from the Node.js package manager. */
const jwt = require("jsonwebtoken");
/* Telling the server to parse the request body as JSON. */
app.use(express.json());

/* Generate Access Token. */
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
}

/* Creating an array of objects. */
let refreshTokens = [];

/* This is deleting the refresh token from the array of refresh tokens. */
app.delete("/logout",  (req, res) => {
  refreshTokens =  refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

/* A callback function that is called when the server receives a POST request to the `/login` route. */
app.post("/login", (req, res) => {
  /* Extracting the username from the request body. */
  const username = req.body.username;
  /* Creating a user object with the username. */
  const user = { username: username };
  /* Creating a JWT token. */
  /* This is creating a JWT token that is used to authenticate the user. */
  const accessToken = generateAccessToken(user);
  /* This is creating a refresh token that can be used to generate a new access token. */
  const refreshToken = jwt.sign(user, process.env.REFRESH_ACCESS_TOKEN);
  refreshTokens.push(refreshToken);
  /* Sending the access token to the client. */
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});




app.post("/token", (req, res) => {
  /* This is checking if the refresh token is in the array of refresh tokens. */
  const refreshToken = req.body.token;
  /* This is checking if the refresh token is null. If it is null then it will return a 401 status
  code. */
  if (refreshToken === null) return res.sendStatus(401);
 /* This is checking if the refresh token is in the array of refresh tokens. If it is not in the array
 of refresh tokens then it will return a 403 status code. */
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  /* `jwt.verify` is verifying the token. */
  jwt.verify(refreshToken, process.env.REFRESH_ACCESS_TOKEN, (err, user) => {
    if (err) send.status(403);
   /* This is creating a JWT token that is used to authenticate the user. */
    const accessToken = generateAccessToken({ username: user.username });
    res.json({ accessToken });
  });
});

/* A constant Port from variable. */
const PORT = 4000;
/* A callback function that is called when the server is listening on the port. */
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
