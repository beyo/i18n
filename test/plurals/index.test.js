
var C = require('../../lib/const');
var plurals = require('../../lib/plurals');

describe('Testing plurals', function () {

  it('should iterate only valid rules', function () {
    var count = 0;

    Object.keys(plurals.getLanguages()).forEach(function (locale, index, languages) {
      count++;
      plurals.isValid(locale).should.be.true;
    });

    count.should.not.equal(0);
  });

  it('should return undefined for invalid rules', function () {
    assert.equal(plurals.getRule('fooTest'), undefined);
  });

  it('should allow getting any valid rules', function () {
    var count = 0;

    Object.keys(plurals.getLanguages()).forEach(function (locale, index, languages) {
      count++;
      var rule = plurals.getRule(locale);

      rule.should.have.ownProperty('languageName').and.be.a.String;
      rule.should.have.ownProperty('nplurals').and.be.an.Array;
      rule.should.have.ownProperty('plural').and.be.a.Function;
    });

    count.should.not.equal(0);
  });

  it('should not allow setting invalid rules', function () {
    [ true, false, null, undefined, [], {}, '', 'a', 0, 1, 2, function () {} ].forEach(function (value) {
      (function () {
        plurals.setRule(value);
      }).should.throw();
      (function () {
        plurals.setRule('foo', value);
      }).should.throw();
    });

    [
      { rule: {}, testKey: 'languageName', testValues: [ true, false, null, undefined, [], {}, 0, 1, 2, function () {} ] },
      { rule: { languageName: 'FooTest' } },
      { rule: { languageName: 'FooTest' }, testKey: 'nplurals', testValues: [ true, false, null, undefined, '', 'a', [], [ 'INVALIDPLURALVALUE' ], {}, 0, 1, 2, function () {} ] },
      { rule: { languageName: 'FooTest', nplurals: [ C.PLURAL_OTHER ] } },
      { rule: { languageName: 'FooTest', nplurals: [ C.PLURAL_OTHER ] }, testKey: 'plural', testValues: [ true, false, null, undefined, '', 'a', [], {}, 0, 1, 2 ] }
    ].forEach(function (testSpec) {
      if (testSpec.testKey) {
        testSpec.testValues.forEach(function (value) {
          testSpec.rule[testSpec.testKey] = value;
          (function () {
            plurals.setRule('foo', testSpec.rule);
          }).should.throw();
        });
      } else {
        (function () {
          plurals.setRule('foo', testSpec.rule);
        }).should.throw();
      }
    });

  });

  it('should allow setting new rules', function () {
    plurals.setRule('foo', {
      languageName: 'FooTest',
      nplurals: [ C.PLURAL_OTHER ],
      plural: function (n) { return 0; }
    });

    plurals.getRule('foo').should.have.ownProperty('languageName').and.equal('FooTest');
  });

  it('should allow ovrrriding existing rules', function () {
    plurals.setRule('bar', {
      languageName: 'BarTest-1',
      nplurals: [ C.PLURAL_OTHER ],
      plural: function (n) { return 0; }
    });

    plurals.getRule('bar').should.have.ownProperty('languageName').and.equal('BarTest-1');
    plurals.getRule('bar').should.have.ownProperty('nplurals').and.have.lengthOf(1);

    plurals.setRule('bar', {
      languageName: 'BarTest-2',
      nplurals: [ C.PLURAL_ZERO, C.PLURAL_OTHER ],
      plural: function (n) { return n ? 1 : 0; }
    });

    plurals.getRule('bar').should.have.ownProperty('languageName').and.equal('BarTest-2');
    plurals.getRule('bar').should.have.ownProperty('nplurals').and.have.lengthOf(2);
  });

  it('should not allow modifying any rule externally', function () {
    var count = 0;

    Object.keys(plurals.getLanguages()).forEach(function (locale, index, languages) {
      count++;
      var rule = plurals.getRule(locale);
      var nplurals = rule.nplurals.length;

      rule.languageName = 'BobTest';
      rule.languageName.should.not.be.equal('BobTest');

      rule.nplurals = 'BobTest';
      rule.nplurals.should.not.be.equal('BobTest');
      rule.nplurals.push('BobTest');
      rule.nplurals.length.should.be.equal(nplurals);

      rule.plural = 'BobTest';
      rule.plural.should.not.be.equal('BobTest');
    });

    count.should.not.equal(0);
  });

});
