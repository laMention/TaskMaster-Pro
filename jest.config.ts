module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: [
      '<rootDir>/src/**/__tests__/**/*.(ts|tsx|js)',
      '<rootDir>/src/**/?(*.)(spec|test).(ts|tsx|js)'
    ],
    moduleNameMapping: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '^@/(.*)$': '<rootDir>/src/$1'
    },
    collectCoverageFrom: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.d.ts',
      '!src/index.tsx',
      '!src/types/**/*',
      '!src/**/*.stories.{ts,tsx}'
    ],
    coverageReporters: ['text', 'lcov', 'html'],
    coverageDirectory: 'coverage',
    testTimeout: 10000,
    verbose: true,
    clearMocks: true,
    restoreMocks: true
  };