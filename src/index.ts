// This file is modified from:
// - https://github.com/lukechilds/window/blob/master/src/index.js
// - https://github.com/lukechilds/browser-env/blob/master/src/index.js

import { ConstructorOptions, DOMWindow, JSDOM, ResourceLoader, ResourceLoaderConstructorOptions } from 'jsdom';
import { get, toPath } from 'lodash';

// --- Types ---------------------------------------------------------------- //

interface WindowOptions extends Omit<ConstructorOptions, 'resources'> {
  resources: ResourceLoaderConstructorOptions;
}

type Many<T> = T | readonly T[];
type PropertyName = string | number | symbol;
type PropertyPath = Many<PropertyName>;

// --- Utilities ------------------------------------------------------------ //

let savedWindowOptions: WindowOptions | undefined = undefined;

/**
 * Encapsulates the Window object produced by JSDOM.
 */
function createWindow(options: WindowOptions = {} as any) {
  savedWindowOptions = options;
  const resources = new ResourceLoader(options.resources);
  return new JSDOM('', { ...options, resources }).window;
}

/**
 * IIFE executed on import to return an array of global Node.js properties that
 * conflict with global browser properties.
 */
const protectedProperties = (() =>
  // @ts-ignore
  Object.getOwnPropertyNames(createWindow()).filter(prop => typeof global[prop] !== 'undefined'))();

/**
 * A cache of protected global property descriptors.
 */
const savedGlobalDescriptors = new Map<string, PropertyDescriptor>();

/**
 * Restores the original property descriptor of protected properties that have
 * been stubbed by the `stubWindowProperty` function.
 */
function cleanProtectedProperties() {
  // If we stubbed a protected property, then we need to restore the original
  // value at each path.
  if (savedGlobalDescriptors.size) {
    for (const [path, descriptor] of savedGlobalDescriptors) {
      const parsedPath = JSON.parse(path);
      const pathQualified = Array.isArray(parsedPath) ? parsedPath : [parsedPath];
      const pathMinusLastElement = pathQualified.slice(0, -1);
      const lastInPath = pathQualified[pathQualified.length - 1];
      const source = get(global, pathMinusLastElement, global);
      Object.defineProperty(source, lastInPath, descriptor);
    }
    savedGlobalDescriptors.clear();
  }
}

// --- Public Interface ----------------------------------------------------- //

/**
 * Builds a mocked browser environment using JSDOM.
 *
 * @param properties - Properties to retain on the `Window` object built by JSDOM.
 * @param options - Options to configure the JSDOM instance.
 */
export function browserEnv(properties?: (keyof Window)[]): DOMWindow;
export function browserEnv(options?: WindowOptions): DOMWindow;
export function browserEnv(properties?: (keyof Window)[], options?: WindowOptions): DOMWindow;
export function browserEnv(propertiesOrOptions?: (keyof Window)[] | WindowOptions, options?: WindowOptions): DOMWindow {
  cleanProtectedProperties();

  const properties = Array.isArray(propertiesOrOptions) ? propertiesOrOptions : undefined;
  const optionsResolved = Array.isArray(propertiesOrOptions) ? options : propertiesOrOptions;

  // Create window object
  const win = createWindow(optionsResolved);

  // Get all global browser properties
  Object.getOwnPropertyNames(win)

    // Remove protected properties
    .filter(prop => !protectedProperties.includes(prop))

    // If we're only applying specific required properties remove everything else
    .filter(prop => !(properties && !properties.includes(prop as any)))

    // Copy what's left to the Node.js global scope
    .forEach(prop => {
      Object.defineProperty(global, prop, {
        configurable: true,
        // @ts-ignore
        get: () => win[prop],
      });
    });

  // Return reference to original window object
  return win;
}

/**
 * Stub a property on the `Window` object at the given `path`.
 *
 * @param path - A path within the window object to stub.
 * @param value - A replacement value for the given path.
 */
