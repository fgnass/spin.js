export interface SpinnerOptions {
    /**
     * The number of lines to draw
     */
    lines?: number;

    /**
     * The length of each line
     */
    length?: number;

    /**
     * The line thickness
     */
    width?: number;

    /**
     * The radius of the inner circle
     */
    radius?: number;

    /**
     * Scales overall size of the spinner
     */
    scale?: number;

    /**
     * Corner roundness (0..1)
     */
    corners?: number;

    /**
     * A CSS color string, or array of strings to set the line color
     */
    color?: string | string[];

    /**
     * A CSS color string, or array of strings to set the color that lines will fade to.
     * Defaults to transparent.
     */
    fadeColor?: string | string[];

    /**
     * The minimum opacity the line color will fade to (0..1)
     */
    opacity?: number;

    /**
     * The rotation offset
     */
    rotate?: number;

    /**
     * 1: clockwise, -1: counterclockwise
     */
    direction?: number;

    /**
     * Rounds per second
     */
    speed?: number;

    /**
     * Afterglow percentage (0..100)
     */
    trail?: number;

    /**
     * Frames per second when using setTimeout() as a fallback in IE 9
     */
    fps?: number;

    /**
     * The z-index (defaults to 2000000000)
     */
    zIndex?: number;

    /**
     * The CSS class to assign to the spinner
     */
    className?: string;

    /**
     * Top position relative to parent (defaults to 50%)
     */
    top?: string;

    /**
     * Left position relative to parent (defaults to 50%)
     */
    left?: string;

    /**
     * Whether to render the default shadow (boolean).
     * A string can be used to set a custom box-shadow value.
     */
    shadow?: boolean | string;

    /**
     * Element positioning
     */
    position?: string;
}
