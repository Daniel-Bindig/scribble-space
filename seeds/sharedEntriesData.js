const Share = require('../models/share.js');

const reminderData = [];

const seed = () => Share.bulkCreate(reminderData);

module.exports = seed;