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
     * #rgb or #rrggbb or array of colors
     */
    color?: string | string[];

    /**
     * Opacity of the lines (0..1)
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
     * Whether to render a shadow
     */
    shadow?: boolean;

    /**
     * Element positioning
     */
    position?: string;
}
