const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection.js');
const User = require('./user.js');

class Entry extends Model {}

Entry.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  tags: {
    type: DataTypes.TEXT
  },
  entryDate: {
    type: DataTypes.DATEONLY
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
  modelName: 'Entry',
  tableName: 'Entries',
  timestamps: true
});

Entry.belongsTo(User, { foreignKey: 'userId' });

module.exports = Entry;
