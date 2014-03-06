
var C = require('../const');

/**
The general plural rules functions

See : http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
      http://unicode.org/reports/tr35/tr35-numbers.html#Language_Plural_Rules
      https://github.com/translate/l10n-guide/blob/master/docs/l10n/pluralforms.rst
*/
var pluralRules = {
  /**
  Applies to (30) :
     Bambara, Burmese, Chinese, Dzongkha, Igbo, Indonesian, Japanese,
     Javanese, Kabuverdianu, Khmer, Korean, Koyraboro Senni, Lakota, Lao,
     Lojban, Makonde, Malay, N’Ko, Root, Sakha, Sango, Sichuan Yi, Thai,
     Tibetan, Tongan, Vietnamese, Wolof, Yoruba, in, jw
  */
  '1a': {
    n: [ C.PLURAL_OTHER ],
    fn: function plural() { return 0; }
  },

  /**
  Applies to (1) :
     Central Atlas Tamazight
  */
  '2a': {
    n: [ C.PLURAL_ONE, C.PLURAL_OTHER ],
    fn: function plural(n) { return (((n >= 0) && n <= 1)) || ((n >= 11) && (n <= 99)) ? 0 : 1; }
  },

  /**
  Applies to (1) :
     Macedonian
  */
  '2b': {
    n: [ C.PLURAL_ONE, C.PLURAL_OTHER ],
    fn: function plural(n) { return (n === 1) || ((n % 10) === 1) ? 0 : 1; }
  },

  /**
  Applies to (1) :
     Icelandic
  */
  '2c': {
    n: [ C.PLURAL_ONE, C.PLURAL_OTHER ],
    fn: function plural(n) { return ((n % 10) != 1) || ((n % 100) == 11) ? 1 : 0; }
  },

  /**
  Applies to (24) :
     Akan, Amharic, Armenian, Bengali, Bihari, Filipino, French, Fulah, Gujarati, Gun,
     Hindi, Kabyle, Kannada, Lingala, Malagasy, Marathi, Northern Sotho, Persian, Punjabi,
     Sinhala, Tagalog, Tigrinya, Walloon, Zulu
  */
  '2d': {
    n: [ C.PLURAL_ONE, C.PLURAL_OTHER ],
    fn: function plural(n) { return (n === 0) || (n === 1) ? 0 : 1; }
  },

  /**
  Applies to (100) :
     Afrikaans, Albanian, Asturian, Asu, Azerbaijani, Basque, Bemba, Bena, Bodo, Bulgarian,
     Catalan, Cherokee, Chiga, Danish, Divehi, Dutch, English, Esperanto, Estonian,
     European Portuguese, Ewe, Faroese, Finnish, Friulian, Galician, Ganda, Georgian,
     German, Greek, Hausa, Hawaiian, Hungarian, Italian, Jju, Kako, Kalaallisut, Kashmiri,
     Kazakh, Kurdish, Kyrgyz, Luxembourgish, Machame, Malayalam, Masai, Meta', Mongolian,
     Nahuatl, Nepali, Ngiemboon, Ngomba, North Ndebele, Norwegian, Norwegian Bokmål,
     Norwegian Nynorsk, Nyanja, Nyankole, Oriya, Oromo, Ossetic, Papiamento, Pashto,
     Portuguese, Romansh, Rombo, Rwa, Saho, Samburu, Sena, Shambala, Shona, Soga, Somali,
     Sorani Kurdish, South Ndebele, Southern Sotho, Spanish, Swahili, Swati, Swedish,
     Swiss German, Syriac, Tamil, Telugu, Teso, Tigre, Tsonga, Tswana, Turkish, Turkmen,
     Tyap, Urdu, Uzbek, Venda, Volapük, Vunjo, Walser, Western Frisian, Xhosa, Yiddish, ji
  */
  '2e': {
    n: [ C.PLURAL_ONE, C.PLURAL_OTHER ],
    fn: function plural(n) { return (n === 1) ? 0 : 1; }
  },

  /**
  Applies to (1) :
     Latvian
  */
  '3a': {
    n: [ C.PLURAL_ONE, C.PLURAL_OTHER, C.PLURAL_ZERO ],
    fn: function plural(n) { return ((n % 10) === 1) && (( n % 100) !== 11) ? 0 : (n !== 0) ? 1 : 2; }
  },

  /**
  Applies to (1) :
     Colognian, Langi
  */
  '3b': {
    n: [ C.PLURAL_ZERO, C.PLURAL_ONE, C.PLURAL_OTHER ],
    fn: function plural(n) { return (n === 0) ? 0 : (n === 1) ? 1 : 2; }
  },

  /**
  Applies to (8) :
     Inari Sami, Inuktitut, Lule Sami, Nama, Northern Sami, Sami Language,
     Skolt Sami, Southern Sami
  */
  '3c': {
    n: [ C.PLURAL_ONE, C.PLURAL_TWO, C.PLURAL_OTHER ],
    fn: function plural(n) { return (n === 1) ? 0 : (n === 2) ? 1 : 2; }
  },

  /**
  Applies to (2) :
     Belarusian, Ukrainian
  */
  '3d': {
    n: [ C.PLURAL_ONE, C.PLURAL_FEW, C.PLURAL_OTHER /*MANY*/ ],
    fn: function plural(n) { return ((n % 10) === 1) && ((n % 100) !== 11) ? 0 : ((n % 10) >= 2) && ((n % 10) <= 4) && (((n % 100) < 10) || ((n % 100) >= 20)) ? 1 : 2; }
  },

  /**
  Applies to (1) :
     Polish
  */
  '3e': {
    n: [ C.PLURAL_ONE, C.PLURAL_FEW, C.PLURAL_OTHER /*MANY*/ ],
    fn: function plural(n) { return (n === 1) ? 0 : ((n % 10) >= 2) && ((n % 10) <= 4) && (((n % 100) < 10) || ((n % 100) >=20)) ? 1 : 2; }
  },

  /**
  Applies to (1) :
     Lithuanian
  */
  '3f': {
    n: [ C.PLURAL_ONE, C.PLURAL_FEW, C.PLURAL_OTHER ],
    fn: function plural(n) { return ((n % 10) ===1) && ((n % 100) !== 11) ? 0 : ((n % 10) >= 2) && (((n % 100) < 10) || ((n % 100) >= 20)) ? 1 : 2; }
  },

  /**
  Applies to (4) :
     Bosnian, Croatian, Serbian, Serbo-Croatian
  */
  '3g': {
    n: [ C.PLURAL_ONE, C.PLURAL_FEW, C.PLURAL_OTHER ],
    fn: function plural(n) { return ((n % 10) === 1) && ((n % 100) !== 11) ? 0 : ((n % 10) >= 2) && ((n % 10) <= 4) && (((n % 100) < 10) || ((n % 100) >= 20)) ? 1 : 2; }
  },

  /**
  Applies to (1) :
     Tachelhit
  */
  '3h': {
    n: [ C.PLURAL_ONE, C.PLURAL_FEW, C.PLURAL_OTHER ],
    fn: function plural(n) { return (n === 0) || (n === 1) ? 0 : (n <= 10) ? 1 : 2; }
  },

  /**
  Applies to (2) :
     Moldavian, Romanian
  */
  '3i': {
    n: [ C.PLURAL_ONE, C.PLURAL_FEW, C.PLURAL_OTHER ],
    fn: function plural(n) { return (n === 1) ? 0 : (n === 0) || (((n % 100) > 0) && ((n % 100) < 20)) ? 1 : 2; }
  },

  /**
  Applies to (2) :
     Czech, Slovak
  */
  '3j': {
    n: [ C.PLURAL_ONE, C.PLURAL_FEW, C.PLURAL_OTHER ],
    fn: function plural(n) { return (n === 1) ? 0 : (n >= 2) && (n <= 4) ? 1 : 2; }
  },

  /**
  Applies to (1) :
     Russian
  */
  '3k': {
    n: [ C.PLURAL_ONE, C.PLURAL_MANY, C.PLURAL_OTHER ],
    fn: function plural(n) { return ((n % 10) === 1) && ((n % 100) !== 11) ? 0 : ((n % 10) >= 2) && ((n % 10) <= 4) && (((n % 100) < 10) || ((n % 100) >= 20)) ? 1 : 2; }
  },

  /**
  Applies to (1) :
     Manx
  */
  '4a': {
    n: [ C.PLURAL_ONE, C.PLURAL_TWO, C.PLURAL_FEW, C.PLURAL_OTHER ],
    fn: function plural(n) { return ((n % 10) === 1) ? 0 : ((n % 10) === 2) ? 1 : ([0, 20, 40, 60].indexOf(n % 100) !== -1) ? 2 : 3; }
  },

  /**
  Applies to (1) :
     Scottish Gaelic
  */
  '4b': {
    n: [ C.PLURAL_ONE, C.PLURAL_TWO, C.PLURAL_FEW, C.PLURAL_OTHER ],
    fn: function plural(n) { return (n === 1) || (n === 11) ? 0 : (n === 2) || (n === 12) ? 1 : (n > 2) && (n < 20) ? 2 : 3; }
  },

  /**
  Applies to (1) :
     Breton

  FIXME : same as 2e
  FIXME : http://unicode.org/cldr/trac/ticket/7040
  */
  '4c': {
    n: [ C.PLURAL_ONE /*, C.PLURAL_TWO, C.PLURAL_FEW*/, C.PLURAL_OTHER ],
    fn: function plural(n) { return (n === 1) ? 0 : 1; }
  },

  /**
  Applies to (1) :
     Slovenian
  */
  '4d': {
    n: [ C.PLURAL_ONE, C.PLURAL_TWO, C.PLURAL_FEW, C.PLURAL_OTHER ],
    fn: function plural(n) { return ((n % 100) === 1) ? 0 : ((n % 100) === 2) ? 1 : ((n % 100) == 3) || ((n % 100) === 4) ? 2 : 3; }
  },

  /**
  Applies to (2) :
     Hebrew, iw
  */
  '4e': {
    n: [ C.PLURAL_ONE, C.PLURAL_TWO, C.PLURAL_MANY, C.PLURAL_OTHER ],
    fn: function plural(n) { return (n === 1) ? 0 : (n === 2) ? 1 : (n >= 20) && ((n % 10) === 0) ? 2 : 3; }
  },

  /**
  Applies to (1) :
     Maltese
  */
  '4f': {
    n: [ C.PLURAL_ONE, C.PLURAL_FEW, C.PLURAL_MANY, C.PLURAL_OTHER ],
    fn: function plural(n) { return (n === 1) ? 0 : (n === 0) || (((n % 100) > 1) && ((n % 100) < 11)) ? 1 : (((n % 100) > 10) && ((n % 100) < 20)) ? 2 : 3; }
  },

  /**
  Applies to (1) :
     Cornish
  */
  '4g': {
    n: [ C.PLURAL_ONE, C.PLURAL_TWO, C.PLURAL_FEW, C.PLURAL_OTHER ],
    fn: function plural(n) { return (n === 1) ? 0 : (n === 2) ? 1 : (n === 3) ? 2 : 3; }
  },

  /**
  Applies to (1) :
     Irish
  */
  '5a': {
    n: [ C.PLURAL_ONE, C.PLURAL_TWO, C.PLURAL_FEW, C.PLURAL_MANY, C.PLURAL_OTHER ],
    fn: function plural(n) { return (n ===1) ? 0 : (n === 2) ? 1 : (n < 7) ? 2 : (n < 11) ? 3 : 4; }
  },

  /**
  Applies to (1) :
     Arabic
  */
  '6a': {
    n: [ C.PLURAL_ZERO, C.PLURAL_ONE, C.PLURAL_TWO, C.PLURAL_FEW, C.PLURAL_MANY, C.PLURAL_OTHER ],
    fn: function plural(n) { return (n === 0) ? 0 : (n === 1) ? 1 : (n === 2) ? 2 : ((n % 100) >= 3) && ((n % 100) <= 10) ? 3 : ((n % 100) >= 11) ? 4 : 5; }
  },

  /**
  Applies to (1) :
     Welsh
  */
  '6b': {
    n: [ C.PLURAL_ZERO, C.PLURAL_ONE, C.PLURAL_TWO, C.PLURAL_FEW, C.PLURAL_MANY, C.PLURAL_OTHER ],
    fn: function plural(n) { return (n === 0) ? 0 : (n === 1) ? 1 : (n === 2) ? 2 : (n === 3) ? 3 : (n === 6) ? 4 : 5; }
  }
};

