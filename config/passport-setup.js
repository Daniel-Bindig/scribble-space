const passport = require('passport');
// Import localStrategy
require('./localStrategy');

// Serialization and deserialization logic for storing user info in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const db = require('./database'); // Import the database connection
    const [row] = await db.query('SELECT * FROM Users WHERE id = ?', [id]);
    
    if (row.length === 1) {
      return done(null, row[0]);
    } else {
      return done(new Error('User not found.'));
    }
  } catch (err) {
    return done(err);
  }
});

module.exports = passport;
