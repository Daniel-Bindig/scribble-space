const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../database'); // Import the database connection

passport.use(new LocalStrategy(
  async function(username, password, done) {
    try {
      const [row] = await db.query('SELECT * FROM Users WHERE username = ?', [username]);
      if (row.length === 0) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const user = row[0];
      const isValid = await bcrypt.compare(password, user.passwordHash);

      if (isValid) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    } catch (err) {
      return done(err);
    }
  }
));
