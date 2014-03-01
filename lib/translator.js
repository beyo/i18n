
const LOADER_PATH = __dirname + '/loader';


var co = require('co');
var fs = require('co-fs');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var I18N = require('./index');
var constents = require('./const');

var loaders = [];


var walkDirRecursive = function * walkDirRecursive(dir, done) {
  var results = [];
  var files = (yield fs.readdir(dir));
  var file;

  for (var i = 0, len = files.length; i < len; i++) {
    file = dir + '/' + files[i];
    if ((yield fs.stat(file)).isDirectory()) {
      results.concat(yield walkDirRecursive(file));
    } else {
      results.push(file);
    }
  }

  return results;
};



var Translator = module.exports = function Translator(options) {
  var inst = this;
  var internal = {};

  options = options || {};

  _initProperties(inst, internal, options);
  _initDefaults(inst, internal, options);

  co(function * () {
    if ('locales' in options) {
      yield autoload(inst, internal, options.locales);
    }
  })(function (err) {
    process.nextTick(function() {
      inst.emit('initialized', err);
    });
  });

};

util.inherits(Translator, EventEmitter);

/**
Initialize the translator's properties
*/
function _initProperties(translator, internal, initOptions) {
  Object.defineProperties(translator, {
    defaultLocale: {
      configurable: false,
      enumerable: true,
      get: function getDefaultLocale() {
        return internal.defaultLocale;
      },
      set: function setDefaultLocale(locale) {
        var previousValue = internal.defaultLocale;

        internal.defaultLocale = validateLocale(locale);

        this.emit('defaultLocaleChanged', {
          previousValue: previousValue
        });
      }
    },
    load: {
      configurable: false,
      enumerable: true,
      writable: false,
      value: function * load(locales) {
        yield autoload(translator, internal, locales);
        return this;
      }
    },
    translate: {
      configurable: false,
      enumerable: true,
      writable: false,
      value: function * translate(msg, options) {
        return yield * translateMessage(translator, internal, msg, options);
      }
    }
  });
}

/**
Initialize any default options in the initialization process
*/
function _initDefaults(translator, internal, initOptions) {

  translator.defaultLocale = initOptions.defaultLocale || constents.DEFAULT_LOCALE;

  internal.substitutionPattern = initOptions.substitutionPattern || constents.DEFAULT_SUBSTITUTION_PATTERN;
  if (!(internal.substitutionPattern instanceof RegExp)) {
    internal.substitutionPattern = new RegExp(internal.substitutionPattern, 'g');
  }

  internal.messageLoaders = {};

}

/**
Check if we need to audoload some messages. Return true or false
*/
function * autoload(translator, internal, locales) {
  function * load(data) {
    var loaderInst;

    for (var i = 0, len = loaders.length; !loaderInst && i < len; i++) {
      loaderInst = yield loaders[i](data);
    };

    return loaderInst;
  }

  if (typeof locales === 'string') {
    locales = yield walkDirRecursive(locales);
  } else if (!(locales instanceof Array)) {
    throw new Error('Invalid locales options : ' + locales);
  }

  if (locales && locales.length) {
    for (var i = 0, len = locales.length; i < len; i++) {
      var loaderInst = yield * load(locales[i]);

      if (loaderInst) {
        loadLocale(translator, internal, loaderInst);
      } else {
        throw new Error("Could not load locale from : " + locales[i]);
      }
    }
  }
}



/**
Validate that the given locale exists. The value must be a string.
*/
function validateLocale(locale) {
  if (typeof locale !== 'string') {
    throw new Error('Invalid locale : ' + locale);
  }

  if (!I18N.locales.hasOwnProperty(locale)) {
    throw new Error('Locale not found : ' + locale);
  }

  return locale;
}


/**
Load the given locale messages into the speicified instance
*/
function loadLocale(translator, internal, loaderInst) {
  var locale = validateLocale(loaderInst.locale);

  if (internal.messageLoaders[locale]) {
    throw new Error("Conflict in loaded locales : " + locale);
  }

  internal.messageLoaders[locale] = loaderInst;

  translator.emit('localeLoaded', {
    locale: locale,
    loader: loaderInst
  });
}


/**
Return the message translated if available
*/
function * translateMessage(translator, internal, msgId, options) {
  var locale = options && options.locale || translator.defaultLocale;
  var localeSpecs = I18N.locales[locale] || undefined;
  var msgText = (internal.messageLoaders[locale] && (yield * internal.messageLoaders[locale].get(msgId))) || msgId;
  var pluralKey;
  var response;

  if ((msgText !== null) && (typeof msgText === 'object')) {
    pluralKey = localeSpecs && options && ('plurality' in options) ? localeSpecs.plural(options.plurality) : constents.MESSAGE_OTHER;

    msgText = msgText[pluralKey] || msgText[constents.MESSAGE_OTHER] || msgText;
  }

  msgText = substituteTokens(translator, internal, msgText, options && options.data || {});

  translator.emit('translation', response = {
    locale: locale,
    originalMessage: msgId,
    translatedMessage: msgText,
    options: options
  });

  return response.translatedMessage;
}

/**
Replace all {{token}} with the given data's value
*/
function substituteTokens(translator, internal, message, data) {
  function resolve(attr, obj) {
    var i, len;
    attr = attr.split('.');
    for (i = 0, len = attr.length; obj && i < len; i++) {
      obj = obj[attr[i]];
    }
    return obj;
  }

  return message.replace(internal.substitutionPattern, function(match, token) {
    return resolve(token, data) || '';
  });
}


/**
Load all available loaders (to import data into the translator)
*/
require('fs').readdirSync(LOADER_PATH).forEach(function(file) {
  loaders.push(require(LOADER_PATH + '/' + file));
});
