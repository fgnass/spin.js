(function () {
    'use strict';

    var __assign = (undefined && undefined.__assign) || function () {
        __assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    var defaults = {
        lines: 12,
        length: 7,
        width: 5,
        radius: 10,
        scale: 1.0,
        corners: 1,
        color: '#000',
        fadeColor: 'transparent',
        animation: 'spinner-line-fade-default',
        rotate: 0,
        direction: 1,
        speed: 1,
        zIndex: 2e9,
        className: 'spinner',
        top: '50%',
        left: '50%',
        shadow: '0 0 1px transparent',
        position: 'absolute',
    };
    var Spinner = /** @class */ (function () {
        function Spinner(opts) {
            if (opts === void 0) { opts = {}; }
            this.opts = __assign(__assign({}, defaults), opts);
        }
        /**
         * Adds the spinner to the given target element. If this instance is already
         * spinning, it is automatically removed from its previous target by calling
         * stop() internally.
         */
        Spinner.prototype.spin = function (target) {
            this.stop();
            this.el = document.createElement('div');
            this.el.className = this.opts.className;
            this.el.setAttribute('role', 'progressbar');
            css(this.el, {
                position: this.opts.position,
                width: 0,
                zIndex: this.opts.zIndex,
                left: this.opts.left,
                top: this.opts.top,
                transform: "scale(" + this.opts.scale + ")",
            });
            if (target) {
                target.insertBefore(this.el, target.firstChild || null);
            }
            drawLines(this.el, this.opts);
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
    /**
     * Sets multiple style properties at once.
     */
    function css(el, props) {
        for (var prop in props) {
            el.style[prop] = props[prop];
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
        var borderRadius = (Math.round(opts.corners * opts.width * 500) / 1000) + 'px';
        var shadow = 'none';
        if (opts.shadow === true) {
            shadow = '0 2px 4px #000'; // default shadow
        }
        else if (typeof opts.shadow === 'string') {
            shadow = opts.shadow;
        }
        var shadows = parseBoxShadow(shadow);
        for (var i = 0; i < opts.lines; i++) {
            var degrees = ~~(360 / opts.lines * i + opts.rotate);
            var backgroundLine = css(document.createElement('div'), {
                position: 'absolute',
                top: -opts.width / 2 + "px",
                width: (opts.length + opts.width) + 'px',
                height: opts.width + 'px',
                background: getColor(opts.fadeColor, i),
                borderRadius: borderRadius,
                transformOrigin: 'left',
                transform: "rotate(" + degrees + "deg) translateX(" + opts.radius + "px)",
            });
            var delay = i * opts.direction / opts.lines / opts.speed;
            delay -= 1 / opts.speed; // so initial animation state will include trail
            var line = css(document.createElement('div'), {
                width: '100%',
                height: '100%',
                background: getColor(opts.color, i),
                borderRadius: borderRadius,
                boxShadow: normalizeShadow(shadows, degrees),
                animation: 1 / opts.speed + "s linear " + delay + "s infinite " + opts.animation,
            });
            backgroundLine.appendChild(line);
            el.appendChild(backgroundLine);
        }
    }
    function parseBoxShadow(boxShadow) {
        var regex = /^\s*([a-zA-Z]+\s+)?(-?\d+(\.\d+)?)([a-zA-Z]*)\s+(-?\d+(\.\d+)?)([a-zA-Z]*)(.*)$/;
        var shadows = [];
        for (var _i = 0, _a = boxShadow.split(','); _i < _a.length; _i++) {
            var shadow = _a[_i];
            var matches = shadow.match(regex);
            if (matches === null) {
                continue; // invalid syntax
            }
            var x = +matches[2];
            var y = +matches[5];
            var xUnits = matches[4];
            var yUnits = matches[7];
            if (x === 0 && !xUnits) {
                xUnits = yUnits;
            }
            if (y === 0 && !yUnits) {
                yUnits = xUnits;
            }
            if (xUnits !== yUnits) {
                continue; // units must match to use as coordinates
            }
            shadows.push({
                prefix: matches[1] || '',
                x: x,
                y: y,
                xUnits: xUnits,
                yUnits: yUnits,
                end: matches[8],
            });
        }
        return shadows;
    }
    /**
     * Modify box-shadow x/y offsets to counteract rotation
     */
    function normalizeShadow(shadows, degrees) {
        var normalized = [];
        for (var _i = 0, shadows_1 = shadows; _i < shadows_1.length; _i++) {
            var shadow = shadows_1[_i];
            var xy = convertOffset(shadow.x, shadow.y, degrees);
            normalized.push(shadow.prefix + xy[0] + shadow.xUnits + ' ' + xy[1] + shadow.yUnits + shadow.end);
        }
        return normalized.join(', ');
    }
    function convertOffset(x, y, degrees) {
        var radians = degrees * Math.PI / 180;
        var sin = Math.sin(radians);
        var cos = Math.cos(radians);
        return [
            Math.round((x * cos + y * sin) * 1000) / 1000,
            Math.round((-x * sin + y * cos) * 1000) / 1000,
        ];
    }

    var inputs = document.querySelectorAll('#opts input[type="range"], #opts input[type="color"], #opts input[type="text"], #opts select');
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
            params[kv[0]] = decodeURIComponent(kv[kv.length - 1]);
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

                params.push(prop + '=' + encodeURIComponent(val));
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
