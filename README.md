## Beyo i18n [![Build Status](https://travis-ci.org/beyo/i18n.png)](https://travis-ci.org/beyo/i18n)

Internationalisation module for Node.js with plural forms and paramater subtitutions.

So, why another i18n module? Because I wanted a module which was not dependant or bloated
with unnecessary dependencies or features. I wanted a module that was standalone. I wanted
a module that followed standards. I wanted it to be easily extended.

This module is intended to be a community effort. As it is not incorporated in any major
project, yet (as far as I know anyway), it is a plastic module and may be subject to changes.
However, since this module aims at following standards, any change will only be for the best!

## Installation

```
npm install beyo-i18n
```

## Features

* Autoloading localization strings via various adapters (see Adapters).
* Global translator and instance translators.
* Fallback to default locale per translator.
* Automatically handling plural forms in a variety of different languages (see Supported locales).
* Message token subtitution during translation.
* Translators emit events.
* Possibility to override just about anything.
* Fully tested with a target of 100% coverage.
* Well structured code.

## Usage

```javascript
// Note : calling 'init' is optional
var i18n = require('beyo-i18n').init(options[, callback]);

var data = {
  locale: 'fr',       // set the locale to use to translate
  data: {
    person: {
      firstname: 'John',
      lastname: 'Smith',
      ...
    },
    ...
  }
};

i18n.translate("Hello {{person.firstname}}!", data);
// -> "Bonjour John !"
```

## Translator Configuration

While the module does not require initialization, a project may require to
customize some of the features. By default, the i18n module will load all
it's available locale specifications and will not contain any translation
strings.

* **defaultLocale** *{String}* : The default locale to use when translating a message
and no locale is provided. This setting is global! And you cannot set a locale that
is not available. An invalid locale will throw an exception. All available locales are
listed in the `i18n.locales`'s object properties. *(Default: `'en'`)*

* **subtitutionPattern** *{Regex|String}* : The subtitution pattern to recognize the
tokens in a translatation message. While this value can be a string, it very much should
be a regular expression for things to work properly. *(Default: `/\{\{([\w.]+)\}\}/g`)*

* **messages** *{Object}* : An object containing translation strings, where the keys are
the messages locales and the associated values are objects with translation messages
information. See [Language Plural Rules](#language-plural-rules) for more information.
*(Default: `null`)*

  For example :

  ```javascript
  var messages = {
    'es': {
      'Hello world!': '¡Hola, mundo!'
    },
    'fr': {
      'Hello world!': 'Bonjour, monde!'
    }
  };
  ```

* **autoload** *{String}* : A path where to load the translation strings from files. This
option will scan the selected path recursively and load any file that can be imported by
the available [adapters](#adapters). *(Default: `null`)*

## Language Plural Rules

This module follows the guideline found in the Unicode CLDR Charts on
[Language Plural Rules](http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html).
Thiss standard is also respected by [gettext](http://www.gnu.org/software/gettext/) and
[Mozilla](https://developer.mozilla.org/en/docs/Localization_and_Plurals).

However, because this module exposes the messages contained in a locale catalog, the
plurality indexes are converted into human-readable object properties. The benefit of using
objects instead of arrays (as for gettext) is that any plural form may be omitted without
having unnecessary null elements in memory.

Also, an important information to know is that the actual "meaning" of every property is
language dependant! See the [language specifications](#language-specifications) for more
information.

* `'zero'` : Depending on the language; where there's nothing.
* `'one'` : Depending on the language; where there's an unicity in number.
* `'two'` : Depending on the language; where there's a pair.
* `'few'` : Depending on the language; where there's a small amount.
* `'many'` : Depending on the language; where there's a fairly large amount.
* `'other'` : Any other specification goes here. This is the default langauge key; where
we may find fractions, negative or otherwise unspecified or very large numbers. For any
translation, this should always be specified at all times. This is also the fallback
translation in case other language keys or not defined.

**Note**: gettext make use of translations like this :

```text
msgid "One file removed"
msgid_plural "%d files removed"
msgstr[0] "%d slika je uklonjena"
msgstr[1] "%d datoteke uklonjenih"
msgstr[2] "%d slika uklonjenih"
```

which is not necessary. In your application, if using plurality, only provide the plural
form to translate (`msgid_plural`). If the `msgid` does not exist, it's not a bigger deal
to display a plural string for a singular count.

Naturally, messages are not required to have a plural form, and may very well be specified as
a `string` (like in the example above). Plural forms and non plural forms may be mixed for any
given translation messages.

### Language Specifications

A language specifications is a node.js module exposing at least two properties;

* **name** *{String}* : the language or locale english name.
* **plural** *{Function}* : a function receiving one argument (typically numeric) and should
return one of the human-readable plural object property.

Example :

```javascript
// fr.js
module.exports.name = 'French';

module.exports.plural = function plural(n) {
  return (n === 0) || (n === 1) ? 'one' : 'other';
};
```

## Adapters

Adapters allow loading locale messages directly from files. The adapter should be a node
module receiving the file path (should be absolute) and should return `false` if the file
cannot be handled, or an `Object` containing the locale information and messages. For
example :

```javascript
{
  locale: 'fr',
  messages: {
    'Hello world!': 'Bonjour, monde!',
    'You have {{length}} items': {
      'one': 'Vous avez {{length}} article',
      'other': 'Vous avez {{length}} articles'
    }
  }
}
```

### List of available (or soon to be) adapters

* **json** : standard JavaScript Object adapter. Use Node.js' `require` functionality to
import modules. The locale is determined from the filename, therefore the file should be
named like `en.js` for English, `fr.js` for French, and so on. The files may as well be
JSON files (i.e. `es.json`). It's very fast as it's parsed by the engine thus is already
an `Object`.

* **xml** : *not implemented*

* **ini** : *not implemented*

* **gettext** : *not implemented*

## Contribution

All contributions welcome! Every PR **must** be accompanied by their associated
unit tests!

## License

The MIT License (MIT)

Copyright (c) 2014 Mind2Soft <yanick.rochon@mind2soft.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
