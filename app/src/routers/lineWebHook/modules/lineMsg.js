// @flow strict
'use strict';

/**
 * @fileOverview This is library for LINE SDK.
 *
 * @author Motone Adachi (waritocomatta)
 * @version 1.0.0
 */

/**
 * Pushed LINE message reply task by 'hears' Function to this Array.
 * @type {((event: Object)=> void)[]}
 */
const TO_DO_ARR: ((event: Object)=> void)[] = [];

/**
 * Message validation.
 * @type {RegExp[]}
 */
const REGEX_ARR: RegExp[] = [];

/**
 * Message routing.
 * @type {'user': number[], 'group': number[], 'room': number[]}
 */
const ROUTER: {
  'user': number[],
  'group': number[],
  'room': number[]
} = {
  'user': [],
  'group': [],
  'room': []
};

/**
 * Router positions.
 * @see ROUTER
 */
const ROUTERPositions: string[] = Object.keys(ROUTER);

/**
 * Given event by parent's event handler.
 * @type {(event: Object, callback: (event: Object, heard: boolean) => void) => boolean}
 * @param {Object} event
 * @param {(event: Object, heard: boolean) => void} callback
 * @see TO_DO_ARR
 */
export const ear: (
  event: Object,
  callback: (event: Object, heard: boolean) => void
) => boolean = (
  event: Object,
  callback: (event: Object, heard: boolean) => void
): boolean => {
  if (event.type !== 'message') {
    callback(event, false);
    return true;
  }

  /**
   * Is event matching in TO_DO_ARR.
   * @type {boolean}
   */
  let heard: boolean = false;

  for (const regexI: number of ROUTER[event.source.type]) {
    if (!(REGEX_ARR[regexI].test(event.message.text))) {
      continue;
    }

    heard = true;
    TO_DO_ARR[regexI](event);

    break;
  }

  callback(event, heard);

  return true;
};

/**
 * @type {(regex: RegExp, positions: string[], toDo: (event: Object) => void}
 * @param {RegExp} regex
 * @param {string[]} positions
 * @param {(event: Object) => void} toDo
 * @see TO_DO_ARR
 * @see REGEX_ARR
 * @see ROUTER
 */
export const hears: (
  regex: RegExp,
  positions: string[],
  toDo: (event: Object) => void
) => boolean = (
  regex: RegExp,
  positions: string[],
  toDo: (event: Object) => void
): boolean => {
  if (positions.length === 0) {
    return false;
  }

  /**
   * All routing.
   * @type {boolean}
   */
  const IS_IT_ALL: boolean = (positions.indexOf('all') !== -1);

  /**
   * Is position supposed.
   * @type {boolean}
   */
  const IS_IT_SUPPOSED: boolean = !(ROUTERPositions.some((position: string) => {
    return (positions.indexOf(position) !== -1);
  }));

  if (!IS_IT_ALL && IS_IT_SUPPOSED) {
    return false;
  }

  /**
   * TO_DO_ARR length.
   * @type {number}
   */
  const TO_DO_ARR_LEN: number = TO_DO_ARR.length;

  TO_DO_ARR.push(toDo);
  REGEX_ARR.push(regex);

  if (IS_IT_ALL) {
    for (let position: string in ROUTER) {
      ROUTER[position].push(TO_DO_ARR_LEN);
    }
    return true;
  }

  for (const position: string of positions) {
    ROUTER[position].push(TO_DO_ARR_LEN);
  }

  return true;
};
