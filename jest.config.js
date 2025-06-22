module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '/__tests__/.*\\.(test)\\.(ts)$',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleFileExtensions: [
    'js',
    'mjs',
    'cjs',
    'jsx',
    'ts',
    'mts',
    'cts',
    'tsx',
    'json',
    'node',
  ],
  verbose: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
