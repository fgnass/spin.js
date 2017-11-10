import { Spinner } from "../spin.js";

new Spinner({ radius: 10, length: 40 }).spin(document.getElementById('target1'));
new Spinner({ radius: 40, length: 10 }).spin(document.getElementById('target2'));
new Spinner({ top: 0, left: 0 }).spin(document.getElementById('target3'));
new Spinner({ radius: 30, length: 0, width: 10, color: '#C40000', trail: 40 }).spin(document.getElementById('target4'));
