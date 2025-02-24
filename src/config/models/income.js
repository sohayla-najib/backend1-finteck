const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Income = sequelize.define('Income', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    currency: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false }
});

module.exports = Income;
