
var lang = require('../../lib/lang/es');

describe('Language ES', function() {

  it('should have a valid name', function() {
    lang.name.should.equal('Spanish');
  });

  it('should return "one" when not plural', function() {
    lang.plural(1).should.equal('one');
    lang.plural('1').should.equal('one');
  });

  it('should return "other" for any other value', function() {
    [
      null, undefined, false, true,
      -10, -2, -1.0000000000001, -1, -0.1, 0, 0.1, 1.0000000000001, 2, 3, 10
    ].forEach(function(v) {
      lang.plural(v).should.equal('other');
      lang.plural(String(v)).should.equal('other');
    });
  });

});
