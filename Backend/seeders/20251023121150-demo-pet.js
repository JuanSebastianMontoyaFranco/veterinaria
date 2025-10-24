'use strict';

const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const timestamp = new Date();
    const [owners] = await queryInterface.sequelize.query('SELECT id, name FROM Owners');
    const owner = owners[0];

    if (!owner) {
      throw new Error('Expected an Owner record before running Pet seeds');
    }

    await queryInterface.bulkInsert('Pets', [
      {
        name: 'Fido',
        photo: null,
        adoptionStatus: 'owned',
        breed: 'Golden Retriever',
        color: 'Golden',
        ageRange: '2-4 years',
        feedingType: 'Dry food',
        diseases: 'None',
        OwnerId: owner.id,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        name: 'Mia',
        photo: null,
        adoptionStatus: 'adoption',
        breed: 'Domestic Short Hair',
        color: 'White & Gray',
        ageRange: '1-2 years',
        feedingType: 'Mixed',
        diseases: 'Dewormed',
        OwnerId: null,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Pets', {
      name: {
        [Op.in]: ['Fido', 'Mia']
      }
    }, {});
  }
};
