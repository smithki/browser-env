
# @ikscodes/browser-env

> Simulates a global browser environment using [`jsdom`](https://github.com/tmpvar/jsdom).

<!-- [![Build Status](https://travis-ci.org/lukechilds/browser-env.svg?branch=master)](https://travis-ci.org/lukechilds/browser-env)
[![Coverage Status](https://coveralls.io/repos/github/lukechilds/browser-env/badge.svg?branch=master)](https://coveralls.io/github/lukechilds/browser-env?branch=master)
[![npm](https://img.shields.io/npm/dm/browser-env.svg)](https://www.npmjs.com/package/browser-env)
[![npm](https://img.shields.io/npm/v/browser-env.svg)](https://www.npmjs.com/package/browser-env) -->

This is a drop-in replacement for [`browser-env`](https://github.com/lukechilds/browser-env) with built-in TypeScript typings and simple stubbing features.

This allows you to run browser modules in Node.js 6 or newer with minimal or no effort. Can also be used to test browser modules with any Node.js test framework. Please note, only the DOM is simulated, if you want to run a module that requires more advanced browser features (like `localStorage`), you'll need to polyfill that seperately.

> ❗️**Important note**
>
> This module adds properties from the `jsdom` window namespace to the Node.js global namespace. This is explicitly [recommended against](https://github.com/tmpvar/jsdom/wiki/Don't-stuff-jsdom-globals-onto-the-Node-global) by `jsdom`. There may be scenarios where this is ok for your use case but please read through the linked wiki page and make sure you understand the caveats. If you don't need the browser environment enabled globally, [`window`](https://github.com/lukechilds/window) may be a better solution.

## Install

```sh
npm install --save @ikscodes/browser-env
```

Or if you're just using for testing you'll probably want:

```sh
npm install --save-dev @ikscodes/browser-env
```

## Usage

```ts
// Init
import browserEnv from '@ikscodes/browser-env';
browserEnv();

// Now you have access to a browser like environment in Node.js:

typeof window;
// => 'object'

typeof document;
// => 'object'

var div = document.createElement('div');
// => HTMLDivElement

div instanceof HTMLElement
// => true
```

By default everything in the `jsdom` window namespace is tacked on to the Node.js global namespace (excluding existing Node.js properties e.g `console`, `setTimout`). If you want to trim this down you can pass an array of required properties:

```ts
// Init
import browserEnv from '@ikscodes/browser-env';
browserEnv(['window']);

typeof window;
// => 'object'

typeof document;
// => 'undefined'
```

You can also pass a config object straight through to `jsdom`. This can be done with or without specifying required properties.

```ts
import browserEnv from '@ikscodes/browser-env';
browserEnv(['window'], { userAgent: 'My User Agent' });

// or

import browserEnv from '@ikscodes/browser-env';
browserEnv({ userAgent: 'My User Agent' });

// or (it doesn't matter which order you provide the arguments).

import browserEnv from '@ikscodes/browser-env';
browserEnv({ userAgent: 'My User Agent' }, ['window']);
```

`browser-env` can also be preloaded at node startup as:

```sh
node -r @ikscodes/browser-env/register test.js
```

Sometimes, especially during tests, it can be useful to stub parts of `Window` behavior:

```ts
import browserEnv from '@ikscodes/browser-env';
import sinon from 'sinon';
browserEnv();

// Pathing argument is identical to `Lodash.get`
// (accepts an array of property identfiers or a string representation)
browserEnv.stub('document.createElement', sinon.stub());

document.createElement('iframe');
document.createElement.calledOnce // => true

// Remove all stubs
// (note: this rebuilds the window with the
//  same arguments passed to `browserEnv`).
browserEnv.restore();
document.createElement.calledOnce // => undefined
```

## Rationale

I love `browser-env`, but I required just a few more features to be productive:

1. I work mostly in TypeScript, so compatible typings are a _must!_
2. I often found myself stubbing `Window` properties during unit tests, which also means stubbing `NodeJs.Global` if the property exists in the NodeJS context. This presented a challenge while trying to keep unit tests DRY.

So `@ikscodes/browser-env` was born. I strive to keep feature parity and drop-in compatibility with the [original package](https://github.com/lukechilds/browser-env).