// tslint:disable:prettier
export function stubWindowProperty<TValue, TKey extends keyof Window>(path: TKey | [TKey], value: TValue): void;
export function stubWindowProperty<TValue, TKey1 extends keyof Window, TKey2 extends keyof Window[TKey1]>(path: [TKey1, TKey2], value: TValue): void;
export function stubWindowProperty<TValue, TKey1 extends keyof Window, TKey2 extends keyof Window[TKey1], TKey3 extends keyof Window[TKey1][TKey2]>(path: [TKey1, TKey2, TKey3], value: TValue): void;
export function stubWindowProperty<TValue, TKey1 extends keyof Window, TKey2 extends keyof Window[TKey1], TKey3 extends keyof Window[TKey1][TKey2], TKey4 extends keyof Window[TKey1][TKey2][TKey3]>(path: [TKey1, TKey2, TKey3, TKey4], value: TValue): void;
export function stubWindowProperty<TValue, TKey1 extends keyof Window, TKey2 extends keyof Window[TKey1], TKey3 extends keyof Window[TKey1][TKey2], TKey4 extends keyof Window[TKey1][TKey2][TKey3], TKey5 extends keyof Window[TKey1][TKey2][TKey3][TKey4]>(path: [TKey1, TKey2, TKey3, TKey4, TKey5], value: TValue): void;
export function stubWindowProperty<TValue, TKey1 extends keyof Window, TKey2 extends keyof Window[TKey1], TKey3 extends keyof Window[TKey1][TKey2], TKey4 extends keyof Window[TKey1][TKey2][TKey3], TKey5 extends keyof Window[TKey1][TKey2][TKey3][TKey4], TKey6 extends keyof Window[TKey1][TKey2][TKey3][TKey4][TKey5]>(path: [TKey1, TKey2, TKey3, TKey4, TKey5, TKey6], value: TValue): void;
export function stubWindowProperty<TValue, TKey1 extends keyof Window, TKey2 extends keyof Window[TKey1], TKey3 extends keyof Window[TKey1][TKey2], TKey4 extends keyof Window[TKey1][TKey2][TKey3], TKey5 extends keyof Window[TKey1][TKey2][TKey3][TKey4], TKey6 extends keyof Window[TKey1][TKey2][TKey3][TKey4][TKey5], TKey7 extends keyof Window[TKey1][TKey2][TKey3][TKey4][TKey5][TKey6]>(path: [TKey1, TKey2, TKey3, TKey4, TKey5, TKey6, TKey7], value: TValue): void;
export function stubWindowProperty<TValue, TKey1 extends keyof Window, TKey2 extends keyof Window[TKey1], TKey3 extends keyof Window[TKey1][TKey2], TKey4 extends keyof Window[TKey1][TKey2][TKey3], TKey5 extends keyof Window[TKey1][TKey2][TKey3][TKey4], TKey6 extends keyof Window[TKey1][TKey2][TKey3][TKey4][TKey5], TKey7 extends keyof Window[TKey1][TKey2][TKey3][TKey4][TKey5][TKey6], TKey8 extends keyof Window[TKey1][TKey2][TKey3][TKey4][TKey5][TKey6][TKey7]>(path: [TKey1, TKey2, TKey3, TKey4, TKey5, TKey6, TKey7, TKey8], value: TValue): void;
export function stubWindowProperty<TValue, TKey1 extends keyof Window, TKey2 extends keyof Window[TKey1], TKey3 extends keyof Window[TKey1][TKey2], TKey4 extends keyof Window[TKey1][TKey2][TKey3], TKey5 extends keyof Window[TKey1][TKey2][TKey3][TKey4], TKey6 extends keyof Window[TKey1][TKey2][TKey3][TKey4][TKey5], TKey7 extends keyof Window[TKey1][TKey2][TKey3][TKey4][TKey5][TKey6], TKey8 extends keyof Window[TKey1][TKey2][TKey3][TKey4][TKey5][TKey6][TKey7], TKey9 extends keyof Window[TKey1][TKey2][TKey3][TKey4][TKey5][TKey6][TKey7][TKey9]>(path: [TKey1, TKey2, TKey3, TKey4, TKey5, TKey6, TKey7, TKey8, TKey9], value: TValue): void;
export function stubWindowProperty(path: PropertyPath, value: any): void;
// tslint:enable:prettier
export function stubWindowProperty(path: PropertyPath, value: any): void {
  const pathQualified = toPath(path);
  const pathMinusLastElement = pathQualified.slice(0, -1);
  const pathKey = JSON.stringify(path);
  const firstInPath = pathQualified[0];
  const lastInPath = pathQualified[pathQualified.length - 1];
  const isProtectedPath = protectedProperties.includes(firstInPath);

  // Extract the source object that we'll be stubbing.
  const source = isProtectedPath
    ? get(global, pathMinusLastElement, global)
    : get((global as any).window, pathMinusLastElement, (global as any).window);

  // If we are stubbing a protected property, save the original descriptor so we
  // can restore it later.
  const sourceDescriptor = Object.getOwnPropertyDescriptor(source, lastInPath);
  if (isProtectedPath && !savedGlobalDescriptors.has(pathKey) && sourceDescriptor) {
    savedGlobalDescriptors.set(pathKey, sourceDescriptor);
  }

  // Replace the indicated value with a readonly stub.
  Object.defineProperty(source, lastInPath, {
    configurable: true,
    get: () => value,
  });
}

/**
 * Rebuild the window object, removing any previously applied stubs. The same
 * configuration that was passed to the originating `browserEnv` call will be
 * used.
 */
export function restoreWindow() {
  cleanProtectedProperties();
  return browserEnv(savedWindowOptions);
}
