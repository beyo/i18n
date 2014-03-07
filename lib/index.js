
/**
Module dependency
*/
var Translator = module.exports.Translator = require('./translator');

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

// export external objects
var C = module.exports.const = require('./const');
var plurals = module.exports.plurals = require('./plurals');


Object.freeze(C);
Object.freeze(plurals);

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


/**
Initialize the module's global translator with the given options
*/
module.exports.init = function init(options) {
  var oldListeners;

  if (globalTranslator) {
    oldListeners = {};

    ['initialized', 'defaultLocaleChanged', 'defaultGenderChanged', 'localeLoaded', 'translation'].forEach(function (event) {
      oldListeners[event] = globalTranslator.listeners(event);
    });
  }

  globalTranslator = new Translator(options);

  if (oldListeners) {
    Object.keys(oldListeners).forEach(function (event) {
      oldListeners[event].forEach(function (listener) {
        globalTranslator['listener' in listener ? 'once' : 'on'](event, listener);
      });
    });
  }

  return module.exports;
};
