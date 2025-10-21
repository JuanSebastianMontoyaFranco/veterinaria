const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Access = sequelize.define('Access', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

module.exports = Access;
