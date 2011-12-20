spin.js
=======

An animated CSS3 loading spinner with VML fallback for IE.

 * No images, no external CSS
 * No dependencies
 * Highly configurable
 * Resolution independent
 * Uses VML as fallback in old IEs
 * Uses @keyframe animations, falling back to setTimeout()
 * Works in all major browsers, including IE6
 * Small footprint (~1.7K gzipped)
 * MIT License

Usage
-----

    new Spinner({color:'#fff', lines: 12}).spin(target);

or use [spinjs-rails](https://github.com/dnagir/spinjs-rails) from Rails.

For an interactive demo and a list of all supported options please refer to the [project's homepage](http://fgnass.github.com/spin.js).
