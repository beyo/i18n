
const TMP_FILE_PREFIX = 'beyo-i18n-json-loader-';

var Loader = require('../../lib/loader/json');
var tmp = require('tmp');
var fs = require('fs');
var Q = require('q');

describe('Json Loader', function() {

  var testLocale = 'test';
  var testFilePath;
  var testMessages = {
    'Hello world!': 'Test!',
    'Hello plural!': {
      '1': 'Hello you!',
      '*': 'Hello everyone!'
    }
  };

  var newMsgId = 'Foo!';
  var newMsgText = 'Bar!';


  before(function (done) {
    var fileContent = JSON.stringify(testMessages);

    tmp.dir({ prefix: TMP_FILE_PREFIX, unsafeCleanup: true }, function tmpDirCreated(err, path) {
      if (err) {
        throw err;
      }
      var file = path + '/' + testLocale + '.json';

      fs.writeFile(file, fileContent, function(err) {
        if (err) {
          throw err;
        }

        testFilePath = file;

        done();
      });
    });
  });

  it('should not try to parse invalid files', function * () {

    var testValues = [
      true, false, null, undefined, 0,
      "foo", "foo.txt", "foo.js.txt", "foo.json.txt", "js", "json", ".js", ".json",
      // invalid files
      "/path/to/some/invalid/file.json"
    ];

    this.timeout(500);

    for (var i = 0, len = testValues.length; i < len; i++) {
      (yield Loader(testValues[i])).should.be.false;
    }
  });

  it('should load and parse valid files', function * () {
    var loader = yield Loader(testFilePath);

    loader.should.have.property('locale').and.be.type('string');
    loader.should.have.property('contains').and.be.type('function');
    loader.should.have.property('get').and.be.type('function');
    loader.should.have.property('forEach').and.be.type('function').and.have.lengthOf(1);
  });

  it('should have a valid `locale` value', function * () {
    var loader = yield Loader(testFilePath);

    loader.locale.should.equal(testLocale);
  });

  it('should return messages through `getMessage`', function * () {
    var loader = yield Loader(testFilePath);
    var message;

    Object.keys(testMessages).forEach(function * (msgId) {
      message = yield loader.get(msgId);

      testMessages[msgId].should.equal(message);
    });
  });

  it('should have a valid `forEach` iterator', function * () {
    var loader = yield Loader(testFilePath);
    var keys;

    for (var i = 0; i < 10; i++) {
      keys = Object.keys(testMessages);
      loader.forEach(function (msgId) {
        var keyIndex = keys.indexOf(msgId)

        keyIndex.should.be.greaterThan(-1);

        keys.splice(keyIndex, 1);
      });

      keys.should.have.lengthOf(0);
    }
  });

  it('should break out of `forEach` iterator', function * () {
    var loader = yield Loader(testFilePath);
    var count1 = 0;
    var count2 = 0;

    loader.forEach(function (key) {
      count1++;
    });

    loader.forEach(function (key) {
      count2++;
      return false;
    });

    count1.should.not.equal(count2);
    count1.should.equal(Object.keys(testMessages).length);
    count2.should.equal(1);
  });

});
