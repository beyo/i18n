
const TMP_FILE_PREFIX = 'beyo-i18n-json-adapter-';

var adapter = require('../../lib/adapter/json');
var tmp = require('tmp');
var fs = require('fs');


describe('Json Adapter', function() {

  var testLocale = 'test';
  var testFilePath = {};
  var testMessages = {
    'Hello world!': 'Test!',
    'Hello plural!': {
      'one': 'Hello you!',
      'other': 'Hello everyone!'
    }
  };

  before(function(done) {
    var fileContent = JSON.stringify(testMessages);
    var dataExtensions = {'.js': 'module.exports = ', '.json': ''};

    tmp.dir({ prefix: TMP_FILE_PREFIX, unsafeCleanup: true }, function tmpDirCreated(err, path) {
      if (err) {
        throw err;
      }
      Object.keys(dataExtensions).forEach(function(ext) {
        var file = path + '/' + testLocale + ext;
        var content = dataExtensions[ext] + fileContent;

        fs.writeFile(file, content, function(err) {
          if (err) {
            throw err;
          }

          testFilePath[ext] = file;

          if (Object.keys(testFilePath).length === Object.keys(dataExtensions).length) {
            done();
          }
        });
      });
    });
  });

  it('should not try to parse invalid files', function() {
    [
      true, false, null, undefined, 0,
      "foo", "foo.txt", "foo.js.txt", "foo.json.txt", "js", "json", ".js", ".json"
    ].forEach(function(invalidFilename) {
      adapter(invalidFilename).should.be.false;
    });
  });

  it('should load and parse valid files', function() {
    Object.keys(testFilePath).map(function(ext) {
      return testFilePath[ext];
    }).forEach(function(file) {
      var loadedMessages = adapter(file);

      loadedMessages.should.be.an.Object;
      loadedMessages.should.eql({
        locale: testLocale,
        messages: testMessages
      });
    });
  });

});
