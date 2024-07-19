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
        shadow: '0 0 1px transparent', // prevent aliased lines
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
            this.el.style.position = this.opts.position;
            this.el.style.width = "0";
            this.el.style.zIndex = this.opts.zIndex.toString();
            this.el.style.left = this.opts.left;
            this.el.style.top = this.opts.top;
            this.el.style.transform = "scale(".concat(this.opts.scale, ")");
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
            var backgroundLine = document.createElement('div');
            backgroundLine.style.position = 'absolute';
            backgroundLine.style.top = "".concat(-opts.width / 2, "px");
            backgroundLine.style.width = (opts.length + opts.width) + 'px';
            backgroundLine.style.height = opts.width + 'px';
            backgroundLine.style.background = getColor(opts.fadeColor, i);
            backgroundLine.style.borderRadius = borderRadius;
            backgroundLine.style.transformOrigin = 'left';
            backgroundLine.style.transform = "rotate(".concat(degrees, "deg) translateX(").concat(opts.radius, "px)");
            var delay = i * opts.direction / opts.lines / opts.speed;
            delay -= 1 / opts.speed; // so initial animation state will include trail
            var line = document.createElement('div');
            line.style.width = '100%';
            line.style.height = '100%';
            line.style.background = getColor(opts.color, i);
            line.style.borderRadius = borderRadius;
            line.style.boxShadow = normalizeShadow(shadows, degrees);
            line.style.animation = "".concat(1 / opts.speed, "s linear ").concat(delay, "s infinite ").concat(opts.animation);
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
                prefix: matches[1] || '', // could have value of 'inset' or undefined
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

        let codeEl = document.getElementById('spinner-options');
        codeEl.textContent = getOptionsCode(opts);
        Prism.highlightElement(codeEl);
    }

    function getOptionsCode(options) {
        var optDescriptions = {
            lines: 'The number of lines to draw',
            length: 'The length of each line',
            width: 'The line thickness',
            radius: 'The radius of the inner circle',
            scale: 'Scales overall size of the spinner',
            corners: 'Corner roundness (0..1)',
            color: 'CSS color or array of colors',
            fadeColor: 'CSS color or array of colors',
            speed: 'Rounds per second',
            rotate: 'The rotation offset',
            animation: 'The CSS animation name for the lines',
            direction: '1: clockwise, -1: counterclockwise',
            zIndex: 'The z-index (defaults to 2e9)',
            className: 'The CSS class to assign to the spinner',
            top: 'Top position relative to parent',
            left: 'Left position relative to parent',
            shadow: 'Box-shadow for the lines',
            position: 'Element positioning',
        };

        let code = "import {Spinner} from 'spin.js';\n\n";
        code += "var opts = {\n";

        for (let opt in options) {
            let value = options[opt];

            if (typeof value === 'string') {
                value = "'" + value + "'";
            }

            code += "  " + opt + ": " + value + ", // " + optDescriptions[opt] + "\n";
        }

        code += "};\n\n";

        code += "var target = document.getElementById('foo');\n";
        code += "var spinner = new Spinner(opts).spin(target);";

        return code;
    }

    function getOptionsFromInputs() {
        var opts = {};

        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            var val = input.value;

            if (input.classList.contains('percent')) {
                val += '%';
            } else if (!input.classList.contains('string')) {
                val = parseFloat(val);
            }

            opts[input.name] = val;
        }

        // set all options so they can be shown in code example
        opts['zIndex'] = 2e9;
        opts['className'] = 'spinner';
        opts['position'] = 'absolute';

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

})();
