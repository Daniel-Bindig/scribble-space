const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection.js');
const Entry = require('./entry.js');

class Reminder extends Model {}

Reminder.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  entryId: {
    type: DataTypes.INTEGER,
    references: {
      model: Entry,
      key: 'id'
    },
    allowNull: false
  },
  reminderTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Reminder',
  tableName: 'Reminders',
  timestamps: true
});

Reminder.belongsTo(Entry, { foreignKey: 'entryId' });

module.exports = Reminder;
