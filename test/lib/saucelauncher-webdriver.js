/**
 * JavaScript tests integration with Sauce
 * https://saucelabs.com/docs/javascript-unit-tests-integration
 */

var wd = require('wd'),
    Q = require('q')
    request = require('request'),
    assert = require('assert'),
    host = "ondemand.saucelabs.com",
    port = 80,
    username = process.env.SAUCE_USERNAME,
    accessKey = process.env.SAUCE_ACCESS_KEY,
    // using promisified version of webdriver
    browser = wd.promiseRemote(host, port, username, accessKey),
    desired = {
      "browserName": process.argv[2],
      "version"    : process.argv[3],
      "platform"   : process.argv[4],
      "tags"       : ["spin.js", "test"],
      "name"       : "Spin.js tests",
      "public"     : "public",
      "build"      : process.env.TRAVIS_BUILD_NUMBER ? process.env.TRAVIS_BUILD_NUMBER : "dev-tests",
      "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER ? process.env.TRAVIS_JOB_NUMBER : "spin_js",
      "record-video": false
    };

browser.on("status", function(info) {
  console.log("\x1b[36m%s\x1b[0m", info);
});

browser.on("command", function(meth, path, data) {
  console.log(" > \x1b[33m%s\x1b[0m: %s", meth, path, data || "");
});

// general rest call helper function using promises
var api = function (url, method, data) {
  var deferred = Q.defer();
  request({
    method: method,
    uri: ["https://", username, ":", accessKey, "@saucelabs.com/rest", url].join(""),
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }, function (error, response, body) {
    deferred.resolve(response.body);
  });
  return deferred.promise;
};

function waitUntilResultsAreAvailable(js, timeout, start){
  if (start === undefined) { start = new Date(); }
  if (new Date() - start > timeout) { throw new Error("Timeout: Element not there"); }
  return browser.eval(js)
    .then(function (jsValue) {
      if (jsValue !== null) { return jsValue; }
      else { return waitUntilResultsAreAvailable(js, timeout, start); }
    });
}

// test case
browser.init(desired).then(function () {
  return browser.get("http://localhost:8080");
}).then(function () {
  return waitUntilResultsAreAvailable("window.mocha_reporter()", 5000);
}).then(function (jsreport) {
  // make an API call to Sauce - set custom-data with 'qunit' data
  var data = {
    'passed': jsreport.totalCount>0 && jsreport.passed,
    'custom-data': {'mocha': jsreport}
  };
  return api(["/v1/", username, "/jobs/", browser.sessionID].join(""), "PUT", data);
}).then(function (body) {
  console.log("CONGRATS - WE'RE DONE\n",
              "Check out test results at http://saucelabs.com/jobs/" + browser.sessionID + "\n",
              body);
}).fin(function () {
  return browser.quit();
}).done();
