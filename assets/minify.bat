@echo off

set PATH=C:\MSYS\bin;%PATH%

pushd %~dp0

cat main.css prettify.css fd-slider/fd-slider.css ^
 fd-slider/fd-slider-tooltip.css | cleancss -o style.css

rem cat prettify.js fd-slider/fd-slider.js | uglifyjs -o pack.js
