const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME || 'finance_tracker', process.env.DB_USER || 'root', process.env.DB_PASS || '', {
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  logging: console.log,
});

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Connection Established Successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    process.exit(1); // Exit process if DB connection fails
  }
};

connect();

module.exports = sequelize;
