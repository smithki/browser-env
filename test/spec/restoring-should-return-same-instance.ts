import test from 'ava';
import browserEnv from '../../src';

test('Restoring returns the same instance', t => {
  t.is(browserEnv(), browserEnv.restore() as any);
});
