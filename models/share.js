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
  sharedUserId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: true
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
Share.belongsTo(User, { foreignKey: 'sharedUserId' });

module.exports = Share;
