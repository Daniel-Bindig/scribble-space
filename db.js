const User = require('./models/user.js');
const Entry = require('./models/entry.js');
const Reminder = require('./models/reminder.js');

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

async function createReminder(reminderData) {
  const reminder = await Reminder.create(reminderData);
  return reminder
}

async function getReminderById(id) {
  const reminder = await Reminder.findOne({
    where: {
      "id": id
    }
  });
  return reminder.get();
}

module.exports = {
  getUserById,
  getAllEntriesOfUser,
  createReminder,
  getReminderById
};