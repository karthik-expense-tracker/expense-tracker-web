const path = require('path');
const createJestConfig = require('react-scripts/scripts/utils/createJestConfig');

const config = createJestConfig(
  (relativePath) => path.resolve(__dirname, 'node_modules/react-scripts', relativePath),
  __dirname,
  false
);

config.roots = [path.resolve(__dirname, 'test')];
config.testMatch = ['<rootDir>/test/**/*.{spec,test}.{js,jsx,ts,tsx}'];
config.collectCoverageFrom = ['src/**/*.{js,jsx}'];

module.exports = config;