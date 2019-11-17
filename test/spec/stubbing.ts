import test from 'ava';
import browserEnv from '../../src';

test('Stubbing/restoring a top-level property should be possible', t => {
  browserEnv();
  t.is(typeof (global as any).addEventListener, 'function');
  t.is(typeof window.addEventListener, 'function');

  browserEnv.stub('addEventListener', 999);
  t.is((global as any).addEventListener, 999);
  t.is(window.addEventListener, 999 as any);

  browserEnv.restore();
  t.is(typeof (global as any).addEventListener, 'function');
  t.is(typeof window.addEventListener, 'function');
});

test('Stubbing and re-stubbing a top-level property should be possible', t => {
  browserEnv();
  t.is(typeof (global as any).addEventListener, 'function');
  t.is(typeof window.addEventListener, 'function');

  browserEnv.stub('addEventListener', 999);
  t.is((global as any).addEventListener, 999);
  t.is(window.addEventListener, 999 as any);

  browserEnv.stub('addEventListener', 'hello world');
  t.is((global as any).addEventListener, 'hello world');
  t.is(window.addEventListener, 'hello world' as any);

  browserEnv.restore();
  t.is(typeof (global as any).addEventListener, 'function');
  t.is(typeof window.addEventListener, 'function');
});

test('Stubbing/restoring a deeply-nested property should be possible', t => {
  browserEnv();
  t.is(typeof (global as any).document.body, 'object');
  t.is(typeof window.document.body, 'object');

  browserEnv.stub('document.body', 999);
  t.is((global as any).document.body, 999);
  t.is(window.document.body, 999 as any);
  t.is(typeof (global as any).document.createElement, 'function');
  t.is(typeof window.document.createElement, 'function');

  browserEnv.restore();
  t.is(typeof (global as any).document.body, 'object');
  t.is(typeof window.document.body, 'object');
});

test('Stubbing and re-stubbing a deeply-nested property should be possible', t => {
  browserEnv();
  t.is(typeof (global as any).document.body, 'object');
  t.is(typeof window.document.body, 'object');

  browserEnv.stub('document.body', 999);
  t.is((global as any).document.body, 999);
  t.is(window.document.body, 999 as any);
  t.is(typeof (global as any).document.createElement, 'function');
  t.is(typeof window.document.createElement, 'function');

  browserEnv.stub('document.body', 'hello world');
  t.is((global as any).document.body, 'hello world');
  t.is(window.document.body, 'hello world' as any);
  t.is(typeof (global as any).document.createElement, 'function');
  t.is(typeof window.document.createElement, 'function');

  browserEnv.restore();
  t.is(typeof (global as any).document.body, 'object');
  t.is(typeof window.document.body, 'object');
});
