// @flow strict
'use strict';

/**
 * @fileOverview Sequelize Loader.
 *
 * @author Motone Adachi (waritocomatta)
 * @version 1.0.0
 */

import SequelizeModule from 'sequelize';
import path from 'path';
import winston from 'winston';

winston.add(new winston.transports.File({
  'level': 'debug',
  'format': winston.format.json(),
  'filename': path.resolve(__dirname, '..', '..', 'log', 'sql.log')
}));

winston.add(new winston.transports.Console({
  'level': 'debug',
  'format': winston.format.simple()
}));

/**
 * Sequelize module.
 * @type {Object}
 */
export const Sequelize: Object = SequelizeModule;

/**
 * Sequelize instance.
 * @type {Object}
 */
export const SEQUELIZE: Object = new Sequelize('database', process.env.DB_USER, process.env.DB_PASSWORD, {
  'dialect': 'sqlite',
  'storage': path.resolve(__dirname, '..', '..', 'db', 'main.sqlite3'),
  'operatorsAliases': false,
  'benchmark': true,
  'logging': (sql: string, execTime: number) => {
    winston.debug(`${sql} - execTime: ${execTime}`);
  }
});
