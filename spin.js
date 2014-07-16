/**
 * Copyright (c) 2011-2014 Felix Gnass
 * Licensed under the MIT license
 */
(function(root, factory) {

  /* CommonJS */
  if (typeof exports == 'object')  module.exports = factory()

  /* AMD module */
  else if (typeof define == 'function' && define.amd) define(factory)

  /* Browser global */
  else root.Spinner = factory()
}
(this, function() {
  "use strict";

  var prefixes = ['webkit', 'Moz', 'ms', 'O'] /* Vendor prefixes */
    , animations = {} /* Animation rules keyed by their name */

  /**
   * Utility function to create elements. If no tag name is given,
   * a DIV is created. Optionally properties can be passed.
   */
  function createEl(tag, prop, doc) {
    var el = doc.createElement(tag || 'div')
      , n

    if (prop) {
      for(n in prop) el[n] = prop[n]
    }

    return el
  }

  /**
   * Appends children and returns the parent.
   */
  function ins(parent /* child1, child2, ...*/) {
    for (var i=1, n=arguments.length; i<n; i++)
      parent.appendChild(arguments[i])

    return parent
  }

  /**
   * Tries various vendor prefixes and returns the first supported property.
   */
  function vendor(el, prop) {
    var s = el.style
      , pp
      , i

    prop = prop.charAt(0).toUpperCase() + prop.slice(1)
    for(i=0; i<prefixes.length; i++) {
      pp = prefixes[i]+prop
      if(s[pp] !== undefined) return pp
    }
    if(s[prop] !== undefined) return prop
  }

  /**
   * Sets multiple style properties at once.
   */
  function css(el, prop) {
    for (var n in prop)
      el.style[vendor(el, n)||n] = prop[n]

    return el
  }

  /**
   * Fills in default values.
   */
  function merge(obj) {
    for (var i=1; i < arguments.length; i++) {
      var def = arguments[i]
      for (var n in def)
        if (obj[n] === undefined) obj[n] = def[n]
    }
    return obj
  }

  /**
   * Returns the absolute page-offset of the given element.
   */
  function pos(el) {
    var o = { x:el.offsetLeft, y:el.offsetTop }
    while((el = el.offsetParent))
      o.x+=el.offsetLeft, o.y+=el.offsetTop

    return o
  }

  /**
   * Returns the line color from the given string or array.
   */
  function getColor(color, idx) {
    return typeof color == 'string' ? color : color[idx % color.length]
  }

  // Built-in defaults

  var defaults = {
    lines: 12,            // The number of lines to draw
    length: 7,            // The length of each line
    width: 5,             // The line thickness
    radius: 10,           // The radius of the inner circle
    rotate: 0,            // Rotation offset
    corners: 1,           // Roundness (0..1)
    color: '#000',        // #rgb or #rrggbb
    direction: 1,         // 1: clockwise, -1: counterclockwise
    speed: 1,             // Rounds per second
    trail: 100,           // Afterglow percentage
    opacity: 1/4,         // Opacity of the lines
    fps: 20,              // Frames per second when using setTimeout()
    zIndex: 2e9,          // Use a high z-index by default
    className: 'spinner', // CSS class to assign to the element
    top: '50%',           // center vertically
    left: '50%',          // center horizontally
    position: 'absolute', // element position
    document: document    // document to add the css rules to
  }

  /** The constructor */
  function Spinner(o) {
    this.opts = merge(o || {}, Spinner.defaults, defaults)
  }

  // Global defaults that override the built-ins:
  Spinner.defaults = {}

  merge(Spinner.prototype, {

    /**
     * Adds the spinner to the given target element. If this instance is already
     * spinning, it is automatically removed from its previous target b calling
     * stop() internally.
     */
    spin: function(target) {
      this.stop()

      var self = this
        , o = self.opts
        , el = self.el = css(createEl(0, {className: o.className}, o.document), {position: o.position, width: 0, zIndex: o.zIndex})
        , mid = o.radius+o.length+o.width

      /**
       * Track animations per spinner
       */
      self.animations = {}

      /**
       * Insert a new stylesheet to hold the @keyframe or VML rules.
       */
      var styleEl = createEl('style', {type : 'text/css'}, o.document)
      ins(o.document.getElementsByTagName('head')[0], styleEl)
      var sheet = styleEl.sheet || styleEl.styleSheet
      self.styleEl = styleEl

      /**
       * Check for support.
       */
      var probe = css(createEl('group', null, o.document), {behavior: 'url(#default#VML)'}),
          useVml = false,
          useTimeout = false,
          useCssAnimations = false,
          animationsProperty
      if (!vendor(probe, 'transform') && probe.adj) {
        useVml = true
      } else if (!vendor(probe, 'animation')) {
        useTimeout = true
      } else {
        useCssAnimations = true
        animationsProperty = vendor(probe, 'animation')
      }

      /**
       * Creates an opacity keyframe animation rule and returns its name.
       * Since most mobile Webkits have timing issues with animation-delay,
       * we create separate rules for each line/segment.
       */
      function addAnimation(sheet, property, alpha, trail, i, lines) {
        var name = ['opacity', trail, ~~(alpha*100), i, lines].join('-')
          , start = 0.01 + i/lines * 100
          , z = Math.max(1 - (1-alpha) / trail * (100-start), alpha)
          , prefix = property.substring(0, property.indexOf('Animation')).toLowerCase()
          , pre = prefix && '-' + prefix + '-' || ''

        if (!animations[name]) {
          sheet.insertRule(
            '@' + pre + 'keyframes ' + name + '{' +
            '0%{opacity:' + z + '}' +
            start + '%{opacity:' + alpha + '}' +
            (start+0.01) + '%{opacity:1}' +
            (start+trail) % 100 + '%{opacity:' + alpha + '}' +
            '100%{opacity:' + z + '}' +
            '}', sheet.cssRules.length)

          animations[name] = 1
        } else {
          animations[name]++
        }
        self.animations[name] = 1;

        return name
      }

      /**
       * Internal method that adjusts the opacity of a single line.
       * Will be overwritten in VML fallback mode below.
       */
      var setOpacity = function(el, i, val, o) {
        if (i < el.childNodes.length) el.childNodes[i].style.opacity = val
      }

      /**
       * Internal method that draws the individual lines.
       * Will be overwritten in VML fallback mode below.
       */
      var drawLines = (function (sheet) {
        return function (el, o) {
          var i = 0
              , start = (o.lines - 1) * (1 - o.direction) / 2
              , seg

          function fill(color, shadow) {
            return css(createEl(null, null, o.document), {
              position: 'absolute',
              width: (o.length+o.width) + 'px',
              height: o.width + 'px',
              background: color,
              boxShadow: shadow,
              transformOrigin: 'left',
              transform: 'rotate(' + ~~(360/o.lines*i+o.rotate) + 'deg) translate(' + o.radius+'px' +',0)',
              borderRadius: (o.corners * o.width>>1) + 'px'
            })
          }

          for (; i < o.lines; i++) {
            seg = css(createEl(null, null, o.document), {
              position: 'absolute',
              top: 1+~(o.width/2) + 'px',
              transform: o.hwaccel ? 'translate3d(0,0,0)' : '',
              opacity: o.opacity,
              animation: useCssAnimations && addAnimation(sheet, animationsProperty, o.opacity, o.trail, start + i * o.direction, o.lines) + ' ' + 1/o.speed + 's linear infinite'
            })

            if (o.shadow) ins(seg, css(fill('#000', '0 0 4px ' + '#000'), {top: 2+'px'}))
            ins(el, ins(seg, fill(getColor(o.color, i), '0 0 1px rgba(0,0,0,.1)')))
          }
          return el
        }
      }(sheet))

      if (useVml) {
        sheet.addRule('.spin-vml', 'behavior:url(#default#VML)')

        setOpacity = function(el, i, val, o) {
          var c = el.firstChild
          o = o.shadow && o.lines || 0
          if (c && i+o < c.childNodes.length) {
            c = c.childNodes[i+o]; c = c && c.firstChild; c = c && c.firstChild
            if (c) c.opacity = val
          }
        }

        drawLines = function(el, o) {
          var r = o.length+o.width
              , s = 2*r

          /**
           * Utility function to create a VML tag
           */
          function vml(tag, attr) {
            return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr, o.document)
          }

          function grp() {
            return css(
                vml('group', {
                  coordsize: s + ' ' + s,
                  coordorigin: -r + ' ' + -r
                }),
                { width: s, height: s }
            )
          }

          var margin = -(o.width+o.length)*2 + 'px'
              , g = css(grp(), {position: 'absolute', top: margin, left: margin})
              , i

          function seg(i, dx, filter) {
            ins(g,
                ins(css(grp(), {rotation: 360 / o.lines * i + 'deg', left: ~~dx}),
                    ins(css(vml('roundrect', {arcsize: o.corners}), {
                      width: r,
                      height: o.width,
                      left: o.radius,
                      top: -o.width>>1,
                      filter: filter
                    }),
                        vml('fill', {color: getColor(o.color, i), opacity: o.opacity}),
                        vml('stroke', {opacity: 0}) // transparent stroke to fix color bleeding upon opacity change
                    )
                )
            )
          }

          if (o.shadow)
            for (i = 1; i <= o.lines; i++)
              seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)')

          for (i = 1; i <= o.lines; i++) seg(i)
          return ins(el, g)
        }
      }

      css(el, {
        left: o.left,
        top: o.top
      })
        
      if (target) {
        target.insertBefore(el, target.firstChild||null)
      }

      el.setAttribute('role', 'progressbar')
      drawLines(el, o)

      if (useTimeout) {
        var i = 0
          , start = (o.lines - 1) * (1 - o.direction) / 2
          , alpha
          , fps = o.fps
          , f = fps/o.speed
          , ostep = (1-o.opacity) / (f*o.trail / 100)
          , astep = f/o.lines

        ;(function anim() {
          i++;
          for (var j = 0; j < o.lines; j++) {
            alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity)

            setOpacity(el, j * o.direction + start, alpha, o)
          }
          self.timeout = self.el && setTimeout(anim, ~~(1000/fps))
        })()
      }
      return self
    },

    /**
     * Stops and removes the Spinner.
     */
    stop: function() {
      var self = this,
        el = self.el,
        styleEl = self.styleEl
      if (el) {
        clearTimeout(self.timeout)
        for (var name in self.animations) {
          animations[name]--
          if (0 == animations[name]) {
            delete animations[name]
          }
        }
        delete self.animations
        if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl)
        self.styleEl = undefined
        if (el.parentNode) el.parentNode.removeChild(el)
        self.el = undefined
      }
      return this
    }
  })

  return Spinner

}));
