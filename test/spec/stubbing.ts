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

test('Restoring using the return value of `browserEnv.stub` should work for unprotected properties', t => {
  browserEnv();
  t.is(typeof (global as any).addEventListener, 'function');
  t.is(typeof window.addEventListener, 'function');
  t.is(typeof (global as any).document.body, 'object');
  t.is(typeof window.document.body, 'object');

  browserEnv.stub('addEventListener', 123);
  t.is((global as any).addEventListener, 123);
  t.is(window.addEventListener, 123 as any);

  const restore = browserEnv.stub('document.body', 999);
  t.is((global as any).document.body, 999);
  t.is(window.document.body, 999 as any);
  t.is(typeof (global as any).document.createElement, 'function');
  t.is(typeof window.document.createElement, 'function');

  restore();
  t.is(typeof (global as any).document.body, 'object');
  t.is(typeof window.document.body, 'object');
  t.is((global as any).addEventListener, 123);
  t.is(window.addEventListener, 123 as any);
});

test('Stubbing/restoring a protected property should work', t => {
  browserEnv();
  t.is(typeof (global as any).console, 'object');
  t.is(typeof window.console, 'object');

  browserEnv.stub('console', 123);
  t.is((global as any).console, 123);
  t.is(window.console, 123 as any);

  browserEnv.restore();
  t.is(typeof (global as any).console, 'object');
  t.is(typeof window.console, 'object');
});

test('Restoring using the return value of `browserEnv.stub` should work for protected properties', t => {
  browserEnv();
  t.is(typeof (global as any).addEventListener, 'function');
  t.is(typeof window.addEventListener, 'function');
  t.is(typeof (global as any).console, 'object');
  t.is(typeof window.console, 'object');

  browserEnv.stub('addEventListener', 123);
  t.is((global as any).addEventListener, 123);
  t.is(window.addEventListener, 123 as any);

  const restore = browserEnv.stub('console', 999);
  t.is((global as any).console, 999);
  t.is(window.console, 999 as any);

  restore();
  t.is(typeof (global as any).console, 'object');
  t.is(typeof window.console, 'object');
  t.is((global as any).addEventListener, 123);
  t.is(window.addEventListener, 123 as any);
});
