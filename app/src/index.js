// @flow strict
'use strict';

/**
 * @fileOverview TOP.
 *
 * @author Motone Adachi (waritocomatta)
 * @version 1.0.0
 */

import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import expressSession from 'express-session';
import http from 'http';
import socketIO from 'socket.io';
import path from 'path';
import rfs from 'rotating-file-stream';

require('dotenv').config();

/**
 * Express
 * @type {Object}
 */
const EXP: Object = express();

/**
 * HTTP Server
 * @type {Object}
 */
const SERVER: Object = http.createServer(EXP);

/**
 * Socket IO
 * @type {Object}
 */
export const IO: Object = socketIO.listen(SERVER);

/**
 * ⚠ Must exec this when after 'io' was declared.<br>
 * Because 'lineWebHook' access parent's 'io'.
 */
EXP.use('/callback', require('./routers/lineWebHook').ROUTER);

EXP.use('/lineIdToInf', require('./routers/lineIdToInf').ROUTER);

EXP.use(morgan('combined', {
  'stream': rfs('access.log', {
    'size': '10MB',
    'interval': '10d',
    'compress': 'gzip',
    'path': path.resolve(__dirname, '..', 'log')
  })
}));

EXP.use(helmet());

EXP.set('trust proxy', 1);
EXP.use(expressSession({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    domain: process.env.DOMAIN,
    expires: new Date(Date.now() + 60 * 60 * 1000)
  }
}));

EXP.use(express.static(path.resolve(__dirname, '..', 'public')));

EXP.set('views', path.resolve(__dirname, '..', 'views'));
EXP.set('view engine', 'ejs');

SERVER.listen(process.env.PORT, String(process.env.HOST), () => console.log(`listening on port ${String(process.env.PORT)}!`));

EXP.use((req, res, next) => res.status(404).render('error', { code: 404 }));
EXP.use((req, res, next) => res.status(500).render('error', { code: 500 }));
