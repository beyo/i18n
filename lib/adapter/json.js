
const FILE_PATTERN = /.+\.(js|json)$/;
const LOCALE_PATTERN = /.+\/(\w+)\.(js|json)$/;

/**
Load the given JSON or JS module and return it. The module is supposed to be
an object whose keys and values are I18N translation strings. The file argument
should be an absolute file name.
*/
module.exports = function jsonAdapter(file) {
  var locale;
  var messages = false;

  if (!FILE_PATTERN.test(file)) {
    return false;
  }

  return {
    locale: file.replace(LOCALE_PATTERN, '$1'),
    messages: require(file)
  };
};
