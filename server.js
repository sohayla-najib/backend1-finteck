const express = require('express');
const sequelize = require('./config/database.js');
const cors = require('cors');
const db = require("./config/database.js");



const app = express();

// Port
const port = process.PORT || 4000;
sequelize.sync();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors("*"));



// Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});