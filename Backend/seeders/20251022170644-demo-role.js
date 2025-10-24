'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Op } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    const timestamp = new Date();
    await queryInterface.bulkInsert('Roles', [
      {
        name: 'admin',
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        name: 'user',
        createdAt: timestamp,
        updatedAt: timestamp
      }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Roles', {
      name: {
        [Op.in]: ['admin', 'user']
      }
    }, {});
  }
};
