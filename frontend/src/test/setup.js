import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

globalThis.fetch = globalThis.fetch || (() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve([]),
}));
