import { Spinner } from "../spin.js";

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
            value = `'${value}'`;
        }

        code += `  ${opt}: ${value}, // ${optDescriptions[opt]}\n`;
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
