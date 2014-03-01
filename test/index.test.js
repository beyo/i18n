
var I18N = require('../lib/index');


describe('Module entry (i18n)', function () {

  before(function () {
    // define dummy locales
    I18N.setLocale('foo', { name: 'FooTest', plural: function () { return 0; } });
    I18N.setLocale('bar', { name: 'BarTest', plural: function () { return 0; } });
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

    Object.keys(I18N.locales).forEach(function (locale) {
      I18N.defaultLocale = locale;
    });
  });

  it('should not allow overriding `getCatalog`', function () {
    var _ref = I18N.getCatalog;

    [
      function f() {}, {}, undefined, null, true, false, 0, 1, "", "##INVALIDVALUE"
    ].forEach(function (v) {
      I18N.getCatalog = v;
      I18N.getCatalog.should.not.equal(v);
      _ref.should.equal(I18N.getCatalog);
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

  it('should not allow overriding `locales`', function () {
    var _ref = I18N.locales;

    [
      function f() {}, {}, undefined, null, true, false, 0, 1, "", "##INVALIDVALUE"
    ].forEach(function (v) {
      I18N.locales = v;
      I18N.locales.should.not.equal(v);
      _ref.should.equal(I18N.locales);
    });
  });

  it('should not allow overriding `setLocale`', function () {
    var _ref = I18N.setLocale;

    [
      function f() {}, {}, undefined, null, true, false, 0, 1, "", "##INVALIDVALUE"
    ].forEach(function (v) {
      I18N.setLocale = v;
      I18N.setLocale.should.not.equal(v);
      _ref.should.equal(I18N.setLocale);
    });
  });

  it('should not allow directly modifying `locales`', function () {
    I18N.locales.TEST = "foo";
    assert.equal(I18N.locales.TEST, undefined);
    I18N.locales.should.not.have.property('TEST');
    I18N.locales.should.not.have.ownProperty('TEST');
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

    it('should persist listeners when init new global translator');

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

  it('should allow defining new local specs', function() {
    I18N.locales.should.not.have.ownProperty('test');

    I18N.setLocale('test', {
      name: 'TestLocale',
      plural: function(n) { return 'other'; }
    });

    I18N.locales.should.have.ownProperty('test');
  });

});
