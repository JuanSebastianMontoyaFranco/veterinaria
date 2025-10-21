'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Seed Roles
    await queryInterface.bulkInsert('Roles', [
      { name: 'admin', createdAt: new Date(), updatedAt: new Date() },
      { name: 'user', createdAt: new Date(), updatedAt: new Date() },
    ], {});

    // Seed Accesses
    await queryInterface.bulkInsert('Accesses', [
      { name: 'manage_users', createdAt: new Date(), updatedAt: new Date() },
      { name: 'view_users', createdAt: new Date(), updatedAt: new Date() },
      { name: 'manage_roles', createdAt: new Date(), updatedAt: new Date() },
      { name: 'view_roles', createdAt: new Date(), updatedAt: new Date() },
    ], {});

    // Associate all accesses with the admin role
    const adminRole = await queryInterface.sequelize.query(
      `SELECT id from Roles WHERE name = 'admin';`
    );
    const accesses = await queryInterface.sequelize.query(
      `SELECT id from Accesses;`
    );

    const adminRoleId = adminRole[0][0].id;
    const accessIds = accesses[0].map(access => access.id);

    const roleAccessData = accessIds.map(accessId => ({
      RoleId: adminRoleId,
      AccessId: accessId,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('RoleAccesses', roleAccessData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('RoleAccesses', null, {});
    await queryInterface.bulkDelete('Accesses', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
