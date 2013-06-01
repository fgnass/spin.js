/**
  https://github.com/cloudhead/node-static
  http://nodejs.org/api/http.html

  http://visionmedia.github.io/mocha/
  https://code.google.com/p/selenium/wiki/WebDriverJs
  https://code.google.com/p/selenium/wiki/FrequentlyAskedQuestions
*/
var Webdriver    = require('../lib/webdriver.js'),
    StaticServer = require('../lib/static-server.js'),
    test         = require('selenium-webdriver/testing'),
    assert       = require('assert'),
    util         = require('util'),
    webdriver    = Webdriver.webdriver,

    seleniumServer,
    driver,
    http;

test.describe('Sample Test', function() {

  var urlSpinTest = "http://localhost:9001/tests/spin.js.test.html",
      target      = "document.getElementsByTagName('body')[0]",
      script      = "return new Spinner(%j).spin(%s)";

  test.before(function() {
    http   = StaticServer.server();
    server = Webdriver.server();
    driver = Webdriver.driver();
  });

  test.describe('Spin Test Page', function() {
    test.it('should have 34 div elements when create a spinner with 17 lines', function() {
      driver.get( urlSpinTest );
      driver.executeScript( util.format(script, {lines: 17}, target) );
      driver.executeScript( "return $('.spinner div').length" ).then( function(result) {
        assert.equal( result, 34, "The number of lines should be 34. The double of 17." );
      });
    });
  });

  test.after(function() {
    http.close();
    driver.quit();
    server.stop();
  });
});
