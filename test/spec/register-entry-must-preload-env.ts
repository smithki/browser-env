import test from 'ava';
import { spawnSync } from 'child_process';

test('Register entry point must preload env', t => {
  const { stdout } = spawnSync('node', ['-r', '../register', '--eval', 'console.log(typeof window)']);
  t.not(stdout.toString(), 'undefined');
});
