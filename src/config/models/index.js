const sequelize = require('../config/database');
const admin = require('./admin');
const category = require('./category');
const income = require('./income');
const expense = require('./expense');
const ProfitGoal = require('./ProfitGoal');

// Relationships:
// An Admin can create Categories, Incomes, Expenses, and ProfitGoals.
admin.hasMany(category);
category.belongsTo(admin);

admin.hasMany(income);
income.belongsTo(admin);

admin.hasMany(expense);
expense.belongsTo(admin);

admin.hasMany(ProfitGoal);
ProfitGoal.belongsTo(admin);

module.exports = { sequelize, admin, category, income, expense, ProfitGoal };
