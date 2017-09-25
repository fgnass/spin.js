import {Spinner} from "../spin.js";

var inputs = document.querySelectorAll('input[min], select');
var cbInputs = document.querySelectorAll('input[type="checkbox"]');
var spinnerEl = document.getElementById('preview');
var spinner;

for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('change', update);
}

for (var i = 0; i < cbInputs.length; i++) {
    cbInputs[i].addEventListener('click', update);
}

update();

function update () {
    var opts = {color: '#fff'};

    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        opts[input.name] = parseFloat(input.value);
    }

    for (var i = 0; i < cbInputs.length; i++) {
        var input = cbInputs[i];
        opts[input.name] = input.checked;
    }

    if (spinner) {
        spinner.stop();
    }

    spinner = new Spinner(opts).spin(spinnerEl);
}
