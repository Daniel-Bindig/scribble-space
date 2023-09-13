const Entry = require('../models/entry.js');

const entryData = [
  {
    id: 1,
    userId: 1,
    title: 'test entry',
    content: 'test content',
    tags: 'test, entry',
    createdAt: new Date("January 1, 1970 00:00:00 UTC"),
    updatedAt: new Date("January 1, 1971 00:00:00 UTC"),
  }
];

const seed = () => Entry.bulkCreate(entryData);

module.exports = seed;