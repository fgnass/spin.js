(function () {
'use strict';

var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var defaults = {
    lines: 12,
    length: 7,
    width: 5,
    radius: 10,
    scale: 1.0,
    corners: 1,
    color: '#000',
    opacity: 0.25,
    rotate: 0,
    direction: 1,
    speed: 1,
    trail: 100,
    fps: 20,
    zIndex: 2e9,
    className: 'spinner',
    top: '50%',
    left: '50%',
    shadow: false,
    position: 'absolute',
};
var Spinner = /** @class */ (function () {
    function Spinner(opts) {
        if (opts === void 0) { opts = {}; }
        this.opts = __assign({}, defaults, opts);
    }
    /**
     * Adds the spinner to the given target element. If this instance is already
     * spinning, it is automatically removed from its previous target by calling
     * stop() internally.
     */
    Spinner.prototype.spin = function (target) {
        var _this = this;
        this.stop();
        this.el = createEl('div', { className: this.opts.className });
        this.el.setAttribute('role', 'progressbar');
        css(this.el, {
            position: this.opts.position,
            width: 0,
            zIndex: this.opts.zIndex,
            left: this.opts.left,
            top: this.opts.top
        });
        if (target) {
            target.insertBefore(this.el, target.firstChild || null);
        }
        var animator;
        var getNow;
        if (typeof requestAnimationFrame !== 'undefined') {
            animator = requestAnimationFrame;
            getNow = function () { return performance.now(); };
        }
        else {
            // fallback for IE 9
            animator = function (callback) { return setTimeout(callback, 1000 / _this.opts.fps); };
            getNow = function () { return Date.now(); };
        }
        var lastFrameTime;
        var state = 0; // state is rotation percentage (between 0 and 1)
        var animate = function () {
            var time = getNow();
            if (lastFrameTime === undefined) {
                lastFrameTime = time - 1;
            }
            state += getAdvancePercentage(time - lastFrameTime, _this.opts.speed);
            lastFrameTime = time;
            if (state > 1) {
                state -= Math.floor(state);
            }
            for (var line = 0; line < _this.opts.lines; line++) {
                if (line < _this.el.childNodes.length) {
                    var opacity = getLineOpacity(line, state, _this.opts);
                    _this.el.childNodes[line].style.opacity = opacity.toString();
                }
            }
            _this.animateId = _this.el ? animator(animate) : undefined;
        };
        drawLines(this.el, this.opts);
        animate();
        return this;
    };
    /**
     * Stops and removes the Spinner.
     * Stopped spinners may be reused by calling spin() again.
     */
    Spinner.prototype.stop = function () {
        if (this.el) {
            if (typeof requestAnimationFrame !== 'undefined') {
                cancelAnimationFrame(this.animateId);
            }
            else {
                clearTimeout(this.animateId);
            }
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
            this.el = undefined;
        }
        return this;
    };
    return Spinner;
}());
function getAdvancePercentage(msSinceLastFrame, roundsPerSecond) {
    return msSinceLastFrame / 1000 * roundsPerSecond;
}
function getLineOpacity(line, state, opts) {
    var linePercent = (line + 1) / opts.lines;
    var diff = state - (linePercent * opts.direction);
    if (diff < 0 || diff > 1) {
        diff += opts.direction;
    }
    // opacity should start at 1, and approach opacity option as diff reaches trail percentage
    var trailPercent = opts.trail / 100;
    var opacityPercent = 1 - diff / trailPercent;
    if (opacityPercent < 0) {
        return opts.opacity;
    }
    var opacityDiff = 1 - opts.opacity;
    return opacityPercent * opacityDiff + opts.opacity;
}
/**
 * Utility function to create elements. Optionally properties can be passed.
 */
function createEl(tag, prop) {
    if (prop === void 0) { prop = {}; }
    var el = document.createElement(tag);
    for (var n in prop) {
        el[n] = prop[n];
    }
    return el;
}
/**
 * Tries various vendor prefixes and returns the first supported property.
 */
function vendor(el, prop) {
    if (el.style[prop] !== undefined) {
        return prop;
    }
    // needed for transform properties in IE 9
    var prefixed = 'ms' + prop.charAt(0).toUpperCase() + prop.slice(1);
    if (el.style[prefixed] !== undefined) {
        return prefixed;
    }
    return '';
}
/**
 * Sets multiple style properties at once.
 */
function css(el, props) {
    for (var prop in props) {
        el.style[vendor(el, prop) || prop] = props[prop];
    }
    return el;
}
/**
 * Returns the line color from the given string or array.
 */
function getColor(color, idx) {
    return typeof color == 'string' ? color : color[idx % color.length];
}
/**
 * Internal method that draws the individual lines.
 */
function drawLines(el, opts) {
    for (var i = 0; i < opts.lines; i++) {
        var seg = css(createEl('div'), {
            position: 'absolute',
            top: 1 + ~(opts.scale * opts.width / 2) + 'px',
            opacity: opts.opacity,
        });
        if (opts.shadow) {
            seg.appendChild(css(fill('#000', '0 0 4px #000', opts, i), { top: '2px' }));
        }
        seg.appendChild(fill(getColor(opts.color, i), '0 0 1px rgba(0,0,0,.1)', opts, i));
        el.appendChild(seg);
    }
    return el;
}
function fill(color, shadow, opts, i) {
    return css(createEl('div'), {
        position: 'absolute',
        width: opts.scale * (opts.length + opts.width) + 'px',
        height: opts.scale * opts.width + 'px',
        background: color,
        boxShadow: shadow,
        transformOrigin: 'left',
        transform: 'rotate(' + ~~(360 / opts.lines * i + opts.rotate) + 'deg) translate(' + opts.scale * opts.radius + 'px' + ',0)',
        borderRadius: (opts.corners * opts.scale * opts.width >> 1) + 'px'
    });
}

var inputs = document.querySelectorAll('#opts input[type="range"], #opts input[type="text"], #opts select');
var cbInputs = document.querySelectorAll('#opts input[type="checkbox"]');
var spinnerEl = document.getElementById('preview');
var shareEl = document.getElementById('share');
var spinner;
var params = {};
var hash = /^#\?(.*)/.exec(location.hash);

if (hash) {
    shareEl.checked = true;

    hash[1].split(/&/).forEach(function (pair) {
        var kv = pair.split(/=/);
        params[kv[0]] = kv[kv.length - 1];
    });
}

for (var i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    var val = params[input.name];

    if (val !== undefined) {
        input.value = val;
    }

    if (input.tagName === 'SELECT' || navigator.userAgent.indexOf('Trident') !== -1) {
        // "input" event doesn't work on range inputs in Internet Explorer
        var event = 'change';
    } else {
        event = 'input';
    }

    input.addEventListener(event, update);
}

for (var i = 0; i < cbInputs.length; i++) {
    var input = cbInputs[i];
    input.checked = !!params[input.name];
    input.addEventListener('click', update);
}

shareEl.addEventListener('click', function () {
    var value = '#!';

    if (shareEl.checked) {
        var opts = getOptionsFromInputs();
        value = '#?' + getParamStringFromOpts(opts);
    }

    window.location.replace(value);
});

update();

function update() {
    var opts = getOptionsFromInputs();

    if (spinner) {
        spinner.stop();
    }
    
    spinner = new Spinner(opts).spin(spinnerEl);

    if (shareEl.checked) {
        window.location.replace('#?' + getParamStringFromOpts(opts));
    }
}

function getOptionsFromInputs() {
    var opts = {};
    
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        var val = input.value;

        if (hasClass(input, 'percent')) {
            val += '%';
        } else if (!hasClass(input, 'string')) {
            val = parseFloat(val);
        }

        opts[input.name] = val;

        // set value in code usage example
        document.getElementById('opt-' + input.name).textContent = val;
    }

    for (var i = 0; i < cbInputs.length; i++) {
        var input = cbInputs[i];
        opts[input.name] = input.checked;
        document.getElementById('opt-' + input.name).textContent = input.checked;
    }

    return opts;
}

function getParamStringFromOpts(opts) {
    var params = [];

    for (var prop in opts) {
        var val = opts[prop];

        if (val !== false) {
            if (typeof val === 'string' && val.slice(-1) === '%') {
                val = val.slice(0, -1);
            }

            params.push(prop + '=' + val);
        }
    }

    return params.join('&');
}

function hasClass(el, className) {
    if (el.classList) {
        return el.classList.contains(className);
    } else {
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }
}

}());
