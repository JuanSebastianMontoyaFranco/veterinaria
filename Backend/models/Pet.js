const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pet = sequelize.define('Pet', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    adoptionStatus: {
        type: DataTypes.ENUM('owned', 'adoption'),
        allowNull: false,
        defaultValue: 'adoption'
    },
    breed: {
        type: DataTypes.STRING,
        allowNull: true
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ageRange: {
        type: DataTypes.STRING,
        allowNull: true
    },
    feedingType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    diseases: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Pet;