var rules = {
  'af': createRule('Afrikaans', '2e'),
  'ak': createRule('Akan', '2d'),
  'am': createRule('Amharic', '2d'),
  'ar': createRule('Arabic', '6a'),
  'asa': createRule('Asu', '2e'),
  'ast': createRule('Asturian', '2e'),
  'az': createRule('Azerbaijani', '2e'),
  'bem': createRule('Bemba', '2e'),
  'be': createRule('Belarusian', '3d'),
  'bez': createRule('Bena', '2e'),
  'bg': createRule('Bulgarian', '2e'),
  'bh': createRule('Bihari', '2d'),
  'bm': createRule('Bambara', '1a'),
  'bn': createRule('Bengali', '2d'),
  'bo': createRule('Tibetan', '1a'),
  'br': createRule('Breton', '4c'),
  'brx': createRule('Bodo', '2e'),
  'bs': createRule('Bosnian', '3g'),
  'ca': createRule('Catalan', '2e'),
  'cgg': createRule('Chiga', '2e'),
  'chr': createRule('Cherokee', '2e'),
  'ckb': createRule('Sorani Kurdish', '2e'),
  'cs': createRule('Czech', '3j'),
  'cy': createRule('Welsh', '6b'),
  'da': createRule('Danish', '2e'),
  'de': createRule('German', '2e'),
  'dv': createRule('Divehi', '2e'),
  'dz': createRule('Dzongkha', '1a'),
  'ee': createRule('Ewe', '2e'),
  'el': createRule('Greek', '2e'),
  'en': createRule('English', '2e'),
  'eo': createRule('Esperanto', '2e'),
  'es': createRule('Spanish', '2e'),
  'et': createRule('Estonian', '2e'),
  'eu': createRule('Basque', '2e'),
  'fa': createRule('Persian', '2d'),
  'ff': createRule('Fulah', '2d'),
  'fi': createRule('Finnish', '2e'),
  'fil': createRule('Filipino', '2d'),
  'fo': createRule('Faroese', '2e'),
  'fr': createRule('French', '2d'),
  'fur': createRule('Friulian', '2e'),
  'fy': createRule('Western Frisian', '2e'),
  'ga': createRule('Irish', '5a'),
  'gd': createRule('Scottish Gaelic', '4b'),
  'gl': createRule('Galician', '2e'),
  'gsw': createRule('Swiss German', '2e'),
  'gu': createRule('Gujarati', '2d'),
  'guw': createRule('Gun', '2d'),
  'gv': createRule('Manx', '4a'),
  'ha': createRule('Hausa', '2e'),
  'haw': createRule('Hawaiian', '2e'),
  'he': createRule('Hebrew', '4e'),
  'hi': createRule('Hindi', '2d'),
  'hr': createRule('Croatian', '3g'),
  'hu': createRule('Hungarian', '2e'),
  'hy': createRule('Armenian', '2d'),
  'id': createRule('Indonesian', '1a'),
  'ig': createRule('Igbo', '1a'),
  'ii': createRule('Sichuan Yi', '1a'),
  'in': createRule('in', '1a'),
  'is': createRule('Icelandic', '2c'),
  'it': createRule('Italian', '2e'),
  'iu': createRule('Inuktitut', '3c'),
  'iw': createRule('iw', '4e'),
  'ja': createRule('Japanese', '1a'),
  'jbo': createRule('Lojban', '1a'),
  'jgo': createRule('Ngomba', '2e'),
  'ji': createRule('ji', '2e'),
  'jmc': createRule('Machame', '2e'),
  'jv': createRule('Javanese', '1a'),
  'jw': createRule('jw', '1a'),
  'ka': createRule('Georgian', '2e'),
  'kab': createRule('Kabyle', '2d'),
  'kaj': createRule('Jju', '2e'),
  'kcg': createRule('Tyap', '2e'),
  'kde': createRule('Makonde', '1a'),
  'kea': createRule('Kabuverdianu', '1a'),
  'kk': createRule('Kazakh', '2e'),
  'kkj': createRule('Kako', '2e'),
  'kl': createRule('Kalaallisut', '2e'),
  'km': createRule('Khmer', '1a'),
  'kn': createRule('Kannada', '2d'),
  'ko': createRule('Korean', '1a'),
  'ks': createRule('Kashmiri', '2e'),
  'ksb': createRule('Shambala', '2e'),
  'ksh': createRule('Colognian', '3b'),
  'ku': createRule('Kurdish', '2e'),
  'kw': createRule('Cornish', '4g'),
  'ky': createRule('Kyrgyz', '2e'),
  'lag': createRule('Langi', '3b'),
  'lb': createRule('Luxembourgish', '2e'),
  'lg': createRule('Ganda', '2e'),
  'lkt': createRule('Lakota', '1a'),
  'ln': createRule('Lingala', '2d'),
  'lo': createRule('Lao', '1a'),
  'lt': createRule('Lithuanian', '3f'),
  'lv': createRule('Latvian', '3a'),
  'mas': createRule('Masai', '2e'),
  'mg': createRule('Malagasy', '2d'),
  'mgo': createRule('Meta\'', '2e'),
  'mk': createRule('Macedonian', '2b'),
  'ml': createRule('Malayalam', '2e'),
  'mn': createRule('Mongolian', '2e'),
  'mo': createRule('Moldavian', '3i'),
  'mr': createRule('Marathi', '2d'),
  'ms': createRule('Malay', '1a'),
  'mt': createRule('Maltese', '4f'),
  'my': createRule('Burmese', '1a'),
  'nah': createRule('Nahuatl', '2e'),
  'naq': createRule('Nama', '3c'),
  'nb': createRule('Norwegian Bokmål', '2e'),
  'nd': createRule('North Ndebele', '2e'),
  'ne': createRule('Nepali', '2e'),
  'nl': createRule('Dutch', '2e'),
  'nnh': createRule('Ngiemboon', '2e'),
  'nn': createRule('Norwegian Nynorsk', '2e'),
  'no': createRule('Norwegian', '2e'),
  'nqo': createRule('N’Ko', '1a'),
  'nr': createRule('South Ndebele', '2e'),
  'nso': createRule('Northern Sotho', '2d'),
  'ny': createRule('Nyanja', '2e'),
  'nyn': createRule('Nyankole', '2e'),
  'om': createRule('Oromo', '2e'),
  'or': createRule('Oriya', '2e'),
  'os': createRule('Ossetic', '2e'),
  'pa': createRule('Punjabi', '2d'),
  'pap': createRule('Papiamento', '2e'),
  'ps': createRule('Pashto', '2e'),
  'pt': createRule('Portuguese', '2e'),
  'pt_pt': createRule('European Portuguese', '2e'),
  'rm': createRule('Romansh', '2e'),
  'ro': createRule('Romanian', '3i'),
  'root': createRule('Root', '1a'),
  'rof': createRule('Rombo', '2e'),
  'ru': createRule('Russian', '3k'),
  'rwk': createRule('Rwa', '2e'),
  'sah': createRule('Sakha', '1a'),
  'saq': createRule('Samburu', '2e'),
  'se': createRule('Northern Sami', '3c'),
  'seh': createRule('Sena', '2e'),
  'ses': createRule('Koyraboro Senni', '1a'),
  'sg': createRule('Sango', '1a'),
  'sh': createRule('Serbo-Croatian', '3g'),
  'shi': createRule('Tachelhit', '3h'),
  'si': createRule('Sinhala', '2d'),
  'sk': createRule('Slovak', '3j'),
  'sl': createRule('Slovenian', '4d'),
  'sma': createRule('Southern Sami', '3c'),
  'smi': createRule('Sami Language', '3c'),
  'smj': createRule('Lule Sami', '3c'),
  'smn': createRule('Inari Sami', '3c'),
  'sms': createRule('Skolt Sami', '3c'),
  'sn': createRule('Shona', '2e'),
  'so': createRule('Somali', '2e'),
  'sq': createRule('Albanian', '2e'),
  'sr': createRule('Serbian', '3g'),
  'ss': createRule('Swati', '2e'),
  'ssy': createRule('Saho', '2e'),
  'st': createRule('Southern Sotho', '2e'),
  'sv': createRule('Swedish', '2e'),
  'sw': createRule('Swahili', '2e'),
  'syr': createRule('Syriac', '2e'),
  'ta': createRule('Tamil', '2e'),
  'te': createRule('Telugu', '2e'),
  'teo': createRule('Teso', '2e'),
  'th': createRule('Thai', '1a'),
  'ti': createRule('Tigrinya', '2d'),
  'tig': createRule('Tigre', '2e'),
  'tk': createRule('Turkmen', '2e'),
  'tl': createRule('Tagalog', '2d'),
  'to': createRule('Tongan', '1a'),
  'ts': createRule('Tsonga', '2e'),
  'tn': createRule('Tswana', '2e'),
  'tr': createRule('Turkish', '2e'),
  'tzm': createRule('Central Atlas Tamazight', '2a'),
  'uk': createRule('Ukrainian', '3d'),
  'ur': createRule('Urdu', '2e'),
  'uz': createRule('Uzbek', '2e'),
  've': createRule('Venda', '2e'),
  'vi': createRule('Vietnamese', '1a'),
  'vo': createRule('Volapük', '2e'),
  'vun': createRule('Vunjo', '2e'),
  'wa': createRule('Walloon', '2d'),
  'wae': createRule('Walser', '2e'),
  'wo': createRule('Wolof', '1a'),
  'xh': createRule('Xhosa', '2e'),
  'xog': createRule('Soga', '2e'),
  'yi': createRule('Yiddish', '2e'),
  'yo': createRule('Yoruba', '1a'),
  'zh': createRule('Chinese', '1a'),
  'zu': createRule('Zulu', '2d')
};

