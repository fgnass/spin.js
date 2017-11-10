import { SpinnerOptions } from './SpinnerOptions';
export { SpinnerOptions } from './SpinnerOptions';

const defaults: SpinnerOptions = {
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

export class Spinner {
    private opts: SpinnerOptions;

    /**
     * The Spinner's HTML element - can be used to manually insert the spinner into the DOM
     */
    public el: HTMLElement | undefined;
    private animateId: number | undefined;

    constructor(opts: SpinnerOptions = {}) {
        this.opts = { ...defaults, ...opts };
    }

    /**
     * Adds the spinner to the given target element. If this instance is already
     * spinning, it is automatically removed from its previous target by calling
     * stop() internally.
     */
    spin(target?: HTMLElement): this {
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

        let animator: (callback: () => void) => number;
        let getNow: () => number;

        if (typeof requestAnimationFrame !== 'undefined') {
            animator = requestAnimationFrame;
            getNow = () => performance.now();
        } else {
            // fallback for IE 9
            animator = callback => setTimeout(callback, 1000 / this.opts.fps);
            getNow = () => Date.now();
        }

        let lastFrameTime: number;
        let state = 0; // state is rotation percentage (between 0 and 1)

        let animate = () => {
            let time = getNow();

            if (lastFrameTime === undefined) {
                lastFrameTime = time - 1;
            }

            state += getAdvancePercentage(time - lastFrameTime, this.opts.speed);
            lastFrameTime = time;

            if (state > 1) {
                state -= Math.floor(state);
            }

            for (let line = 0; line < this.opts.lines; line++) {
                if (line < this.el.childNodes.length) {
                    let opacity = getLineOpacity(line, state, this.opts);
                    (this.el.childNodes[line] as HTMLElement).style.opacity = opacity.toString();
                }
            }

            this.animateId = this.el ? animator(animate) : undefined;
        };

        drawLines(this.el, this.opts);
        animate();

        return this;
    }

    /**
     * Stops and removes the Spinner.
     * Stopped spinners may be reused by calling spin() again.
     */
    stop(): this {
        if (this.el) {
            if (typeof requestAnimationFrame !== 'undefined') {
                cancelAnimationFrame(this.animateId);
            } else {
                clearTimeout(this.animateId);
            }

            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }

            this.el = undefined;
        }

        return this;
    }
}

function getAdvancePercentage(msSinceLastFrame: number, roundsPerSecond: number): number {
    return msSinceLastFrame / 1000 * roundsPerSecond;
}

function getLineOpacity(line: number, state: number, opts: SpinnerOptions): number {
    let linePercent = (line + 1) / opts.lines;
    let diff = state - (linePercent * opts.direction);

    if (diff < 0 || diff > 1) {
        diff += opts.direction;
    }

    // opacity should start at 1, and approach opacity option as diff reaches trail percentage
    let trailPercent = opts.trail / 100;
    let opacityPercent = 1 - diff / trailPercent;

    if (opacityPercent < 0) {
        return opts.opacity;
    }

    let opacityDiff = 1 - opts.opacity;
    return opacityPercent * opacityDiff + opts.opacity;
}

/**
 * Utility function to create elements. Optionally properties can be passed.
 */
function createEl(tag: string, prop = {}): HTMLElement {
    var el = document.createElement(tag);

    for (var n in prop) {
        el[n] = prop[n];
    }

    return el;
}

/**
 * Tries various vendor prefixes and returns the first supported property.
 */
function vendor(el: HTMLElement, prop: string): string {
    if (el.style[prop] !== undefined) {
        return prop;
    }

    // needed for transform properties in IE 9
    let prefixed = 'ms' + prop.charAt(0).toUpperCase() + prop.slice(1);

    if (el.style[prefixed] !== undefined) {
        return prefixed;
    }

    return '';
}

/**
 * Sets multiple style properties at once.
 */
function css(el: HTMLElement, props): HTMLElement {
    for (var prop in props) {
        el.style[vendor(el, prop) || prop] = props[prop];
    }

    return el;
}

/**
 * Returns the line color from the given string or array.
 */
function getColor(color: string | string[], idx): string {
    return typeof color == 'string' ? color : color[idx % color.length];
}

/**
 * Internal method that draws the individual lines.
 */
function drawLines(el: HTMLElement, opts: SpinnerOptions): HTMLElement {
    for (var i = 0; i < opts.lines; i++) {
        let seg = css(createEl('div'), {
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

function fill(color: string, shadow: string, opts: SpinnerOptions, i: number): HTMLElement {
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
