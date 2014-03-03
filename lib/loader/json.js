
const FILE_PATTERN = /.+\.(json|js)$/;
const LOCALE_PATTERN = /.+\/(\w+)\.(json|js)$/;

//var co = require('co');
var fs = require('co-fs');

var JsonLoader = function JsonLoader(file, locale, msg) {
  var _messages = msg;

  Object.defineProperties(this, {
    locale: {
      configurable: false,
      enumerable: true,
      writable: false,
      value: locale,
    },
    source: {
      configurable: false,
      enumerable: true,
      writable: false,
      value: file,
    },
    contains: {
      configurable: false,
      enumerable: true,
      writable: false,
      value: function * containsMessage(msgId) {
        return !!_messages[msgId];
      }
    },
    get: {
      configurable: false,
      enumerable: true,
      writable: false,
      value: function * getMessage(msgId) {
        return _messages[msgId];
      }
    },
    forEach: {   // TODO : replace this with __iterator__ once it is implemented
      configurable: false,
      enumerable: true,
      writable: false,
      value: function forEach(iterator) {
        for (var msgId in _messages) {
          if (iterator(msgId) === false) {
            break;
          }
        }
      }
    }
  });
};


/**
Load the given JSON or JS module and return it. The module is supposed to be
an object whose keys and values are I18N translation strings. The file argument
should be an absolute file name.
*/
module.exports = function * jsonLoader(file) {
  var locale;
  var messages;

  if (typeof file !== 'string' || !FILE_PATTERN.test(file) || !(yield fs.exists(file))) {
    return false;
  }

  locale = file.replace(LOCALE_PATTERN, '$1');
  messages = require(file);

  return new JsonLoader(file, locale, messages);
};
