
/**
The language name in english
*/
module.exports.name = 'Breton';

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

See : http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html#br
*/
module.exports.plural = function plural(n) {
  n = parseFloat(n, 10);
  var n10 = n % 10;
  var n100 = n % 100;

  if ((n10 === 1) && (n100 !== 11) && (n100 !== 71) && (n100 !== 91)) {
    return 'one';
  } else if ((n10 === 2) && (n100 !== 12) && (n100 !== 72) && (n100 !== 92)) {
    return 'two';
  } else if ((((n10 >= 3) && (n10 <= 4)) || (n10 === 9)) && !(((n100 >= 10) && (n100 <= 19)) || ((n100 >= 70) && (n100 <= 79)) || ((n100 >= 90) && (n100 <= 99)))) {
    return 'few';
  } else if ((n !== 0) && (n % 1000000 === 0)) {
    return 'many';
  } else {
    return 'other';
  }
};
