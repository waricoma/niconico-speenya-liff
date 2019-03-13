// @flow strict
'use strict';

import express from 'express';
import { User } from '../models/user';

/**
 * Express router.
 * @type {Object}
 */
export const ROUTER: Object = express.Router();

ROUTER.post('/', (req, res) => {
  req.on('data', (data: Object) => {
    if (data.length > 60) {
      res.status(400).json({ 'err': 'data size over.' });
      return;
    }
    User.findOne({ 'where': { 'lineId': data.toString() } }).then((user: Object) => {
      if (!user) {
        res.status(400).json({ 'err': 'not find line id.' });
        return;
      }
      res.status(200).json({ 'inf': {
        'sizeId': user.sizeId,
        'speedId': user.speedId,
        'colorId': user.colorId
      } });
    });
  });
});
