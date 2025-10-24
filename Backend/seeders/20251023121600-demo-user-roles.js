'use strict';

const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const timestamp = new Date();
    const [roles] = await queryInterface.sequelize.query('SELECT id, name FROM Roles');
    const [users] = await queryInterface.sequelize.query('SELECT id, email FROM Users');

    const findIdByProp = (collection, prop, value) => {
      const match = collection.find((item) => item[prop] === value);
      if (!match) {
        throw new Error(`Missing seed dependency for ${value}`);
      }
      return match.id;
    };

    const adminRoleId = findIdByProp(roles, 'name', 'admin');
    const userRoleId = findIdByProp(roles, 'name', 'user');

    const adminUserId = findIdByProp(users, 'email', 'admin@veterinaria.com');
    const clientUserId = findIdByProp(users, 'email', 'client@veterinaria.com');

    await queryInterface.bulkInsert('UserRoles', [
      {
        UserId: adminUserId,
        RoleId: adminRoleId,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        UserId: adminUserId,
        RoleId: userRoleId,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        UserId: clientUserId,
        RoleId: userRoleId,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    ], {});
  },

  async down(queryInterface) {
    const [users] = await queryInterface.sequelize.query('SELECT id, email FROM Users');
    const ids = users
      .filter((user) => ['admin@veterinaria.com', 'client@veterinaria.com'].includes(user.email))
      .map((user) => user.id);

    if (ids.length === 0) {
      return;
    }

    await queryInterface.bulkDelete('UserRoles', {
      UserId: {
        [Op.in]: ids
      }
    }, {});
  }
};
