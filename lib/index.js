
const LANG_PATH = __dirname + '/lang';
const LANG_PATTERN_FILTER = /.+\.(js|json)/g;
const LANG_PATTERN_MASK = /\..+$/g;


/**
Module dependency
*/
var fs = require('fs');
var util = require('util');
var Translator = module.exports.Translator = require('./translator');

var localeSpecs = {};
var globalTranslator;


/**
Return the global translator object
*/
var getGlobalTranslator = module.exports.getGlobalTranslator = function getGlobalTranslator() {
  if (!globalTranslator) {
    globalTranslator = new Translator();
  }

  return globalTranslator;
};


Object.defineProperty(module.exports, 'defaultLocale', {
  configurable: false,
  enumerable: true,
  get: function getDefaultLocale() {
    return getGlobalTranslator().defaultLocale;
  },
  set: function setDefaultLocale(locale) {
    getGlobalTranslator().defaultLocale = locale;
  }
});

Object.defineProperty(module.exports, 'defaultGender', {
  configurable: false,
  enumerable: true,
  get: function getDefaultGender() {
    return getGlobalTranslator().defaultGender;
  },
  set: function setDefaultGender(gender) {
    getGlobalTranslator().defaultGender = gender;
  }
});

Object.defineProperty(module.exports, 'translate', {
  configurable: false,
  enumerable: true,
  writable: false,
  value: function * translate(message, options) {
    return yield * getGlobalTranslator().translate(message, options);
  }
});

Object.defineProperty(module.exports, 'locales', {
  configurable: false,
  enumerable: true,
  get: function locales() {
    return localeSpecs;
  }
});

Object.defineProperty(module.exports, 'setLocale', {
  configurable: false,
  enumerable: true,
  writable: false,
  value: setLocale
});



/**
Initialize the module's global translator with the given options
*/
module.exports.init = function init(options) {

  // TODO : transfer listeners on any previous defined global translator

  globalTranslator = new Translator(options);

  return module.exports;
};


/**
Validate that the given language specification is valid and contains everything that we need.
The lang argument should be an object with at least these properties :

 - name {String}         the language name
 - plural {Function}     the plural function callback. It should return a valid string.
*/
function validateLocaleSpecs(specs) {
  if (!specs) {
    throw new Error('Invalid locale specification : ' + specs);
  }

  if (typeof specs.name !== 'string') {
    throw new Error('locale specification has no name : ' + specs);
  }

  if (!(specs.plural instanceof Function)) {
    throw new Error('locale specification has no plural function : ' + specs);
  }

  // lock properties
  ['name', 'plural'].forEach(function(property) {
    Object.defineProperty(specs, property, {
      configurable: false,
      enumerable: true,
      writable: false,
      value: specs[property]
    });
  });


  return specs;
}


/**
Add the given locale to the available specs. The locale value must be a string,
but may be any arbitrary string.. The specs will see it's `name` and `plural`
property be locked.
*/
function setLocale(locale, specs) {
  var newLocaleSpecs = {};
  var k;

  if (typeof locale !== 'string') {
    throw new Error('Invalid locale : ' + locale);
  }

  for (k in localeSpecs) {
    newLocaleSpecs[k] = localeSpecs[k];
  }

  newLocaleSpecs[locale] = validateLocaleSpecs(specs);

  Object.freeze(newLocaleSpecs);

  localeSpecs = newLocaleSpecs;
};


/**
Load all available locale specs
*/
fs.readdirSync(LANG_PATH).forEach(function(file) {
  if (file.match(LANG_PATTERN_FILTER) !== null && file !== 'index.js') {
    Object.defineProperty(localeSpecs, file.replace(LANG_PATTERN_MASK, ''), {
      configurable: false,
      enumerable: true,
      writable: false,
      value: validateLocaleSpecs(require(LANG_PATH + '/' + file))
    });
  }
});

Object.freeze(localeSpecs);
