# spin.js [![JS.ORG](https://img.shields.io/badge/js.org-spin-ffb400.svg?style=flat-square)](http://js.org)

An animated CSS3 loading spinner with VML fallback for IE.

 * No images, no external CSS
 * No dependencies
 * Highly configurable
 * Resolution independent
 * Uses VML as fallback in old IEs
 * Uses @keyframe animations, falling back to setTimeout()
 * Works in all major browsers, including IE6
 * Small footprint (~1.9K gzipped)
 * MIT License

## Usage

```javascript
new Spinner({color:'#fff', lines: 12}).spin(target);
```

For an interactive demo and a list of all supported options please refer to the [project's homepage](http://spin.js.org).
