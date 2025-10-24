'use strict';

const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const timestamp = new Date();
    const [users] = await queryInterface.sequelize.query('SELECT id, email FROM Users');
    const clientUser = users.find((user) => user.email === 'client@veterinaria.com');

    if (!clientUser) {
      throw new Error('Expected seed user client@veterinaria.com to exist before Owners seed runs');
    }

    await queryInterface.bulkInsert('Owners', [
      {
        name: 'Laura Martinez',
        phone: '+57-300-000-0000',
        address: 'Calle 123 #45-67, Medellin',
        UserId: clientUser.id,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Owners', {
      phone: {
        [Op.eq]: '+57-300-000-0000'
      }
    }, {});
  }
};
