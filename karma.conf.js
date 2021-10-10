module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jameine','@angular-devkit/build-angular'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          '--no-sandbox',
          '--remote-debugging-port=9222'
        ]
      }
    },
    browsers: ['ChromeHeadless','Chrome'],
    singleRun: true,
  })
}
