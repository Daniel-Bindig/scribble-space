const User = require('./models/user.js');
const Entry = require('./models/entry.js');
const Reminder = require('./models/reminder.js');

// Get raw user data
async function getUserById(id) {
  const user = await User.findByPk(id);
  return user.get();
}

async function getAllEntriesOfUser(userId) {
  const entries = await Entry.findAll({
    where: {
      "userId": userId
    }
  });
  return entries.map(entry => entry.get());
}

module.exports = {
  getUserById,
  getAllEntriesOfUser
};