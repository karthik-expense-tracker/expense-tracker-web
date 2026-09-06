// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

if (!globalThis.crypto || typeof globalThis.crypto.randomUUID !== "function") {
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: {
      ...(globalThis.crypto || {}),
      randomUUID: () => `test-id-${Math.random().toString(36).slice(2)}`,
    },
  });
}
