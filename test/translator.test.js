
const TMP_FILE_PREFIX = 'beyo-i18n-translator-';

var Translator = require('../lib/translator');
var tmp = require('tmp');
var fs = require('fs');
var co = require('co');
var Q = require('q');

var I18N = require('../lib/index');
var C = require('../lib/const');
var plurals = require('../lib/plurals');


describe('Testing Translator', function () {

  var localePath;
  var testLocale = 'test';
  var testLocaleRule = {
    languageName: 'TestLang',
    nplurals: [ C.PLURAL_ONE, C.PLURAL_OTHER ],
    plural: function (n) { return (n === 1) ? 0 : 1; }
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
    },
    'Hello you!': 'Hello {{person.names.0.first}}!',
    'Hello gender!': {
      'other': {
        'm': 'Hello m!',
        'f': 'Hello f!',
        'n': 'Hello n!'
      }
    },
    'Hello gender plural!': {
      'one': {
        'm': 'Hello m non-plural!',
        'n': 'Hello n non-plural!',
      },
      'other': {
        'f': 'Hello f plural!',
        'n': 'Hello n plural!'
      }
    },
    'Hello invalid gender!': {
      'other': {
        'f': 'Hello ladies!'
      }
    }
  };

  before(function (done) {
    plurals.setRule(testLocale, testLocaleRule);

    tmp.dir({ prefix: TMP_FILE_PREFIX, unsafeCleanup: true }, function tmpDirCreated(err, path) {
      if (err) {
        throw err;
      }
      var file = path + '/foo';

      localePath = path;

      fs.mkdir(file, function (err) {
        if (err) {
          throw err;
        }

        file += '/' + testLocale + '.json';

        fs.writeFile(file, JSON.stringify(testMessages), function (err) {
          if (err) {
            throw err;
          }

          done();
        });
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

  it('should load locales from specified directory', function * () {
    var translator = new Translator();

    yield translator.load(localePath);

    (yield translator.translate('Hello world!', { locale: testLocale })).should.equal('Test!');
  });

  it('should load locales from array', function * () {
    var translator = new Translator();

    yield translator.load([ localePath + '/foo/' + testLocale + '.json' ]);

    (yield translator.translate('Hello world!', { locale: testLocale })).should.equal('Test!');
  });

  it('should not load invalid locales', function (done) {
    var invalidLocales = [
      undefined, null, false, true, 0, 1, 2, 3, { whatever: 'foo' }
    ];
    var invalidLocalesCount = invalidLocales.length * 2;
    function checkDone() {
      if ((--invalidLocalesCount) <= 0) {
        done();
      }
    }

    invalidLocales.forEach(function (invalidLocale) {
      new Translator({ locales: invalidLocale }).on('initialized', function (err) {
        err.should.be.and.Error;
        checkDone();
      });
      new Translator({ locales: [ invalidLocale ] }).on('initialized', function (err) {
        err.should.be.an.Error;
        checkDone();
      });
    });

    this.timeout(500);
  });

  it('should not allow overriding locales', function (done) {
    var translator = new Translator({ locales: localePath }).on('initialized', function () {
      co(function * () {
        yield translator.load(localePath);
      })(function (err) {
        err.should.be.an.Error;

        done();
      });
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

    Object.keys(plurals.getLanguages()).forEach(function (locale) {
      translator.defaultLocale = locale;
    });
  });

  it('should only allow valid `defaultGender` values', function () {
    var translator = new Translator();
    var _ref = translator.defaultGender;

    [
      function f() {}, undefined, null, true, false, 0, 1, "", "##INVALIDVALUE",
      "M", "F", "N"  // case sensitive
    ].forEach(function (v) {
      (function() {
        translator.defaultGender = v;
      }).should.throw();
    });

    _ref.should.equal(translator.defaultGender);

    [C.GENDER_MALE, C.GENDER_FEMALE, C.GENDER_NEUTRAL].forEach(function (gender) {
      translator.defaultGender = gender;
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

    Object.keys(plurals.getLanguages()).forEach(function (locale) {
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

    (yield translator.translate('Hello world!', { locale: testLocale, plurality: 1 })).should.equal('Test!');
    (yield translator.translate('Hello world!', { locale: testLocale, plurality: 2 })).should.equal('Test!');

    (yield translator.translate('Hello plural!')).should.equal('Hello plural!');
    (yield translator.translate('Hello plural!', { locale: testLocale, plurality: 1 })).should.equal('Hello you!');

    (yield translator.translate('Hello plural!', { locale: testLocale })).should.equal('Hello everyone!');
    (yield translator.translate('Hello plural!', { locale: testLocale, plurality: -1 })).should.equal('Hello everyone!');
    (yield translator.translate('Hello plural!', { locale: testLocale, plurality: 0 })).should.equal('Hello everyone!');
    (yield translator.translate('Hello plural!', { locale: testLocale, plurality: 2 })).should.equal('Hello everyone!');
  });

  it('should handle gender', function * () {
    var genders = [ C.GENDER_MALE, C.GENDER_FEMALE, C.GENDER_NEUTRAL ];

    var translator = new Translator({ defaultLocale: testLocale });

    translator.defaultLocale.should.equal(testLocale);

    yield translator.load(localePath);

    (yield translator.translate('Hello gender!')).should.equal('Hello n!');

    for (var g = 0; g < genders.length; g++) {
      (yield translator.translate('Hello gender!', { gender: genders[g] })).should.equal('Hello ' + genders[g] + '!');
    }

    (yield translator.translate('Hello gender!', { pluraity: 1, gender: 'm' })).should.equal('Hello m!');
    (yield translator.translate('Hello gender!', { pluraity: 2, gender: 'm' })).should.equal('Hello m!');
  });

  it('should throw exception on invalid gender during translation', function (done) {
    var def1 = Q.defer();
    var def2 = Q.defer();
    var translator = new Translator({ defaultLocale: testLocale, locales: localePath });

    translator.defaultLocale.should.equal(testLocale);

    // FIXME : ... what an ugly piece of code...
    translator.on('initialized', function () {
      co(function * () {
        yield translator.translate('Hello invalid gender!', { gender: 'foo' });
      })(function (err) {
        def1.resolve(err ? undefined : new Error('Expected invalid gender : foo'));
      });

      co(function * () {
        yield translator.translate('Hello invalid gender!', { gender: C.GENDER_MALE });
      })(function (err) {
        def2.resolve(err ? undefined : new Error('Expected missing gender for msgId'));
      });
    });

    Q.all([def1.promise, def2.promise]).then(function (errStatus) {
      if (!errStatus.some(function (err) {
        if (err) {
          done(err);
          return true;
        }
      })) {
        done();
      }
    });

    this.timeout(500);
  });

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

    (yield translator.translate('Hello you!', { data: { person: { names: [ { first: 'Bob' } ] } } })).should.equal('Hello Bob!');

    // using an invalid locale
    (yield translator.translate('{{count}} notifications', { locale: testLocale+'xxx'})).should.equal(' notifications');
  });

  describe("Translator events", function () {

    it('should emit `initialized`', function (done) {

      new Translator().on('initialized', function () {
        done();
      });

      this.timeout(500);
    });

    it('should emit `defaultLocaleChanged`', function (done) {
      var translator = new Translator().on('defaultLocaleChanged', function (evtData) {
        evtData.previousValue.should.not.equal(testLocale);
        this.defaultLocale.should.equal(testLocale);

        done();
      });

      translator.defaultLocale = testLocale;
    });

    it('should emit `defaultGenderChanged`', function (done) {
      var translator = new Translator().on('defaultGenderChanged', function (evtData) {
        evtData.previousValue.should.equal(C.GENDER_NEUTRAL);
        this.defaultGender.should.equal(C.GENDER_MALE);

        done();
      });

      translator.defaultGender = C.GENDER_MALE;
    });

    it('should emit `localeLoaded`', function (done) {
      var translator = new Translator().on('localeLoaded', function (evtData) {
        evtData.should.have.ownProperty('locale').equal('test');
        evtData.should.have.ownProperty('loader').and.have.ownProperty('get').be.a.Function;

        done();
      });

      co(function * () {
        yield translator.load(localePath);
      })();

      this.timeout(500);
    });

    it('should emit `translation`', function (done) {
      var msgId = 'Translate event test...';
      var msgText = '... is a Success!';
      var translator = new Translator().on('translation', function (evtData) {
        evtData.locale.should.equal(translator.defaultLocale);
        evtData.messageId.should.equal(msgId);
        evtData.messageText.should.equal(msgId);
        evtData.messageText = msgText;
      });

      co(function * () {
        (yield translator.translate(msgId)).should.equal(msgText);

        done();
      })();

      this.timeout(500);
    });

  });

});
