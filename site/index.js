import { Spinner } from "../spin.js";

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
