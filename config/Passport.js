const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/User');  // Import your Sequelize User model

// Using a Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' 
  },
  async (email, password, done) => {
    try {
      // Fetch the user from the database using the Sequelize model
      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }

      // Use bcrypt to compare the supplied password with the hashed password in the database
      bcrypt.compare(password, user.passwordHash, (err, isMatch) => {
        if (err) {
          return done(err);
        }

        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    } catch (e) {
      return done(e);
    }
  }
));

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (e) {
    done(e, null);
  }
});
