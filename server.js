const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const session = require('express-session');
const { Sequelize, DataTypes } = require('sequelize');
const authRoutes = require('./routes/authRoutes');


// server.js

const app = require('./app'); // Import the app from app.js

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
