import test from 'ava';
import browserEnv from '../../src';

test("Existing NodeJS globals shouldn't get overwritten", t => {
  const origConsole = console;
  browserEnv();
  t.is(origConsole, console);
});
