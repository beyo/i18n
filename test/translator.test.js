
const TMP_FILE_PREFIX = 'beyo-i18n-translator-';

var Translator = require('../lib/translator');
var tmp = require('tmp');
var fs = require('fs');
var co = require('co');
var Q = require('q');

var I18N = require('../lib/index');


describe('Testing Translator', function () {

  var localePath;
  var testLocale = 'test';
  var testLocaleSpecs = {
    name: 'TestLang',
    plural: function plural(n) { return (n === 1) ? 'one' : 'other'; }
  };
  var testMessages = {
    'Hello world!': 'Test!',
    'Hello plural!': {
      'one': 'Hello you!',
      'other': 'Hello everyone!'
    },
    '{{count}} notifications': {
      'one': '1 message',
      'other': '{{count}} messages'
    }
  };

  before(function (done) {
    I18N.setLocale(testLocale, testLocaleSpecs);

    tmp.dir({ prefix: TMP_FILE_PREFIX, unsafeCleanup: true }, function tmpDirCreated(err, path) {
      if (err) {
        throw err;
      }
      var file = path + '/' + testLocale + '.json';

      localePath = path;

      fs.writeFile(file, JSON.stringify(testMessages), function (err) {
        if (err) {
          throw err;
        }

        done();
      });
    });
  });


  it('should emit `initialized` event after initialization', function (done) {
    new Translator().on('initialized', function (err) {
      assert.equal(err, undefined);
      done();
    });

    this.timeout(500);
  });

  it('should fail initializing', function (done) {
    (function () {
      new Translator({ defaultLocale: "###INVALIDLOCALE" });
    }).should.throw();

    new Translator({ locales: "***INVALIDPATH" }).on('initialized', function (err) {
      err.should.be.instanceof(Error);

      done();
    });

    this.timeout(500);
  });


  it('should fail with invalid locales', function (done) {
    [
      true, false, null, undefined, {}, -1, 0, 1, 2, 3
    ].forEach(function(locales, index, arr) {
      new Translator({ locales: locales }).on('initialized', function (err) {
        err.should.be.instanceof(Error);

        if (index === arr.length - 1) {
          done();
        }
      });
    });

    this.timeout(500);
  });

  it('should load locales from specified directory', function (done) {
    new Translator({ locales: localePath }).on('initialized', function (err) {
      assert.equal(err, null);

      // test that we have loaded the locale correctly
      Q.async(this.translate).call(this, 'Hello world!', { locale: testLocale }).should.equal('Test!');

      done();
    });

    this.timeout(500);
  });

  it('should load locales from array', function (done) {
    var arr = [
      localePath + '/' + testLocale + '.json'
    ];

    new Translator({ locales: arr }).on('initialized', function (err) {
      assert.equal(err, null);

      // test that we have loaded the locale correctly
      Q.async(this.translate).call(this, 'Hello world!', { locale: testLocale }).should.equal('Test!');

      done();
    });

    this.timeout(500);
  });

  it('should load locales after init', function * () {
    var translator = new Translator({ defaultLocale: testLocale });

    translator.defaultLocale.should.equal(testLocale);

    yield translator.load(localePath);

    (yield translator.translate('Hello world!')).should.equal('Test!');
  });


  it('should only allow valid `defaultLocale` values', function () {
    var translator = new Translator();
    var _ref = translator.defaultLocale;

    [
      function f() {}, undefined, null, true, false, 0, 1, "", "##INVALIDVALUE"
    ].forEach(function (v) {
      (function() {
        translator.defaultLocale = v;
      }).should.throw();
    });

    _ref.should.equal(translator.defaultLocale);

    Object.keys(I18N.locales).forEach(function (locale) {
      translator.defaultLocale = locale;
    });
  });

  it('should not allow overriding `translate`', function () {
    var translator = new Translator();
    var _ref = translator.translate;

    [
      function f() {}, {}, undefined, null, true, false, 0, 1, "", "##INVALIDVALUE"
    ].forEach(function (v) {
      translator.translate = v;
      translator.translate.should.not.equal(v);
      _ref.should.equal(translator.translate);
    });
  });

  it('should only allow valid `defaultLocale` values', function () {
    var translator = new Translator();
    var _ref = translator.defaultLocale;

    [
      function f() {}, undefined, null, true, false, 0, 1, "", "##INVALIDVALUE"
    ].forEach(function (v) {
      (function() {
        translator.defaultLocale = v;
      }).should.throw();
    });

    _ref.should.equal(translator.defaultLocale);

    Object.keys(I18N.locales).forEach(function (locale) {
      translator.defaultLocale = locale;
    });
  });

  it('should translate messages', function * () {
    var translator = new Translator();

    translator.defaultLocale.should.not.equal(testLocale);

    yield translator.load(localePath);

    (yield translator.translate('Hello world!')).should.equal('Hello world!');
    (yield translator.translate('Hello world!', { locale: testLocale })).should.equal('Test!');
  });

  it('should handle plurality', function * () {
    var translator = new Translator();

    translator.defaultLocale.should.not.equal(testLocale);

    yield translator.load(localePath);

    (yield translator.translate('Hello plural!')).should.equal('Hello plural!');
    (yield translator.translate('Hello plural!', { locale: testLocale, plurality: 1 })).should.equal('Hello you!');

    (yield translator.translate('Hello plural!', { locale: testLocale })).should.equal('Hello everyone!');
    (yield translator.translate('Hello plural!', { locale: testLocale, plurality: -1 })).should.equal('Hello everyone!');
    (yield translator.translate('Hello plural!', { locale: testLocale, plurality: 0 })).should.equal('Hello everyone!');
    (yield translator.translate('Hello plural!', { locale: testLocale, plurality: 2 })).should.equal('Hello everyone!');
  });

  it('should handle gender');

  it('should substitute placeholders in messages', function * () {
    var translator = new Translator({ defaultLocale: testLocale });
    var data = {
      count: 10
    };

    translator.defaultLocale.should.equal(testLocale);

    yield translator.load(localePath);

    (yield translator.translate('{{count}} notifications')).should.equal(' messages');
    (yield translator.translate('{{count}} notifications', { data: data })).should.equal('10 messages');
    (yield translator.translate('{{count}} notifications', { plurality: 1, data: data })).should.equal('1 message');
    (yield translator.translate('{{count}} notifications', { plurality: 10, data: data })).should.equal('10 messages');
  });

});
