var webdriver = require('selenium-webdriver'),
    remote    = require('selenium-webdriver/remote'),
    server,
    driver;

exports.webdriver = webdriver;

exports.server = function() {
  server = new remote.SeleniumServer({
    jar: process.env.SELENIUM,
    port: 4444
  });
  server.start();
  return server;
};

exports.driver = function() {
  driver = new webdriver.Builder().
    usingServer(server.address()).
    withCapabilities({'browserName': 'firefox'}).
    build();
  return driver;
};
