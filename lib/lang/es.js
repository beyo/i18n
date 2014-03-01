
var c = require('../const');

/**
The language name in english
*/
module.exports.name = 'Spanish';

/**
How many different plurals in this language?
*/
module.exports.nplurals = 2;

/**
The plural form for n. The function should return one of the c.MESSAGE_xxxx constants.

Where c.MESSAGE_OTHER is the default plural and c.MESSAGE_ONE the default non-plural. All
other forms are optional.

See : http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html#br
*/
module.exports.plural = function plural(n) {
  n = parseFloat(n, 10);
  return (n === 1) ? c.MESSAGE_ONE : c.MESSAGE_OTHER;
};
