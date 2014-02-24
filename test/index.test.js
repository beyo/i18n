
var I18N = require('../lib/index.js');

describe('Module entry (i18n)', function() {

  before(function() {
    // define dummy locales
    I18N.setLocale('foo', { name: 'FooTest', plural: function() { return 0; } });
    I18N.setLocale('bar', { name: 'BarTest', plural: function() { return 0; } });
  });

  it('should not allow overriding `defaultLocale`');

  it('should not allow overriding `getCatalog`');

  it('should not allow overriding `translate`');

  it('should not allow overriding `locales`');

  it('should not allow overriding `setLocale`');

  it('should not allow directly modifying `locales`');

  describe('Using Global Translator', function() {

    it('should return the same global translator', function() {
      var t = I18N.getGlobalTranslator();

      I18N.getGlobalTranslator().should.equal(t);
      I18N.getGlobalTranslator().should.equal(t);
    });

    it('should create a new global translator per init', function() {
      var i, t;

      for (i = 0; i < 10; i++) {
        t = I18N.getGlobalTranslator();

        I18N.init().should.equal(I18N);  // should return itself

        I18N.getGlobalTranslator().should.not.equal(t);
      }
    });

    it('should return a new global after init', function(done) {
      var t = I18N.getGlobalTranslator();

      var newTranslator = new I18N.Translator(null, function() {
        newTranslator.should.not.equal(t);

        new I18N.Translator().should.not.equal(newTranslator).and.should.not.equal(t);

        done();
      });
    });

  });

  it('should all be valid Translator objects', function() {
    I18N.getGlobalTranslator().should.be.an.instanceof(I18N.Translator);
    new I18N.Translator().should.be.an.instanceof(I18N.Translator);
  });

  it('should not modify instance from global', function() {
    var gt = I18N.getGlobalTranslator();
    var tt = new I18N.Translator();

    gt.defaultLocale = 'foo';
    tt.defaultLocale = 'bar';

    gt.defaultLocale.should.be.equal('foo').and.should.not.be.equal(tt.defaultLocale);
    tt.defaultLocale.should.be.equal('bar').and.should.not.be.equal(gt.defaultLocale);
  });

});
