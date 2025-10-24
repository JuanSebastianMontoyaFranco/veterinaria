'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      photo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      adoptionStatus: {
        type: Sequelize.ENUM('owned', 'adoption'),
        allowNull: false,
        defaultValue: 'adoption'
      },
      breed: {
        type: Sequelize.STRING,
        allowNull: true
      },
      color: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ageRange: {
        type: Sequelize.STRING,
        allowNull: true
      },
      feedingType: {
        type: Sequelize.STRING,
        allowNull: true
      },
      diseases: {
        type: Sequelize.STRING,
        allowNull: true
      },
      OwnerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Owners',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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

    await queryInterface.addIndex('Pets', ['OwnerId'], {
      name: 'pets_owner_id_idx'
    });
  },
  async down(queryInterface) {
    await queryInterface.removeIndex('Pets', 'pets_owner_id_idx');
    await queryInterface.dropTable('Pets');
  }
};