function createRule(name, nplurals, plural) {
  if (typeof nplurals === 'string') {
    plural = pluralRules[nplurals].fn;
    nplurals = pluralRules[nplurals].n;
  }

  var rule = {
    languageName: name,
    nplurals: nplurals,
    plural: plural
  };

  Object.freeze(rule.nplurals);
  Object.freeze(rule);

  return rule;
}

function sanitizeLocale(locale) {
  return String(locale).replace('-', '_').toLocaleLowerCase();
}

function getBestRule(locale) {
  locale = sanitizeLocale(locale);
  return rules[locale] || rules[locale.split('_')[0]];
}


/**
Return the plural rule key for the given locale and n value
*/
module.exports = function getPlural(locale, n) {
  var rule;

  return (rule = getBestRule(locale)) && rule.nplurals[rule.plural(parseFloat(n, 10))] || C.PLURAL_OTHER;
};

Object.defineProperties(module.exports, {
  isValid: {
    configurable: false,
    enumerable: true,
    writable: false,
    value: function isValid(locale) {
      return !!getBestRule(locale);
    }
  },

  /**
  Return all the available locale as an object : { 'locale': 'language name' }
  */
  getLanguages: {
    configurable: false,
    enumerable: true,
    writable: false,
    value: function getLanguages() {
      var languageMap = {};
      Object.keys(rules).forEach(function (locale) {
        languageMap[locale] = rules[locale].languageName;
      });
      return languageMap;
    }
  },

  /**
  Return the raw plural spec for the given locale
  */
  getRule: {
    configurable: false,
    enumerable: true,
    writable: false,
    value: function getRule(locale) {
      return getBestRule(locale);
    }
  },

  /**
  Set or override a plural spec for the given locale
  */
  setRule: {
    configurable: false,
    enumerable: true,
    writable: false,
    value: function setRule(locale, rule) {
      if (!(locale && (typeof locale === 'string')) || (locale.length < 2)) {
        throw new Error('Invalid locale : ' + locale);
      }

      if ((rule === null) || (typeof rule !== 'object')) {
        throw new Error('Null or non-object rule for : ' + locale);
      } else if (!('languageName' in rule) || (typeof rule.languageName !== 'string')) {
        throw new Error('Missing or invalid language name in rule for : ' + locale);
      } else if (!('nplurals' in rule) || !(rule.nplurals instanceof Array)) {
        throw new Error('Missing or invalid nplurals array in rule for : ' + locale);
      } else if (!('plural' in rule) || !(rule.plural instanceof Function)) {
        throw new Error('Missing or invalid plural function for : ' + locale);
      }

      rules[sanitizeLocale(locale)] = createRule(rule.languageName, rule.nplurals, rule.plural);
    }
  }
});
