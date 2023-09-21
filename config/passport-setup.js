const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user'); 

// Serialization and deserialization logic for storing user info in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ where: { id: id } });
    if (user) {
      return done(null, user);
    } else {
      return done(new Error('User not found.'));
    }
  } catch (err) {
    return done(err);
  }
});

// LocalStrategy for authentication
passport.use(new LocalStrategy(
  async function(username, password, done) {
    try {
      const user = await User.findOne({ where: { email: username } });
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }

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

module.exports = passport;
