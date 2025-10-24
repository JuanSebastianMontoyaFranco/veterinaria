'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Op } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    const timestamp = new Date();
    await queryInterface.bulkInsert('Accesses', [
      {
        name: 'manage-users',
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        name: 'manage-pets',
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        name: 'view-pets',
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        name: 'manage-appointments',
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        name: 'view-appointments',
        createdAt: timestamp,
        updatedAt: timestamp
      }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Accesses', {
      name: {
        [Op.in]: [
          'manage-users',
          'manage-pets',
          'view-pets',
          'manage-appointments',
          'view-appointments'
        ]
      }
    }, {});
  }
};
