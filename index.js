const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');

const passport = require('passport');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const { scheduleNotifications } = require('./config/push');
require('dotenv').config();

// Database setup
//const { sequelize } = require('./database');

// Passport config
require('./config/passport-setup');

// Initialize Express app
const routes = require('./routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));

const MySQLStore = require('express-mysql-session')(session);

// Initialize session store
const sessionStore = new MySQLStore({
  host: "localhost",
  port: "3306",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.use(session({
  key: 'my_app_session',
  secret: process.env.session_secret || crypto.randomBytes(64).toString('hex'),  // Use random string if no secret is provided
  store: sessionStore,

  resave: false,
  saveUninitialized: true
}));


// Initialize Passport and restore authentication state from the session
app.use(passport.initialize());
app.use(passport.session());

// Handlebars
app.engine('handlebars', exphbs.engine({
  layoutsDir: path.join(__dirname, 'views/'),
  defaultLayout: 'main',
  partialsDir: path.join(__dirname, 'views/partials/')
}));

app.set('view engine', 'handlebars');

app.use(express.json());

// Error-handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

// // Test database connection and synchronize models
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Database connected...');
//     return sequelize.sync();
//   })
//   .catch((err) => {
//     console.error('Unable to connect to the database:', err);
//   });


app.get('/', (req, res) => {
  res.render('content/landing');
});

app.get('/login', (req, res) => {
  res.render('content/login');
});

app.get('/signup', (req, res) => {
  res.render('content/signup');
});

app.get('/test', (req, res) => {
  res.render('content/test');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log("Caught login request with username: " + email + " and password: " + password)

  // Store info in session
  req.session.email = "text@example.com";
  req.session.userId = 1;
  req.session.username = "testuser";

  console.log(req.session.username)
  
  res.redirect('/');
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected...');
    return sequelize.sync();
  })
  .then(() => {
    // Schedule notifications after the database is connected and synchronized
    scheduleNotifications();
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });



app.use('/', routes);

app.listen(3000, () => {
  console.log('The application is running on localhost:3000!')
});
