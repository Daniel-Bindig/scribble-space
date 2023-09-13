const User = require('./models/user.js');
const Entry = require('./models/entry.js');
const Reminder = require('./models/reminder.js');

// Get raw user data
async function getUserById(id) {
  const user = await User.findByPk(id);
  return user.get();
}

module.exports = {
  getUserById
};