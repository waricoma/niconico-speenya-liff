'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    return queryInterface.createTable('users', {
      'id': {
        'type': Sequelize.INTEGER,
        'primaryKey': true,
        'autoIncrement': true,
        'allowNull': false
      },
      'lineId': {
        'field': 'line-id',
        'type': Sequelize.STRING(200),
        'unique': true,
        'allowNull': false
      },
      'sizeId': {
        'field': 'size-id',
        'type': Sequelize.INTEGER(1),
        'allowNull': false,
        'defaultValue': 1
      },
      'speedId': {
        'field': 'speed-id',
        'type': Sequelize.INTEGER(1),
        'allowNull': false,
        'defaultValue': 1
      },
      'colorId': {
        'field': 'color-id',
        'type': Sequelize.INTEGER(1),
        'allowNull': false,
        'defaultValue': 0
      },
      'createdAt': {
        'field': 'created',
        'type': Sequelize.DATE,
        'allowNull': false
      },
      'updatedAt': {
        'field': 'updated',
        'type': Sequelize.DATE,
        'allowNull': false
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */

    return queryInterface.dropTable('users');
  }
};
