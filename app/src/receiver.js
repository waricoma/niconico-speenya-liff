// @flow strict
'use strict';

/**
 * @fileOverview Receiver. (with localhost:2525)
 *
 * @author Motone Adachi (waritocomatta)
 * @version 1.0.0
 */

import socketIOClient from 'socket.io-client';
import request from 'request';

require('dotenv').config();

/**
 * Socket IO client.
 * @type {Object}
 */
const SOCKET: Object = socketIOClient(`ws://${String(process.env.HOST)}:${String(process.env.PORT)}`);

/**
 * Header.
 * @type {[string]: string}
 */
const HEADERS: {[string]: string} = {
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en-US,en;q=0.9',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.120 Safari/537.36 Vivaldi/2.3.1440.57',
  'Accept': '*/*',
  'Referer': 'http://localhost:2525/',
  'X-Requested-With': 'XMLHttpRequest',
  'Connection': 'keep-alive',
  'Cookie': '_ga=GA1.1.1395643607.1551563832; _gid=GA1.1.1104520636.1551563832'
};

const SIZE_VAL_ARR: number[] = [64, 56, 48];
const SPEED_VAL_ARR: number[] = [4000, 3000, 2000];
const COLOR_VAL_ARR: string[] = ['black', 'red', 'blue', 'green'];

SOCKET.on('connect', () => {
  console.log('connected');

  SOCKET.on('comment', (msg: {'text': string, 'colorId': number, 'sizeId': number, 'speedId': number}) => {
    console.log(msg);
    request({
      'url': `http://localhost:2525/comment?body=${encodeURIComponent(msg.text)}&size=${SIZE_VAL_ARR[msg.sizeId]}&duration=${SPEED_VAL_ARR[msg.speedId]}&color=${COLOR_VAL_ARR[msg.colorId]}`,
      'headers': HEADERS
    }, (err: Object, res: Object, body: Object) => {
      if (!err && res.statusCode === 200) {
        console.log(body);
      }
    });
  });

  SOCKET.on('like', () => {
    request({
      url: 'http://localhost:2525/like?image=thumb',
      headers: HEADERS
    }, (err, res, body) => {
      if (err) {
        console.error(err);
      }
    });
  });
});

SOCKET.on('disconnect', () => {
  SOCKET.disconnect();
});
