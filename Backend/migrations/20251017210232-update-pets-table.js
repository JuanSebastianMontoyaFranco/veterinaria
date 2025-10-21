'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Pets', 'photo', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Pets', 'adoptionStatus', {
      type: Sequelize.ENUM('owned', 'adoption'),
      allowNull: false,
      defaultValue: 'adoption',
    });
    await queryInterface.addColumn('Pets', 'color', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Pets', 'ageRange', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Pets', 'feedingType', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Pets', 'diseases', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.removeColumn('Pets', 'species');
    await queryInterface.removeColumn('Pets', 'age');
    await queryInterface.removeColumn('Pets', 'gender');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Pets', 'photo');
    await queryInterface.removeColumn('Pets', 'adoptionStatus');
    await queryInterface.removeColumn('Pets', 'color');
    await queryInterface.removeColumn('Pets', 'ageRange');
    await queryInterface.removeColumn('Pets', 'feedingType');
    await queryInterface.removeColumn('Pets', 'diseases');
    await queryInterface.addColumn('Pets', 'species', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('Pets', 'age', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('Pets', 'gender', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
