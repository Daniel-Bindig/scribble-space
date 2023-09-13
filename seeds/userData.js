const User = require('../models/user.js');

const userData = [
  {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    passwordHash: 'password',
    createdAt: new Date("January 1, 1970 00:00:00 UTC"),
    updatedAt: new Date("January 1, 1971 00:00:00 UTC"),
  }
];

const seed = () => User.bulkCreate(userData);

module.exports = seed;