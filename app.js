// Required modules
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const exphbs = require('express-handlebars');


// Initialize dotenv 
dotenv.config();

// Database setup
const { sequelize } = require('./database');

// Passport config
require('./config/passport-setup');

// Initialize Express app
const app = express();



// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



const MySQLStore = require('express-mysql-session')(session);

// Initialize session store
const sessionStore = new MySQLStore({
  host: process.env.SESSION_DB_HOST,
  port: process.env.SESSION_DB_PORT,
  user: process.env.SESSION_DB_USER,
  password: process.env.SESSION_DB_PASSWORD,
  database: process.env.SESSION_DB_NAME
});


// Session middleware
app.use(
  session({
    key: 'my_app_session',  
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and restore authentication state from the session
app.use(passport.initialize());
app.use(passport.session());

// Fixed Configuring the Handlebars engine
app.engine('handlebars', exphbs.engine());
app.set('views', path.join(__dirname, 'layouts')); 
app.set('view engine', 'handlebars');

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/apiRoutes'));

// new routes for serving Handlebars templates
app.get('/main', (req, res) => {
  res.render('main'); // You can use the view name directly here
});

app.get('/login', (req, res) => {
  res.render('login'); // You can use the view name directly here
});

app.get('/signup', (req, res) => {
  res.render('signup'); // You can use the view name directly here
});




// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Test database connection and synchronize models
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected...');
    return sequelize.sync();
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Export app 
module.exports = app;
