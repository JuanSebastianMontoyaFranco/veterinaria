'use strict';
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const timestamp = new Date();
    const salt = await bcrypt.genSalt(10);

    const [adminPassword, clientPassword] = await Promise.all([
      bcrypt.hash('changeme123', salt),
      bcrypt.hash('clientpass123', salt)
    ]);

    await queryInterface.bulkInsert('Users', [
      {
        name: 'System Admin',
        email: 'admin@veterinaria.com',
        password: adminPassword,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        name: 'Client Owner',
        email: 'client@veterinaria.com',
        password: clientPassword,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', {
      email: {
        [Op.in]: ['admin@veterinaria.com', 'client@veterinaria.com']
      }
    }, {});
  }
};
