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
const { sequelize } = require('./database');

// Passport config
require('./config/passport-setup');

// Initialize Express app
const routes = require('./routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Middleware

// Whitelist remote scripts
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
  }
}));
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


// Check if user is authenticated, if they are send them to content/dashboard
// Otherwise, send them to content/landing
app.get('/', (req, res) => {
  console.log(req.session)
  if (req.session && req.session.passport && req.session.passport.user) { // This could probably be cleaner
    res.render('content/dashboard');
  } else {
    res.render('content/landing');
  }
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get('/test', (req, res) => {
  res.render('content/test');
});

// Test database connection and synchronize models
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
