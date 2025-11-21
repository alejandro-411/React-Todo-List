// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock de nanoid para evitar problemas con ES modules en Jest
jest.mock('nanoid', () => {
  return {
    nanoid: () => Math.random().toString(36).substring(2, 15)
  };
});

