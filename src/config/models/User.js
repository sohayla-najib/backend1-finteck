const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require('../config/database'); // Ensure correct path for sequelize instance

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Disable timestamps if you don't need createdAt or updatedAt
    timestamps: false
});

module.exports = User;
