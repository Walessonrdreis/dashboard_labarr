import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Estende os matchers do expect
expect.extend(matchers);

// Limpa após cada teste
afterEach(() => {
  cleanup();
}); 