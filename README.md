## Beyo i18n

[![Build Status](https://travis-ci.org/beyo/i18n.png)](https://travis-ci.org/beyo/i18n)
[![Stories in Ready](http://badge.waffle.io/beyo/i18n.png)](http://waffle.io/beyo/i18n)

Internationalisation module for Node.js with plural forms and paramater subtitutions.

So, why another i18n module? Because I wanted a module which was not dependant or bloated
with unnecessary dependencies or features. I wanted a module that was standalone and asychronous.
I wanted a module that followed standards. I wanted it to be easily extended.

## Installation

```
npm install beyo-i18n
```

## Features

* Asynchronous API through generator functions [`co`](https://github.com/visionmedia/co) compatible.
* Autoloading localization strings via various loaders (see Loaders).
* Global translator and instance translators.
* Fallback to default locale per translator.
* Automatically handling plural forms in a variety of different languages (see Supported locales).
* Automatically handling gender forms (locale agnostic).
* Message token subtitution during translation.
* Translators emit events.
* Possibility to override just about anything.
* Frozen objects with validations across all setters
* Fully tested with a target of 100% coverage.
* Well structured code.

## Usage

```javascript
// Note : calling 'init' is optional
var i18n = require('beyo-i18n').init(options);

co(function * () {
  var data = {
    locale: 'fr',       // set the locale to use to translate
    data: {
      person: {
        firstname: 'John',
        lastname: 'Smith',
        //...
      },
      //...
    }
  };

  yield i18n.translate("Hello {{person.firstname}}!", data);
  // -> "Bonjour John !"
})();
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

* **defaultGender** *{String}* : The default gender to use when translating a message
and no gender is provided. A gender must be one of these values : `"m"`, `"f"`, and `"n"`.
*(Default: `'n'`)*

* **subtitutionPattern** *{Regex|String}* : The subtitution pattern to recognize the
tokens in a translatation message. While this value may be a string, it very much should
be a regular expression for things to work properly. *(Default: `/\{\{([\w.]+)\}\}/g`)*

* **locales** *{mixed}* : The given value will be passed to the `load` method when
initializing the translator. The value may be of type `String`, `Array` or `Object`.
*(Default: `null`)* **Note**: `Object`s may not be handled at this time by any loader.

  For example :

  ```javascript
  var localesDir  = 'path/to/lc_locales';
  // or
  var localesFiles = [ 'path/to/en.json', 'path/to/fr.json', ... ];
  ```

## Events

All translators emit events. These may be used to extend a translator, or to monitor it's
activity.

* **initialized** *(no argument)* : fired only once after the translator is done initializing.
* **defaultLocaleChanged** *(Object)* : fired when the translator's default locale is changed.
The listener will receive one argument; an object, for example : `{ previousValue: 'en' }`.
* **defaultGenderChanged** *(Object)* : fired when the translator's default gender is changed.
The listener will receive one argument; an object, for example : `{ previousValue: 'n' }`.
* **localeLoaded** *(Object)* : fired whenever a locale is loaded into the translator. This is
handy when extending locale loaders. The listener will receive one argument; an object, for
example : `{ locale: 'en', loader: [Object] }` (see Loaders).
* **translation** *(Object)* : fired whenever a string is translated. The listener will
receive one argument; an object, for example : `{ locale: 'fr', originalMessage: 'Hello!',
translatedMessage: 'Bonjour!', options: null }` where the `options` are the actual object
passed to the `translate` function. **Note**: replacing `translatedMessage`'s value will
result in changing the translation's returned string!

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
* `'*'` *(default)* : Any other specification goes here. This is the default langauge key; where
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

All supported locales can be fetched via `require('beyo-i18n').plurals`. Apart from being a
callable function to retrieve the plurality key for a given local and n, the `plurals` object
also exposes the following API functionalities :

* **isValid(locale)** *:{Boolean}* : returns true if and only if the following locale resolves to
a plural rule.
* **getLanguages()** *{Object}* : returns an `Object` whose keys are the various available locales
and the values are the associated language english names.
* **getRule(locale)** *{Object}* : returns an `Object` of the specified locale's plurality rules.
If the locale is invalide, `undefined` is returned.
* **setRule(locale, rule)** : sets the given locale's plurality rules. If the rele already exists,
it will override the previous value.

Example :

```javascript
var C = require('beyo-i18n/const');
var plurals = require('beyo-i18n/plurals');

// fr.js
var frCA_plural = {
  languageName: "French (Canadian)",
  nplurals: [ C.PLURAL_ONE, C.PLURAL_OTHER ],
  plural: function (n) { return (n > 1) ? 1 : 0; }
};

plurals.isValid('fr-CA'); // false

plurals.setRule('fr-CA', frCA_plural);

plurals.isValid('fr-CA'); // true

```

All keys must be defined (i.e. `languageName`, `nplurals`, and `plural`) or an errror will be thrown.

## Language Gender Rules

Some loaders will enable gender specifications when loading locales content. These
gender rules *must* be loaded inside a plural rule. If no plural rule applies, use the "other" (`'*'`) plural rule. For example :

```javascript
{
  "Restrooms" : {
    "other": {
      "n": "Restrooms",
      "m": "Men's rooms",
      "f": "Ladies' rooms"
    }
  }
}
```

A gender key must be one of the following values (case sensitive) : `'m'` for male, `'f'` for female, and `'n'` for neutral.

## Loaders

Loaders allow an abstraction layer while accessing locale messages. The loader should be a
`GeneratorFunction` receiving only one argument and should return `false` if the argument
cannot be handled, or an `Object` containing the locale information and messages. This
object should propose at least these following methods.

* **locale** *{string}*
* **contains** *{GeneratorFunction}*
* **get** *{GeneratorFunction}*
* **forEach** *{Function}*

The returned value for a call to `get` should be one of the following :

* `"Some simple string."`
* `{ "one": "Non plural string", "other": "Default (plural) string" }`
* `{ "other": { "m": "Male gender", "f": "Female gender", "n": "Neutral gender" } }`

And any combination of these values.

### List of available (or soon to be) adapters

* **json** : standard JavaScript Object adapter. Use Node.js' `require` functionality to
import modules. The locale is determined from the filename, therefore the file should be
named like `en.js` for English, `fr.js` for French, and so on. The files may as well be
JSON files (i.e. `es.json`). It's very fast as it's parsed by the engine thus is already
an `Object`.

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
