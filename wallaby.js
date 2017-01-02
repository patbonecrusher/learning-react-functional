process.env.NODE_ENV = 'test';

module.exports = function (wallaby) {

  return {
    files: [
      'package.json',
      'src/*.js',
      'src/*.jsx'
    ],

    tests: ['tests/**/*.spec.js'],

    env: {
      type: 'node',
      runner: 'node'
    },

    testFramework: 'jest',
    compilers: {
      '**/*.js': wallaby.compilers.babel(),
      '**/*.jsx': wallaby.compilers.babel()
    },

    setup: function (wallaby) {
      require('babel-polyfill');
      require('./package.json').jest;
      wallaby.testFramework.configure({
        setupTestFrameworkScriptFile: './tests/test_helper.js'
        // https://facebook.github.io/jest/docs/api.html#config-options
        // you may just pass `require('./package.json').jest`, if you use it for your Jest config
        // don't forget to include package.json in the files list in this case
      });

    }
  };
};
