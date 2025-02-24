const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    isSuperAdmin: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = Admin;
