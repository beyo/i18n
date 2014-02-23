
const DEFAULT_LOCALE = 'en';

const MESSAGE_ZERO = 'zero';
const MESSAGE_ONE = 'one';
const MESSAGE_TWO = 'two';
const MESSAGE_FEW = 'few';
const MESSAGE_MANY = 'many';
const MESSAGE_OTHER = 'other';

const MESSAGE_SUBTITUTION_PATTERN = /\{\{([\w.]+)\}\}/g;

const ADAPTER_PATH = __dirname + '/adapter';


var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var adapters = [];


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



var Translator = module.exports = function Translator(options, callback) {
  var inst = this;
  var async = false;
  var locale;
  var messages;

  options = options || {};

  if (callback) {
    this.once('initialized', callback);
  }

  Object.defineProperty(this, '__internal', {
    __proto__: null,
    writable: true,
    value: {}
  });

  this.defaultLocale = options.defaultLocale || DEFAULT_LOCALE;

  // Note : see if we need a getter/setter for this
  this.__internal.subtitutionPattern = options.subtitutionPattern || MESSAGE_SUBTITUTION_PATTERN;

  if (options.messages) {
    for (locale in messages) {
      loadLocale(this, locale, messages[locale]);
    }
  }

  if (options.autoload) {
    async = true;

    walkDirRecursive(options.autoload, function(err, files) {
      if (files && files.length) {
        files.forEach(function(file) {
          var imported = adapters.find(function(adapter) {
            return adapter(file);
          });

          if (imported) {
            loadLocale(imported.locale, imported.messages);
          }
        });
      }

      inst.emit('initialized', err);
    });
  }

  if (!async) {
    // still, emit the event async because we need to fire the callback in an async fashion anyhow
    process.nextTick(function() {
      inst.emit('initialized', null);
    });
  }

};

util.inherits(Translator, EventEmitter);

/**
Define prototype
*/
Object.defineProperties(Translator.prototype, {
  defaultLocale: {
    configurable: false,
    enumerable: true,
    get: function getDefaultLocale() {
      return this.__internal.defaultLocale;
    },
    set: function setDefaultLocale(locale) {
      var previousValue = this.__internal.defaultLocale;

      this.__internal.defaultLocale = validateLocale(locale);

      this.emit('defaultLocaleChanged', {
        previousValue: previousValue,
        currentValue: this.__internal.defaultLocale
      });
    }
  },
  getCatalog: {
    configurable: false,
    enumerable: true,
    writable: false,
    value: function(locale) {
      var locales = this.__internal.locales[locale];
      return locales && locales.messages || undefined;
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
Validate that the given locale exists. The value must be a string.
*/
function validateLocale(locale) {
  if (typeof locale !== 'string') {
    throw new Error('Invalid locale : ' + locale);
  }

  if (!require('./index').locales.hasOwnProperty(locale)) {
    throw new Error('Locale not found : ' + locale);
  }

  return locale;
}



/**
Load the given locale messages into the speicified instance
*/
function loadLocale(translator, locale, messages) {
  var localeSpecs = availableLocales[validateLocale(locale)];
  var localeMessages = (localeSpecs.messages = (localeSpecs.messages || {}));
  var key;

  for (key in messages) {
    localeMessages[key] = messages[key];
  }

  translator.emit('localeLoaded', {
    locale: locale,
    messages: localeMessages
  });
}




/**
Return the message translated if available
*/
function translateMessage(msgid, options) {
  var locale = options && options.locale || globalDefaultLocale;
  var localeSpecs = availableLocales[String(locale)];
  var localeMessages = localeSpecs && localeSpecs.messages || {};
  var msgtext = localeMessages[msgid];
  var pluralKey;

  if (!msgtext) {
    msgtext = msgid;
  } else if (localeSpecs && options && (options.plurality !== undefined)) {
    pluralKey = localeSpecs.plural(options.plurality || 0);

    msgtext = msgtext[pluralKey] || msgtext[MESSAGE_OTHER] || msgid;
  }

  if (options && options.data) {
    msgtext = subtituteTokens(msgtext, options.data);
  }

  this.emit('translation', {
    locale: locale,
    originalMessage: msgid,
    translatedMessage: msgtext,
    options: options
  });

  return msgtext;
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
Load all available adapters (to import data into the translator)
*/
fs.readdirSync(ADAPTER_PATH).forEach(function(file) {
  adapters.push(require(ADAPTER_PATH + '/' + file));
});
