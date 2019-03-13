// @flow strict
'use strict';

import { Selector } from 'testcafe';
import assert from 'assert';

require('dotenv').config();

fixture('LIFF page').page(`http://${String(process.env.TEST_HOST)}:${String(process.env.PORT)}`);

test('"LIKE" button is exist.', async I => {
  await assert(Selector('#like').innerText, '👍 LIKE');
});
