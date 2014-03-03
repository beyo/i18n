
var lang = require('../../lib/lang/fr');
var C = require('../../lib/const');

describe('Language FR', function () {

  it('should have a valid name', function () {
    lang.name.should.equal('French');
  });

  it('should have a valid nplurals value', function () {
    lang.nplurals.should.equal(2);
  });

  it('should return "one" when not plural', function () {
    [0, 1].forEach(function(v) {
      lang.plural(v).should.equal(C.MESSAGE_ONE);
      lang.plural(String(v)).should.equal(C.MESSAGE_ONE);
    });
  });

  it('should return "other" for any other value', function () {
    [
      null, undefined, false, true,
      -10, -2, -1.0000000000001, -1, -0.1, 0.1, 1.0000000000001, 2, 3, 10,
    ].forEach(function (v) {
      lang.plural(v).should.equal(C.MESSAGE_OTHER);
      lang.plural(String(v)).should.equal(C.MESSAGE_OTHER);
    });
  });

});
