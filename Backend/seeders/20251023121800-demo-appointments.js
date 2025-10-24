'use strict';

const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const timestamp = new Date();
    const [pets] = await queryInterface.sequelize.query("SELECT id, name FROM Pets WHERE adoptionStatus = 'owned'");
    const pet = pets[0];

    if (!pet) {
      throw new Error('Expected at least one owned pet before running appointment seeds');
    }

    await queryInterface.bulkInsert('Appointments', [
      {
        date: new Date(timestamp.getTime() + 24 * 60 * 60 * 1000),
        reason: 'Annual vaccination',
        notes: 'Reminder: bring vaccination card',
        PetId: pet.id,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Appointments', {
      reason: {
        [Op.eq]: 'Annual vaccination'
      }
    }, {});
  }
};
