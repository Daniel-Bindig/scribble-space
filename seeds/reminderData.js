const Reminder = require('../models/reminder.js');

const reminderData = [
  {
    id: 1,
    entryId: 1,
    reminderTime: new Date("January 1, 1972 00:00:00 UTC"),
    isCompleted: false,
    createdAt: new Date("January 1, 1970 00:00:00 UTC"),
    updatedAt: new Date("January 1, 1971 00:00:00 UTC"),
  }
];

const seed = () => Reminder.bulkCreate(reminderData);

module.exports = seed;