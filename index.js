require('dotenv').config();
const express = require('express');
var samlRouter = require('./samlRouter');
const passport = require('passport');
const session = require('express-session');

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(samlRouter);

app.listen(3001, () => {
    console.log("Server startted at http://localhost:3001")
  });