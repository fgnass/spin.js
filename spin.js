//fgnass.github.com/spin.js
(function(window, document, undefined) {

/**
 * Copyright (c) 2011 Felix Gnass [fgnass at neteye dot de]
 * Licensed under the MIT license
 *
 * Unfortunately uglify.js doesn't provide an option to de-duplicate strings
 * or to use string-based property access. Hence we have to manually define
 * some string constants in order to keep file-size below our 3K limit, as
 * one of the design goals was to create a script that is smaller than an
 * animated GIF.
 */

  var width = 'width',
      length = 'length',
      radius = 'radius',
      lines = 'lines',
      trail = 'trail',
      color = 'color',
      opacity = 'opacity',
      speed = 'speed',
      shadow = 'shadow',
      style = 'style',
      height = 'height',
      left = 'left',
      top = 'top',
      px = 'px',
      childNodes = 'childNodes',
      firstChild = 'firstChild',
      parentNode = 'parentNode',
      position = 'position',
      relative = 'relative',
      absolute = 'absolute',
      animation = 'animation',
      transform = 'transform',
      Origin = 'Origin',
      Timeout = 'Timeout',
      coord = 'coord',
      black = '#000',
      styleSheets = style + 'Sheets',
      prefixes = "webkit0Moz0ms0O".split(0), /* Vendor prefixes, separated by zeros */
      animations = {}, /* Animation rules keyed by their name */
      useCssAnimations;

  /**
   * 
   */
  function eachPair(args, it) {
    var end = ~~((args[length]-1)/2);
    for (var i = 1; i <= end; i++) {
      it(args[i*2-1], args[i*2]);
    }
  }

  /**
   * Utility function to create elements. If no tag name is given, a DIV is created.
   */
  function createEl(tag) {
    var el = document.createElement(tag || 'div');
    eachPair(arguments, function(prop, val) {
      el[prop] = val;
    });
    return el;
  }

  function ins(parent, child1, child2) {
    if(child2 && !child2[parentNode]) ins(parent, child2);
    parent.insertBefore(child1, child2||null);
    return parent;
  }

  /**
   * Insert a new stylesheet to hold the @keyframe or VML rules.
   */
  ins(document.getElementsByTagName('head')[0], createEl(style));
  var sheet = document[styleSheets][document[styleSheets][length] - 1];

  /**
   * Creates an opacity keyframe animation rule.
   */
  function addAnimation(to, end) {
    var name = [opacity, end, ~~(to*100)].join('-'),
        dest = '{' + opacity + ':' + to + '}',
        i;

    if (!animations[name]) {
      for (i=0; i<prefixes[length]; i++) {
        try {
          sheet.insertRule('@' +
            (prefixes[i] && '-'+prefixes[i].toLowerCase() +'-' || '') +
            'keyframes ' + name + '{0%{' + opacity + ':1}' +
            end + '%' + dest + 'to' + dest + '}', sheet.cssRules[length]);
        }
        catch (err) {
        }
      }
      animations[name] = 1;
    }
    return name;
  }

  /**
   * Tries various vendor prefixes and returns the first supported property.
   **/
  function vendor(el, prop) {
    var s = el[style],
        pp,
        i;

    if(s[prop] !== undefined) return prop;
    prop = prop.charAt(0).toUpperCase() + prop.slice(1);
    for(i=0; i<prefixes[length]; i++) {
      pp = prefixes[i]+prop;
      if(s[pp] !== undefined) return pp;
    }
  }

  /**
   * Sets multiple style properties at once.
   */
  function css(el) {
    eachPair(arguments, function(n, val) {
      el[style][vendor(el, n)||n] = val;
    });
    return el;
  }

  /**
   * Fills in default values. The values are passed as argument pairs rather
   * than as object in order to save some extra bytes.
   */
  function defaults(obj) {
    eachPair(arguments, function(prop, val) {
      if (obj[prop] === undefined) obj[prop] = val;
    });
    return obj;
  }

  /** The constructor */
  var Spinner = function Spinner(o) {
    this.opts = defaults(o || {},
      lines, 12,
      trail, 100,
      length, 7,
      width, 5,
      radius, 10,
      color, black,
      opacity, 1/4,
      speed, 1);
  },
  proto = Spinner.prototype = {
    spin: function(target) {
      var self = this,
          el = self.el = self[lines](self.opts);

      if (target) {
        ins(target, css(el,
          left, ~~(target.offsetWidth/2) + px,
          top, ~~(target.offsetHeight/2) + px
        ), target[firstChild]);
      }
      if (!useCssAnimations) {
        // No CSS animation support, use setTimeout() instead
        var o = self.opts,
            i = 0,
            f = 20/o[speed],
            ostep = (1-o[opacity])/(f*o[trail] / 100),
            astep = f/o[lines];

        (function anim() {
          i++;
          for (var s=o[lines]; s; s--) {
            var alpha = Math.max(1-(i+s*astep)%f * ostep, o[opacity]);
            self[opacity](el, o[lines]-s, alpha, o);
          }
          self[Timeout] = self.el && window['set'+Timeout](anim, 50);
        })();
      }
      return self;
    },
    stop: function() {
      var self = this,
          el = self.el;

      window['clear'+Timeout](self[Timeout]);
      if (el && el[parentNode]) el[parentNode].removeChild(el);
      self.el = undefined;
      return self;
    }
  };
  proto[lines] = function(o) {
    var el = css(createEl(), position, relative),
        animationName = addAnimation(o[opacity], o[trail]),
        i = 0,
        seg;

    function fill(color, shadow) {
      return css(createEl(),
        position, absolute,
        width, (o[length]+o[width]) + px, 
        height, o[width] + px,
        'background', color,
        'boxShadow', shadow,
        transform + Origin, left,
        transform, 'rotate(' + ~~(360/o[lines]*i) + 'deg) translate(' + o[radius]+px +',0)',
        'borderRadius', '100em'
      );
    }
    for (; i < o[lines]; i++) {
      seg = css(createEl(),
        position, absolute, 
        top, 1+~(o[width]/2) + px,
        transform, 'translate3d(0,0,0)',
        animation, animationName + ' ' + 1/o[speed] + 's linear infinite ' + (1/o[lines]/o[speed]*i - 1/o[speed]) + 's'
      );
      if (o[shadow]) ins(seg, css(fill(black, '0 0 4px ' + black), top, 2+px));
      ins(el, ins(seg, fill(o[color], '0 0 1px rgba(0,0,0,.1)')));
    }
    return el;
  };
  proto[opacity] = function(el, i, val) {
    el[childNodes][i][style][opacity] = val;
  };

  ///////////////////////////////////////////////////////////////////////////////
  // VML rendering for IE
  ///////////////////////////////////////////////////////////////////////////////

  var behavior = 'behavior',
      URL_VML = 'url(#default#VML)',
      tag = 'group0roundrect0fill0stroke'.split(0);

  /** 
   * Check and init VML support
   */
  (function() {
    var s = css(createEl(tag[0]), behavior, URL_VML),
        i;

    if (!vendor(s, transform) && s.adj) {
      // VML support detected. Insert CSS rules for group, shape and stroke.
      for (i=0; i < tag[length]; i++) {
        sheet.addRule(tag[i], behavior + ':' + URL_VML);
      }
      proto[lines] = function() {
        var o = this.opts,
            r = o[length]+o[width],
            s = 2*r;

        function grp() {
          return css(createEl(tag[0], coord+'size', s +' '+s, coord+Origin, -r + ' ' + -r), width, s, height, s);
        }

        var g = grp(),
            margin = ~(o[length]+o[radius]+o[width])+px,
            i;

        function seg(i, dx, filter) {
          ins(g,
            ins(css(grp(), 'rotation', 360 / o[lines] * i + 'deg', left, ~~dx), 
              ins(css(createEl(tag[1], 'arcsize', 1), width, r, height, o[width], left, o[radius], top, -o[width]/2, 'filter', filter),
                createEl(tag[2], color, o[color], opacity, o[opacity]),
                createEl(tag[3], opacity, 0) // transparent stroke to fix color bleeding upon opacity change
              )
            )
          );
        }

        if (o[shadow]) {
          for (i = 1; i <= o[lines]; i++) {
            seg(i, -2, 'progid:DXImage'+transform+'.Microsoft.Blur(pixel'+radius+'=2,make'+shadow+'=1,'+shadow+opacity+'=.3)');
          }
        }
        for (i = 1; i <= o[lines]; i++) {
          seg(i);
        }
        return ins(css(createEl(),
          'margin', margin + ' 0 0 ' + margin,
          position, relative
        ), g);
      };
      proto[opacity] = function(el, i, val, o) {
        o = o[shadow] && o[lines] || 0;
        el[firstChild][childNodes][i+o][firstChild][firstChild][opacity] = val;
      };
    }
    else {
      useCssAnimations = vendor(s, animation);
    }
  })();

  window.Spinner = Spinner;

})(window, document);
