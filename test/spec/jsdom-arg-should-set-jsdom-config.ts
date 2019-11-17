import test from 'ava';
import browserEnv from '../../src';

test('JSDOM arg should set JSDOM config', t => {
  const userAgent = 'Custom user agent';
  t.is(typeof navigator, 'undefined');
  browserEnv(['navigator'], { userAgent });
  t.is(navigator.userAgent, userAgent);
});
