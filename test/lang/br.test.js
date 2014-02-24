
var lang = require('../../lib/lang/br');

describe('Language BR', function() {

  it('should have a valid name', function() {
    lang.name.should.equal('Breton');
  });

  it('should return "one" when not plural', function() {
    lang.plural(1).should.equal('one');
    lang.plural('1').should.equal('one');
  });

  it('should return "two" when pair', function() {
    [2, 22, 32, 42, 52, 62, 82, 102, 122].forEach(function(v) {
      lang.plural(v).should.equal('two');
      lang.plural(String(v)).should.equal('two');
    });
  });

  it('should return "few" for plurality', function() {
    [3, 3.01, 3.5, 3.9, 4, 9, 23, 23.01, 23.5, 23.9, 24, 29].forEach(function(v) {
      lang.plural(v).should.equal('few');
      lang.plural(String(v)).should.equal('few');
    });
  });

  it('should return "many" for plurality', function() {
    for (var v = 1000000; v < 20000000; v = v + 1000000) {
      lang.plural(v).should.equal('many');
      lang.plural(String(v)).should.equal('many');
    }
  });

  it('should return "other" for any other value', function() {
    [
      null, undefined, false, true,
      0, 5, 6, 7, 8, 10, 12, 15, 20, 25, 27, 28
    ].forEach(function(v) {
      [v, -v, -(v+0.1)].forEach(function(vv) {
        lang.plural(vv).should.equal('other');
        lang.plural(String(vv)).should.equal('other');
      });
    });
  });

});
