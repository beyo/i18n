
var c = require('../const');

/**
The language name in english
*/
module.exports.name = 'Spanish';

/**
The plural form for n. The function should return one of these strings:
- 'zero'
- 'one'
- 'two'
- 'few'
- 'many'
- 'other'

Where 'other' is the default plural and 'one' the default non-plural. All
other forms are optional.

See : http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html#sp
*/
module.exports.plural = function plural(n) {
  n = parseFloat(n, 10);
  return (n === 1) ? c.MESSAGE_ONE : c.MESSAGE_OTHER;
};
