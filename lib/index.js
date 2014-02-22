
const LANG_PATH = __dirname + '/lang';

const MESSAGE_ZERO = 'zero';
const MESSAGE_ONE = 'one';
const MESSAGE_TWO = 'two';
const MESSAGE_FEW = 'few';
const MESSAGE_MANY = 'many';
const MESSAGE_OTHER = 'other';

/**
Module dependency
*/
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

/**
The module's default locale
*/
var globalDefaultLocale = 'en';
var availableLocales = {};
var messageSubtitutionPattern = /\{\{([\w.]+)\}\}/g;


/**
See : http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
*/
var walkDirRecursive = function walkDirRecursive(dir, done) {
  var results = [];
  fs.readdir(dir, function (err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walkDirRecursive(file, function (err, res) {
            results = results.concat(res);
            if (!--pending) done(err, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(err, results);
        }
      });
    });
  });
};


/**
Export i18n object
*/
var I18N = module.exports = Object.create(EventEmitter.prototype, {
  defaultLocale: {
    configurable: false,
    enumerable: true,
    get: function getDefaultLocale() {
      return globalDefaultLocale;
    },
    set: function setDefaultLocale(locale) {
      globalDefaultLocale = validateLocale(locale);
    }
  },
  getCatalog: {
    configurable: false,
    enumerable: true,
    writable: false,
    value: function(locale) {
      return availableLocale[validateLocale(locale)].messages;
    }
  },
  translate: {
    configurable: false,
    enumerable: true,
    writable: false,
    value: translateMessage
  }
});

/**
Initialize the module
*/
I18N.init = function init(options, callback) {
  var async = false;
  var locale;
  var messages;

  if (callback) {
    I18N.once('initialized', callback);
  }

  if (options.defaultLocale) {
    I18N.defaultLocale = options.defaultLocale;
  }

  if (options.subtitutionPattern) {
    messageSubtitutionPattern = options.subtitutionPattern;
  }

  if (options.locales) {
    for (locale in locales) {
      loadLocale(locale, locales[locale]);
    }
  }

  if (options.autoload) {
    async = true;

    walkDirRecursive(options.autoload, function(err, files) {
      if (files && files.length) {
        files.forEach(function(file) {
          locale = file.replace(/.+\/(\w+)\.(js|json)$/g, '$1');
          messages = require(file);

          loadLocale(locale, messages);
        });
      }

      I18N.emit('initialized', err);
    });
  }

  if (!async) {
    I18N.emit('initialized', null);
  }

  return I18N;
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

  return specs;
}

/**
Validate that the given locale exists. The value must be a string.
*/
function validateLocale(locale) {
  if (typeof locale !== 'string') {
    throw new Error('Invalid locale : ' + locale);
  }

  if (!availableLocales.hasOwnProperty(locale)) {
    throw new Error('Locale not found : ' + locale);
  }

  return locale;
}

/**
Load the given locale messages into the speicified locale specs
*/
function loadLocale(locale, messages) {
  var localeSpecs = availableLocales[validateLocale(locale)];
  var localeMessages = (localeSpecs.messages = (localeSpecs.messages || {}));
  var key;

  for (key in messages) {
    localeMessages[key] = messages[key];
  }
}

/**
Return the message translated if available
*/
function translateMessage(message, options) {
  var locale = options.locale || globalDefaultLocale;
  var localeSpecs = availableLocales[String(locale)];
  var localeMessages = localeSpecs && localeSpecs.messages || {};
  var localeMessage = localeMessages[message];
  var pluralKey;

  if (typeof localeMessage === 'string') {
    message = localeMessage;
  } else if (localeSpecs && (plurality !== undefined)) {
    pluralKey = localeSpecs.plural(plurality || 0);

    message = localeMessage[pluralKey] || localeMessage[MESSAGE_OTHER] || message;
  }

  if (options.data) {
    message = subtituteTokens(message, options.data);
  }

  return message;
}

/**
Replace all {{token}} with the given data's value
*/
function subtituteTokens(message, data) {
  function resolve(attr, obj) {
    var i, len;
    attr = attr.split('.');
    for (i = 0, len = attr.length; obj && i < len; i++) {
      obj = obj[attr[i]];
    }
    return obj;
  }

  return message.replace(messageSubtitutionPattern, function(match, token) {
    return resolve(token, data) || '';
  });
}


/**
Load all available locale specs
*/
fs.readdirSync(LANG_PATH).forEach(function(file) {
  if (file.match(/.+\.(js|json)/g) !== null && file !== 'index.js') {
    availableLocales[file.replace(/\..+$/, '')] = validateLocaleSpecs(require(LANG_PATH + '/' + file));
  }
});
