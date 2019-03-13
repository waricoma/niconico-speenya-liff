// @flow strict
'use strict';

/**
 * @fileOverview LINE WebHook.
 *
 * @author Motone Adachi (waritocomatta)
 * @version 1.0.0
 */

import express from 'express';
import request from 'request';
import { User } from '../../models/user';
import * as line from '@line/bot-sdk';
import * as lineMsg from './modules/lineMsg';

/**
 * Express router.
 * @type {Object}
 */
export const ROUTER: Object = express.Router();

/**
 * Is connected this server and receiver.js ? *using Socket IO
 * @type {boolean}
 */
let connected: boolean = false;

module.parent.exports.IO.on('connection', () => {
  console.log('connected');
  connected = true;
});

/**
 * Config for LINE SDK. ( from .env )
 * @type {[string]: string}
 */
const LINE_CONFIG: {[string]: string} = {
  'channelAccessToken': String(process.env.LINE_ACCESS_TOKEN),
  'channelSecret': String(process.env.LINE_SECRET),
  'channelId': String(process.env.LINE_ID)
};

/**
 * LINE Client.
 * @type {Object}
 */
const LINE_CLIENT: Object = new line.Client(LINE_CONFIG);

ROUTER.post('/', line.middleware(LINE_CONFIG), (req: Object, res: Object, next: Object) => {
  Promise.all(req.body.events.map(HANDLE_EVENT)).then(result => {
    res.json(result);
  }).catch(() => {
    res.status(500).end();
  });
});

/**
 * Event handler.
 * @param {Object} event
 * @see lineMsg.ear
 */
const HANDLE_EVENT: Function = (event: Object) => {
  lineMsg.ear(event, (event: Object) => {
    /**
     * Line event object to JSON text for GAS api.
     * @type {number}
     */
    const eventToJSONText: string = JSON.stringify(event);

    request.post(
      process.env.GAS_URL,
      {
        'form': {
          'date': String(new Date(event.timestamp)),
          'message': event.message.text,
          'json': eventToJSONText
        }
      },
      (err: Object, res: Object, body: Object) => {
        if (err) {
          console.log(err, eventToJSONText);
        }
      }
    );
  });
};

/**
 * Sizes
 * @type {string[]}
 */
const SIZE_ARR: string[] = ['big', 'medium', 'small'];

lineMsg.hears(/^(!|！)size:(big|medium|small)$/i, ['all'], (event: Object) => {
  /**
   * Size name
   * @type {string}
   */
  const SIZE: string = event.message.text.replace(/(!|！)size:/, '');

  /**
   * Size id
   * @type {number}
   */
  const SIZE_ID: number = SIZE_ARR.indexOf(SIZE);

  if (SIZE_ID === -1) {
    return;
  }

  User.findOne({ 'where': { 'lineId': event.source.userId } }).then((user: Object) => {
    if (user) {
      user.sizeId = SIZE_ID;
      user.save();
    } else {
      User.create({
        lineId: event.source.userId,
        sizeId: SIZE_ID
      });
    }
  });
});

/**
 * Speeds
 * @type {string[]}
 */
const SPEED_ARR: string[] = ['slow', 'medium', 'fast'];

lineMsg.hears(/^(!|！)speed:(slow|medium|fast)$/i, ['all'], (event: Object) => {
  /**
   * Speed name
   * @type {string}
   */
  const SPEED: string = event.message.text.replace(/(!|！)speed:/, '');

  /**
   * Speed id
   * @type {number}
   */
  const SPEED_ID: number = SPEED_ARR.indexOf(SPEED);

  if (SPEED_ID === -1) {
    return;
  }

  User.findOne({ 'where': { 'lineId': event.source.userId } }).then((user: Object) => {
    if (user) {
      user.speedId = SPEED_ID;
      user.save();
    } else {
      User.create({
        lineId: event.source.userId,
        sizeId: SPEED_ID
      });
    }
  });
});

/**
 * Colors
 * @type {string[]}
 */
const COLOR_ARR: string[] = ['black', 'red', 'blue', 'green'];

lineMsg.hears(/^(!|！)color:(black|red|blue|green)$/i, ['all'], (event: Object) => {
  /**
   * Color name
   * @type {string}
   */
  const COLOR: string = event.message.text.replace(/(!|！)color:/, '');

  /**
   * Color id
   * @type {number}
   */
  const COLOR_ID: number = COLOR_ARR.indexOf(COLOR);

  if (COLOR_ID === -1) {
    return;
  }

  User.findOne({ 'where': { 'lineId': event.source.userId } }).then((user: Object) => {
    if (user) {
      user.colorId = COLOR_ID;
      user.save();
    } else {
      User.create({
        lineId: event.source.userId,
        colorId: COLOR_ID
      });
    }
  });
});

lineMsg.hears(/^(!|！)like$/i, ['all'], (event: Object) => {
  if (connected) {
    module.parent.exports.IO.emit('like');
  }
});

lineMsg.hears(/^(!|！)(setting|設定)$/i, ['all'], (event: Object) => {
  LINE_CLIENT.replyMessage(event.replyToken, {
    type: 'template',
    altText: 'Likeボタンの表示、或いはBot の設定を行います。',
    template: {
      type: 'confirm',
      text: 'Likeボタンの表示、或いはBot の設定を行います。',
      actions: [
        {
          type: 'uri',
          uri: process.env.LINE_FRONTEND_FLAME_WORK,
          label: 'OPEN'
        },
        {
          type: 'uri',
          uri: process.env.SHEET,
          label: 'Check archive.'
        }
      ]
    }
  });
});

lineMsg.hears(/.*/i, ['all'], (event: Object) => {
  if (!connected) {
    return;
  }

  User.findOne({ 'where': { 'lineId': event.source.userId } }).then((user: Object) => {
    if (user) {
      module.parent.exports.IO.emit('comment', { 'text': event.message.text, 'colorId': user.colorId, 'speedId': user.speedId, 'sizeId': user.sizeId });
    } else {
      User.create({
        'lineId': event.source.userId
      });
      module.parent.exports.IO.emit('comment', { 'text': event.message.text, 'colorId': 0, 'speedId': 1, 'sizeId': 1 });
    }
  });
});
