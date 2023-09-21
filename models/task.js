const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database'); // Make sure to adjust the path to your Sequelize initialization file

class Task extends Model {}

Task.init(
  {
    // Define your columns and their data types here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    }
  },
  {
    // Other model options go here
    sequelize, // The connection instance
    modelName: 'Task', // The name of the model
    tableName: 'tasks', // The table name in the database
    timestamps: true // Enable timestamps like createdAt and updatedAt
  }
);

module.exports = Task;
