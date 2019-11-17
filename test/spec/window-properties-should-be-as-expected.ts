import test from 'ava';
import { xor } from 'lodash';
import browserEnv from '../../src';
import expectedProperties from '../fixtures/expected-properties.json';

test('Window properties should be as expected', t => {
  browserEnv();
  const properties = Object.getOwnPropertyNames(window);
  t.true(xor(expectedProperties, properties).length === 0);
});
