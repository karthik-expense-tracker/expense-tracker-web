import "@testing-library/jest-dom";

if (typeof globalThis.crypto === "undefined") {
  globalThis.crypto = { randomUUID: () => Math.random().toString(36).slice(2) };
}
