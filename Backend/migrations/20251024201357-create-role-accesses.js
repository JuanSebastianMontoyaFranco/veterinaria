'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RoleAccesses', {
      RoleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Roles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true
      },
      AccessId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Accesses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    await queryInterface.addIndex('RoleAccesses', ['AccessId'], {
      name: 'role_accesses_access_id_idx'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('RoleAccesses', 'role_accesses_access_id_idx');
    await queryInterface.dropTable('RoleAccesses');
  }
};
