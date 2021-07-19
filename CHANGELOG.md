# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]


## [4.1.1] - 2021-09-01
### Changed
- Set package type to `module` to better support native ES module imports.
- Improved website design.

## [4.1.0] - 2019-10-22
### Added
- `spinner-line-shrink` animation preset.

## [4.0.0] - 2018-05-06
### Changed
- Switched from `requestAnimationFrame` back to CSS keyframe animations
for better performance.
- In order to preserve compatibility with the
`style-src 'self';` Content Security Policy, animations are now defined
via an external CSS file rather than inserted dynamically.

Add the following to your page to use one of the preset animations:

```html
<link rel="stylesheet" href="node_modules/spin.js/spin.css"/>
```

You can also define custom opacity animations in your own CSS file and
select them via the `animation` option.

### Fixed
- A transparent shadow is now set by default to resolve aliased lines in
certain browsers (issue [#355]).

### Removed
- `opacity` and `trail` options (define a custom opacity animation instead).
- Support for Internet Explorer 9 (it doesn't support keyframe animations).
- `fps` option (only used for IE 9).

## [3.1.0] - 2017-11-26
### Added
- Support for custom box-shadows with corrected positioning (issue [#35]).
- `fadeColor` option to customize the color that lines fade to (issue [#30]).

## [3.0.0] - 2017-11-09
### Added
- Support for Content Security Policy `style-src 'self';` option
(issue [#115] and issue [#229]).
- [CONTRIBUTING.md](CONTRIBUTING.md) file.

### Changed
- Rewritten in TypeScript.
- Replaced dynamic CSS keyframe animations with `requestAnimationFrame`.
- Unified animation logic in all browsers.
- Moved internal functions out of Spinner instance.
- Website now uses native range inputs rather than a polyfill, and doesn't
depend on jQuery.
- Distributed as a standard ES6 module (closes [#341]).

### Fixed
- Janky animation appearance in Microsoft Edge (issue [#342]).
- Missing line with trail set to 100 in Internet Explorer (issue [#327]).
- Spinner is not defined error in Angular (issue [#340]).

### Removed
- Useless `hwaccel` option.
- IE 6-8 support and VML fallback since it isn't needed for IE 9+.
- Minified files from bundle.
- jQuery plugin (closes [#325]).
- Bower/composer/component/spm support. Install from npm instead
(recommended), or save spin.js file in your repo.


Note: version 3.0 does not change the public Spinner API, so if you are
already using a module bundler such as Webpack or Rollup, upgrading should
be as easy as adding the following ES6 module import:

```javascript
import {Spinner} from 'spin.js';
```

## [2.3.2] - 2015-07-24
### Fixed
- Updated UMD header to protect against HTMLElement global pollution
(PR [#300]).

## [2.3.1] - 2015-06-15
### Changed
- There were multiple tagging issues that produced 2.1.3, 2.2.0, and 2.3.0.
In the spirit of SemVer, this release is now 2.3.1.
- The minified spin.min.js is now distributed in the repo, making Bower
usage easier (issue [#250]).

### Fixed
- Incorrect syntax in the example at the top of spin.js (PR [#294]).

### Removed
* Moot `version` property from Bower manifest (PR [#295]).

## [2.1.2] - 2015-05-28
### Changed
- Version 2.1.1 had a packaging error, so this release is now 2.1.2.
- Standard CSS attributes are now preferred over vendor ones if supported.
- Unified internal coding style across all files.
- Website now uses the latest version of jQuery from its 1.x branch.
- Updated documentation to note that the container element must use
relative positioning (issue [#292]).

### Added
- spm support (PR [#232]).

### Fixed
- All broken examples
- Bug on demo page where the direction setting wasn't reflected in the
option object.

## [2.1.0] - 2015-04-16
### Added
- `scale` option for resizing the spinner (PR [#287]).
- Support for importing on server without DOM (PR [#283]).

## [2.0.2] - 2015-01-02
### Fixed
- Use correct `require` call in jQuery plugin

### Removed
- Cleaned up unused code

## [2.0.1] - 2014-04-24
### Fixed
- Position offsets are now applied when instantiating spinner without
a target (issue [#218]).

## [2.0.0] - 2014-03-13
### Changed
- Spinner is now absolutely positioned at `top: 50%, left: 50%` by default.
- `top` and `left` options now require CSS units. For example, `top: 100`
must instead be written as `top: '100px'`.
- Spinner must now always be invoked as constructor.

## [1.3.3] - 2013-12-24
### Changed
 - Created master branch and Grunt-based build process (issue [#189]).

## [1.3.2] - 2013-08-26
### Fixed
- SyntaxError in Chrome Canary (issue [#168]).

## [1.3.1] - 2013-08-19
### Added
- Support for multi-colored spinners (PR [#167]).

## [1.3.0] - 2013-04-02
### Added
- `direction` option to control the spinning direction (PR [#126]).
- jQuery plugin

### Changed
- Implemented UMD pattern to support AMD and CommonJS module loaders
- Use strict mode

## [1.2.8] - 2013-02-07
### Fixed
- 'Spinner' is undefined error in Internet Explorer 7 and 8 (issue [#78]).

## [1.2.7] - 2012-10-02
### Added
- `position` option to control the corresponding CSS property (issue [#98]).
- Trailing semicolon to support concatenation tools that don't know about
ASI (issue [#96] and issue [#99]).

## [1.2.6] - 2012-08-30
### Added
- `corners` option to control the border-radius (issue [#93]).

### Fixed
- Scroll bar appearing in wide target elements (issue [#74]).
- Invalid Argument error in Internet Explorer (issue [#77]).
- Broken spinner in Opera 12 (issue [#87]).
- Unexpected positioning when specifying `top` and `left` options as a
string (issue [#81] and issue [#90]).

## [1.2.5] - 2012-03-22
### Added
- `rotate` option (issue [#60]).

### Fixed
- Bug that prevented the VML from being displayed when Modernizr's
html5shiv was used (issue [#58]).
- The `constructor` property is now preserved (issue [#61]).

## [1.2.4] - 2012-02-28
### Added
- New config options: `top`, `left`, `zIndex`, and `className`.

## [1.2.3] - 2012-01-30
### Changed
- Disabled hardware acceleration by default to prevent disappearing
objects and flashing colors in Chrome and Safari (issue [#41] and
issue [#47]).

## [1.2.2] - 2011-11-08
### Fixed
- Cross-domain issue with the dynamically created stylesheet (issue [#36]).

## [1.2.1] - 2011-10-05
### Fixed
- Error when loading spinner in Internet Explorer 9 (issue [#31]).

## [1.2.0] - 2011-09-16
### Changed
- Calling `spin()` now invokes `stop()` first (issue [#28]).
- The `new` operator is now optional (issue [#14]).
- Improved accessibility by adding `role="progressbar"`.

### Fixed
- Implemented workaround for negative margin bug in Internet Explorer
(issue [#27]).

## [1.1.0] - 2011-09-06
### Changed
- Optimized the code for gzip compression. While the minified version
got slightly larger, the zipped version now only weighs 1.7K.

### Fixed
- Animation occasionally got out of sync in mobile Safari and Android's
built-in WebKit (issue [#12]).
- Spinner was misplaced when the target element had a non-zero padding
(issue [#23]).

## [1.0.0] - 2011-08-16
- Initial release

[Unreleased]: https://github.com/fgnass/spin.js/compare/4.1.1...HEAD
[4.1.1]: https://github.com/fgnass/spin.js/compare/4.1.0...4.1.1
[4.1.0]: https://github.com/fgnass/spin.js/compare/4.0.0...4.1.0
[4.0.0]: https://github.com/fgnass/spin.js/compare/3.1.0...4.0.0
[3.1.0]: https://github.com/fgnass/spin.js/compare/3.0.0...3.1.0
[3.0.0]: https://github.com/fgnass/spin.js/compare/2.3.2...3.0.0
[2.3.2]: https://github.com/fgnass/spin.js/compare/2.3.1...2.3.2
[2.3.1]: https://github.com/fgnass/spin.js/compare/2.1.2...2.3.1
[2.1.2]: https://github.com/fgnass/spin.js/compare/2.1.0...2.1.2
[2.1.0]: https://github.com/fgnass/spin.js/compare/2.0.2...2.1.0
[2.0.2]: https://github.com/fgnass/spin.js/compare/2.0.1...2.0.2
[2.0.1]: https://github.com/fgnass/spin.js/compare/2.0.0...2.0.1
[2.0.0]: https://github.com/fgnass/spin.js/compare/1.3.3...2.0.0
[1.3.3]: https://github.com/fgnass/spin.js/compare/1.3.2...1.3.3
[1.3.2]: https://github.com/fgnass/spin.js/compare/1.3.1...1.3.2
[1.3.1]: https://github.com/fgnass/spin.js/compare/1.3.0...1.3.1
[1.3.0]: https://github.com/fgnass/spin.js/compare/1.2.8...1.3.0
[1.2.8]: https://github.com/fgnass/spin.js/compare/1.2.7...1.2.8
[1.2.7]: https://github.com/fgnass/spin.js/compare/1.2.6...1.2.7
[1.2.6]: https://github.com/fgnass/spin.js/compare/1.2.5...1.2.6
[1.2.5]: https://github.com/fgnass/spin.js/compare/1.2.4...1.2.5
[1.2.4]: https://github.com/fgnass/spin.js/compare/1.2.3...1.2.4
[1.2.3]: https://github.com/fgnass/spin.js/compare/1.2.2...1.2.3
[1.2.2]: https://github.com/fgnass/spin.js/compare/1.2.1...1.2.2
[1.2.1]: https://github.com/fgnass/spin.js/compare/1.2.0...1.2.1
[1.2.0]: https://github.com/fgnass/spin.js/compare/1.1.0...1.2.0
[1.1.0]: https://github.com/fgnass/spin.js/compare/1.0.0...1.1.0
[1.0.0]: https://github.com/fgnass/spin.js/tree/1.0.0

[#355]: https://github.com/fgnass/spin.js/issues/355
[#342]: https://github.com/fgnass/spin.js/issues/342
[#341]: https://github.com/fgnass/spin.js/issues/341
[#340]: https://github.com/fgnass/spin.js/issues/340
[#327]: https://github.com/fgnass/spin.js/issues/327
[#325]: https://github.com/fgnass/spin.js/issues/325
[#300]: https://github.com/fgnass/spin.js/pull/300
[#295]: https://github.com/fgnass/spin.js/pull/295
[#294]: https://github.com/fgnass/spin.js/pull/294
[#292]: https://github.com/fgnass/spin.js/issues/292
[#287]: https://github.com/fgnass/spin.js/pull/287
[#283]: https://github.com/fgnass/spin.js/pull/283
[#250]: https://github.com/fgnass/spin.js/issues/250
[#232]: https://github.com/fgnass/spin.js/pull/232
[#229]: https://github.com/fgnass/spin.js/issues/229
[#218]: https://github.com/fgnass/spin.js/issues/218
[#189]: https://github.com/fgnass/spin.js/issues/189
[#168]: https://github.com/fgnass/spin.js/issues/168
[#167]: https://github.com/fgnass/spin.js/pull/167
[#126]: https://github.com/fgnass/spin.js/pull/126
[#115]: https://github.com/fgnass/spin.js/issues/115
[#99]: https://github.com/fgnass/spin.js/issues/99
[#98]: https://github.com/fgnass/spin.js/issues/98
[#96]: https://github.com/fgnass/spin.js/issues/96
[#93]: https://github.com/fgnass/spin.js/issues/93
[#90]: https://github.com/fgnass/spin.js/issues/90
[#87]: https://github.com/fgnass/spin.js/issues/87
[#81]: https://github.com/fgnass/spin.js/issues/81
[#78]: https://github.com/fgnass/spin.js/issues/78
[#77]: https://github.com/fgnass/spin.js/issues/77
[#74]: https://github.com/fgnass/spin.js/issues/74
[#61]: https://github.com/fgnass/spin.js/issues/61
[#60]: https://github.com/fgnass/spin.js/issues/60
[#58]: https://github.com/fgnass/spin.js/issues/58
[#47]: https://github.com/fgnass/spin.js/issues/47
[#41]: https://github.com/fgnass/spin.js/issues/41
[#36]: https://github.com/fgnass/spin.js/issues/36
[#35]: https://github.com/fgnass/spin.js/issues/35
[#31]: https://github.com/fgnass/spin.js/issues/31
[#30]: https://github.com/fgnass/spin.js/issues/30
[#28]: https://github.com/fgnass/spin.js/issues/28
[#27]: https://github.com/fgnass/spin.js/issues/27
[#23]: https://github.com/fgnass/spin.js/issues/23
[#14]: https://github.com/fgnass/spin.js/issues/14
[#12]: https://github.com/fgnass/spin.js/issues/12
