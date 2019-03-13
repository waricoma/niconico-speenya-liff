// @flow strict
'use strict';

/**
 * @fileOverview Sequelize Users model.
 *
 * @author Motone Adachi (waritocomatta)
 * @version 1.0.0
 */

import { Sequelize, SEQUELIZE } from './sequelizeLoader';

/**
 * Users model.
 * @type {Object}
 */
export const User: Object = SEQUELIZE.define('users', {
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
}, { 'freezeTableName': true, 'timestamps': true });
