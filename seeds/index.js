const sequelize = require('../config/connection.js');
const seedUser = require('./userData.js');
const seedEntry = require('./entryData.js');
const seedReminder = require('./reminderData.js');

const seedAll = async () => {
  await sequelize.sync({ force: true });

  await seedUser();

  await seedEntry();

  await seedReminder();

  console.log('Database seeded')

  process.exit(0);
};

seedAll();