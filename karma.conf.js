// Karma configuration

const webpack = require('./webpack.config');

const sauceLabsLaunchers = { // Check out https://saucelabs.com/platforms for all browser/platform combos
    slSafari7: {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'OS X 10.9'
    },
    slIE10: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: '10'
    },
    slIE11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: '11'
    },
    slChrome: {
        base: 'SauceLabs',
        browserName: 'chrome'
    },
    slFirefox: {
        base: 'SauceLabs',
        browserName: 'firefox'
    },
    slAndroid5: {
        base: 'SauceLabs',
        browserName: 'android',
        version: '5.1'
    },
    slAndroid4: {
        base: 'SauceLabs',
        browserName: 'android',
        version: '4.4'
    }
};

module.exports = function (config) {
    config.set({
        // this key is used by karma-webpack, see preprocessors below
        webpack,

        // the default mime type for ts files is video/mp2t, which Chrome won't execute, so force correct mime type
        mime: {
            "text/x-typescript": ["ts", "tsx"],
        },

        customLaunchers: sauceLabsLaunchers,

        sauceLabs: {
            startConnect: false,
            build: 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')',
            tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
        },
        captureTimeout: 120000,
        browserNoActivityTimeout: 25000,

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha'],


        // list of files / patterns to load in the browser
        files: [
            './node_modules/core-js/client/shim.min.js',
            './test/index.browser.ts'
        ],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            './test/index.browser.ts': ['webpack']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['dots'],
        // reporters: process.env.TRAVIS ? ['dots', 'saucelabs'] : ['dots'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],
        // browsers: process.env.TRAVIS ? Object.keys(sauceLabsLaunchers) : ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
