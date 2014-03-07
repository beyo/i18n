
var Q = require('q');
var co = require('co');

var I18N = require('../lib/index');
var C = require('../lib/const');
var plurals = require('../lib/plurals');

describe('Module entry (i18n)', function () {

  before(function () {
    // define dummy locales
    plurals.setRule('foo', { languageName: 'FooTest', nplurals: [ C.MESSAGE_OTHER ], plural: function () { return 0; } });
    plurals.setRule('bar', { languageName: 'BarTest', nplurals: [ C.MESSAGE_OTHER ], plural: function () { return 0; } });
  });

  it('should not allow extending `plurals`', function () {
    plurals.should.not.have.ownProperty('foo');
    plurals.foo = 'bar';
    plurals.should.not.have.ownProperty('foo');

    I18N.plurals.should.not.have.ownProperty('foo');
    I18N.plurals.foo = 'bar';
    I18N.plurals.should.not.have.ownProperty('foo');
  });

  it('should not allow extending `const`', function () {
    C.should.not.have.ownProperty('foo');
    C.foo = 'bar';
    C.should.not.have.ownProperty('foo');

    I18N.const.should.not.have.ownProperty('foo');
    I18N.const.foo = 'bar';
    I18N.const.should.not.have.ownProperty('foo');
  });

  it('should expose `Translator`', function () {
    I18N.Translator.should.be.a.Function;
    I18N.Translator.should.be.a.equal(require('../lib/translator'));
  });

  it('should expose `const`', function () {
    I18N.const.should.be.an.Object;
    I18N.const.should.be.a.equal(require('../lib/const'));
  });

  it('should expose `plurals`', function () {
    I18N.plurals.should.be.a.Function;
    I18N.plurals.should.be.a.equal(require('../lib/plurals'));
  });

  it('should only allow valid `defaultLocale` values', function () {
    var _ref = I18N.defaultLocale;

    [
      function f() {}, undefined, null, true, false, 0, 1, "", "##INVALIDVALUE"
    ].forEach(function (v) {
      (function() {
        I18N.defaultLocale = v;
      }).should.throw();
    });

    _ref.should.equal(I18N.defaultLocale);

    Object.keys(plurals.getLanguages()).forEach(function (locale) {
      I18N.defaultLocale = locale;
    });
  });

  it('should only allow valid `defaultGender` values', function () {
    var _ref = I18N.defaultGender;

    [
      function f() {}, undefined, null, true, false, 0, 1, "", "##INVALIDVALUE",
      "M", "F", "N"  // case sensitive
    ].forEach(function (v) {
      (function() {
        I18N.defaultGender = v;
      }).should.throw();
    });

    _ref.should.equal(I18N.defaultGender);

    [C.GENDER_MALE, C.GENDER_FEMALE, C.GENDER_NEUTRAL].forEach(function (gender) {
      I18N.defaultGender = gender;
    });
  });

  it('should not allow overriding `translate`', function () {
    var _ref = I18N.translate;

    [
      function f() {}, {}, undefined, null, true, false, 0, 1, "", "##INVALIDVALUE"
    ].forEach(function (v) {
      I18N.translate = v;
      I18N.translate.should.not.equal(v);
      _ref.should.equal(I18N.translate);
    });
  });

  describe('Using Global Translator', function () {

    it('should return the same global translator', function () {
      var t = I18N.getGlobalTranslator();

      I18N.getGlobalTranslator().should.equal(t);
      I18N.getGlobalTranslator().should.equal(t);
    });

    it('should create a new global translator per init', function () {
      var i, t;

      for (i = 0; i < 10; i++) {
        t = I18N.getGlobalTranslator();

        I18N.init().should.equal(I18N);  // should return itself

        I18N.getGlobalTranslator().should.not.equal(t);
      }
    });

    it('should return a new global after init', function () {
      var t = I18N.getGlobalTranslator();

      var newTranslator = new I18N.Translator();

      newTranslator.should.not.equal(t);

      new I18N.Translator().should.not.equal(newTranslator).and.should.not.equal(t);
    });

    it('should persist listeners when init new global translator', function (done) {
      var deferred = [];

      // let's assume that the event `localeLoaded` will be persisted if all others are :)
      // skipping this event because writing a temporary locale just for this is not necessary!
      ['initialized', 'defaultLocaleChanged', 'defaultGenderChanged'/*, 'localeLoaded'*/, 'translation'].forEach(function (event) {
        var def = Q.defer();

        deferred.push(def.promise);

        I18N.getGlobalTranslator().on(event, function () {
          def.resolve();
        });
      });

      var _oldTrans = I18N.getGlobalTranslator();

      I18N.init();  // reset new translator

      _oldTrans.should.not.equal(I18N.getGlobalTranslator());

      co(function * () {

        I18N.getGlobalTranslator().defaultLocale = 'foo';
        I18N.getGlobalTranslator().defaultGender = C.GENDER_MALE;
        yield (I18N.getGlobalTranslator().translate)('Test translation event');

      })(function (err) {
        if (err) {
          done(err);
        }
      });

      Q.all(deferred).done(function (results) {
        results.forEach(function (result) {
          assert.equal(result, undefined);
        });
        done();
      });

      this.timeout(500);
    });

  });

  it('should all be valid Translator objects', function () {
    I18N.getGlobalTranslator().should.be.an.instanceof(I18N.Translator);
    new I18N.Translator().should.be.an.instanceof(I18N.Translator);
  });

  it('should not modify instance from global', function () {
    var gt = I18N.getGlobalTranslator();
    var tt = new I18N.Translator();

    gt.defaultLocale = 'foo';
    tt.defaultLocale = 'bar';

    gt.defaultLocale.should.be.equal('foo').and.should.not.be.equal(tt.defaultLocale);
    tt.defaultLocale.should.be.equal('bar').and.should.not.be.equal(gt.defaultLocale);
  });

  it('should allow defining new local specs', function () {
    plurals.isValid('test').should.be.false;

    plurals.setRule('test', {
      languageName: 'TestLocale',
      nplurals: [ C.MESSAGE_OTHER ],
      plural: function (n) { return 0; }
    });

    plurals.isValid('test').should.be.true;
  });

  it('should not allow defining invalid specs', function () {
    [
      undefined, false, null, 0, "",
      [], {}, { name: 'foo' }
    ].forEach(function (invalidSpecs, index) {
      (function () {
        I18N.setLocale(invalidSpecs);
      }).should.throw();
      (function () {
        I18N.setLocale(I18N.defaultLocale, invalidSpecs);
      }).should.throw();
      (function () {
        I18N.setLocale(C.DEFAULT_LOCALE, invalidSpecs);
      }).should.throw();
      (function () {
        I18N.setLocale('foo', invalidSpecs);
      }).should.throw();
    });
  });

});
