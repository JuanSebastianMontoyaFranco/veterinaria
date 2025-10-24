'use strict';

const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const timestamp = new Date();
    const [roles] = await queryInterface.sequelize.query('SELECT id, name FROM Roles');
    const [accesses] = await queryInterface.sequelize.query('SELECT id, name FROM Accesses');

    const findIdByName = (collection, name) => {
      const match = collection.find((item) => item.name === name);
      if (!match) {
        throw new Error(`Missing seed dependency for ${name}`);
      }
      return match.id;
    };

    const adminRoleId = findIdByName(roles, 'admin');
    const userRoleId = findIdByName(roles, 'user');

    const manageUsersId = findIdByName(accesses, 'manage-users');
    const managePetsId = findIdByName(accesses, 'manage-pets');
    const viewPetsId = findIdByName(accesses, 'view-pets');
    const manageAppointmentsId = findIdByName(accesses, 'manage-appointments');
    const viewAppointmentsId = findIdByName(accesses, 'view-appointments');

    await queryInterface.bulkInsert('RoleAccesses', [
      // Admin role has access to everything
      {
        RoleId: adminRoleId,
        AccessId: manageUsersId,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        RoleId: adminRoleId,
        AccessId: managePetsId,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        RoleId: adminRoleId,
        AccessId: viewPetsId,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        RoleId: adminRoleId,
        AccessId: manageAppointmentsId,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        RoleId: adminRoleId,
        AccessId: viewAppointmentsId,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      // Standard user role receives read-only permissions
      {
        RoleId: userRoleId,
        AccessId: viewPetsId,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        RoleId: userRoleId,
        AccessId: viewAppointmentsId,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    ], {});
  },

  async down(queryInterface) {
    const [roles] = await queryInterface.sequelize.query('SELECT id, name FROM Roles');
    const ids = roles
      .filter((role) => ['admin', 'user'].includes(role.name))
      .map((role) => role.id);

    if (ids.length === 0) {
      return;
    }

    await queryInterface.bulkDelete('RoleAccesses', {
      RoleId: {
        [Op.in]: ids
      }
    }, {});
  }
};
