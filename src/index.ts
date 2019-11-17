import { ConstructorOptions, DOMWindow, JSDOM, ResourceLoader, ResourceLoaderConstructorOptions } from 'jsdom';
import { get, toPath } from 'lodash';

// --- Types ---------------------------------------------------------------- //

type WindowOptions = Omit<ConstructorOptions, 'resources'> & ResourceLoaderConstructorOptions;
// type keyof typeof window = keyof typeof window;

// Typings borrowed from Lodash
type Many<T> = T | readonly T[];
type PropertyName = string | number | symbol;
type PropertyPath = Many<PropertyName>;

// --- Utilities ------------------------------------------------------------ //

let savedWindowOptions: WindowOptions | undefined = undefined;

/**
 * Encapsulates the Window object produced by JSDOM.
 *
 * @source https://github.com/lukechilds/window/blob/master/src/index.js
 */
/* istanbul ignore next */
function createWindow(options: WindowOptions = {} as any) {
  savedWindowOptions = options;
  const { proxy, strictSSL, userAgent } = options;
  const resources = new ResourceLoader({ proxy, strictSSL, userAgent });
  return new JSDOM('', { ...options, resources }).window;
}

/**
 * IIFE executed on import to return an array of global Node.js properties that
 * conflict with global browser properties.
 */
/* istanbul ignore next */
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
/* istanbul ignore next */
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
 * @param properties - A list of properties to map from `Window` to
 * `NodeJS.Global`. This reduces pollution at the global scope if only a subset
 * of window properties are required.
 * @param options - Options to configure the JSDOM instance.
 *
 * @source https://github.com/lukechilds/browser-env/blob/master/src/index.js
 */
function createBrowserEnv(properties?: (keyof typeof window)[]): DOMWindow;
function createBrowserEnv(options?: WindowOptions): DOMWindow;
function createBrowserEnv(properties?: (keyof typeof window)[], options?: WindowOptions): DOMWindow;
function createBrowserEnv(options?: WindowOptions, properties?: (keyof typeof window)[]): DOMWindow;
function createBrowserEnv(
  propertiesOrOptions?: (keyof typeof window)[] | WindowOptions,
  optionsOrProperties?: WindowOptions | (keyof typeof window)[],
): DOMWindow {
  cleanProtectedProperties();

  // Extract options from args
  const args = Array.from(arguments);
  const properties: (keyof typeof window)[] | undefined = args.filter(arg => Array.isArray(arg))[0];
  const options: WindowOptions | undefined = args.filter(arg => !Array.isArray(arg))[0];

  // Create window object
  const win = createWindow(options);

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
function stubWindowProperty<TValue, TKey extends keyof typeof window>(path: TKey | [TKey], value: TValue): void;
function stubWindowProperty<TValue, TKey1 extends keyof typeof window, TKey2 extends keyof typeof window[TKey1]>(path: [TKey1, TKey2], value: TValue): void;
function stubWindowProperty<TValue, TKey1 extends keyof typeof window, TKey2 extends keyof typeof window[TKey1], TKey3 extends keyof typeof window[TKey1][TKey2]>(path: [TKey1, TKey2, TKey3], value: TValue): void;
function stubWindowProperty<TValue, TKey1 extends keyof typeof window, TKey2 extends keyof typeof window[TKey1], TKey3 extends keyof typeof window[TKey1][TKey2], TKey4 extends keyof typeof window[TKey1][TKey2][TKey3]>(path: [TKey1, TKey2, TKey3, TKey4], value: TValue): void;
function stubWindowProperty<TValue, TKey1 extends keyof typeof window, TKey2 extends keyof typeof window[TKey1], TKey3 extends keyof typeof window[TKey1][TKey2], TKey4 extends keyof typeof window[TKey1][TKey2][TKey3], TKey5 extends keyof typeof window[TKey1][TKey2][TKey3][TKey4]>(path: [TKey1, TKey2, TKey3, TKey4, TKey5], value: TValue): void;
function stubWindowProperty<TValue, TKey1 extends keyof typeof window, TKey2 extends keyof typeof window[TKey1], TKey3 extends keyof typeof window[TKey1][TKey2], TKey4 extends keyof typeof window[TKey1][TKey2][TKey3], TKey5 extends keyof typeof window[TKey1][TKey2][TKey3][TKey4], TKey6 extends keyof typeof window[TKey1][TKey2][TKey3][TKey4][TKey5]>(path: [TKey1, TKey2, TKey3, TKey4, TKey5, TKey6], value: TValue): void;
function stubWindowProperty<TValue, TKey1 extends keyof typeof window, TKey2 extends keyof typeof window[TKey1], TKey3 extends keyof typeof window[TKey1][TKey2], TKey4 extends keyof typeof window[TKey1][TKey2][TKey3], TKey5 extends keyof typeof window[TKey1][TKey2][TKey3][TKey4], TKey6 extends keyof typeof window[TKey1][TKey2][TKey3][TKey4][TKey5], TKey7 extends keyof typeof window[TKey1][TKey2][TKey3][TKey4][TKey5][TKey6]>(path: [TKey1, TKey2, TKey3, TKey4, TKey5, TKey6, TKey7], value: TValue): void;
function stubWindowProperty<TValue, TKey1 extends keyof typeof window, TKey2 extends keyof typeof window[TKey1], TKey3 extends keyof typeof window[TKey1][TKey2], TKey4 extends keyof typeof window[TKey1][TKey2][TKey3], TKey5 extends keyof typeof window[TKey1][TKey2][TKey3][TKey4], TKey6 extends keyof typeof window[TKey1][TKey2][TKey3][TKey4][TKey5], TKey7 extends keyof typeof window[TKey1][TKey2][TKey3][TKey4][TKey5][TKey6], TKey8 extends keyof typeof window[TKey1][TKey2][TKey3][TKey4][TKey5][TKey6][TKey7]>(path: [TKey1, TKey2, TKey3, TKey4, TKey5, TKey6, TKey7, TKey8], value: TValue): void;
function stubWindowProperty<TValue, TKey1 extends keyof typeof window, TKey2 extends keyof typeof window[TKey1], TKey3 extends keyof typeof window[TKey1][TKey2], TKey4 extends keyof typeof window[TKey1][TKey2][TKey3], TKey5 extends keyof typeof window[TKey1][TKey2][TKey3][TKey4], TKey6 extends keyof typeof window[TKey1][TKey2][TKey3][TKey4][TKey5], TKey7 extends keyof typeof window[TKey1][TKey2][TKey3][TKey4][TKey5][TKey6], TKey8 extends keyof typeof window[TKey1][TKey2][TKey3][TKey4][TKey5][TKey6][TKey7], TKey9 extends keyof typeof window[TKey1][TKey2][TKey3][TKey4][TKey5][TKey6][TKey7][TKey8]>(path: [TKey1, TKey2, TKey3, TKey4, TKey5, TKey6, TKey7, TKey8, TKey9], value: TValue): void;
function stubWindowProperty(path: PropertyPath, value: any): void;
// tslint:enable:prettier
function stubWindowProperty(path: PropertyPath, value: any): void {
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
 * configuration passed to the previous `browserEnv` call will be used.
 */
function restoreWindow() {
  cleanProtectedProperties();
  return createBrowserEnv(savedWindowOptions);
}

export default Object.assign(createBrowserEnv, {
  stub: stubWindowProperty,
  restore: restoreWindow,
});
