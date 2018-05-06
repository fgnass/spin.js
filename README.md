# spin.js [![JS.ORG](https://img.shields.io/badge/js.org-spin-ffb400.svg?style=flat-square)](http://js.org)

An animated loading spinner

 * No images
 * No dependencies
 * Highly configurable
 * Resolution independent
 * Uses CSS keyframe animations
 * Works in all major browsers
 * Includes TypeScript definitions
 * MIT License

## Usage

```javascript
import {Spinner} from 'spin.js';

var target = document.getElementById('foo');
new Spinner({color:'#fff', lines: 12}).spin(target);
```

For an interactive demo and a list of all supported options please refer to the [project's homepage](https://spin.js.org).
