const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.engine('handlebars', exphbs.engine({
  layoutsDir: path.join(__dirname, 'views/'),
  defaultLayout: 'main',
  partialsDir: path.join(__dirname, 'views/partials/')
}));

app.set('view engine', 'handlebars');

app.use(session({
  secret: process.env.session_secret || 'secret',
  resave: false,
  saveUninitialized: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.render('content/landing');
});

app.get('/login', (req, res) => {
  res.render('content/login');
});

app.get('/signup', (req, res) => {
  res.render('content/signup');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log("Caught login request with username: " + email + " and password: " + password)

  // Store info in session
  req.session.email = email;
  
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('The application is running on localhost:3000!')
});
