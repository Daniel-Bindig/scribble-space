const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection.js');
const Entry = require('./entry.js');
const User = require('./user.js');

class Share extends Model {}

Share.init({
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
  accessKey: {
    type: DataTypes.STRING(255),
    allowNull: true
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
  modelName: 'Share',
  tableName: 'SharedEntries',
  timestamps: true
});

Share.belongsTo(Entry, { foreignKey: 'entryId' });

module.exports = Share;
