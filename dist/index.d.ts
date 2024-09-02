/**
 * Snapgrab is a customizable scroll snapping component for web applications.
 */
export default class Snapgrab {
    /**
     * Creates an instance of Snapgrab.
     * @param {HTMLElement} element - The DOM element to attach the Snapgrab component to.
     * @param {Object} [options={}] - Optional settings for the Snapgrab component.
     */
    constructor(element: HTMLElement, options?: any);
    element: HTMLElement;
    wrapper: HTMLElement;
    dots: HTMLElement;
    prev: HTMLElement;
    next: HTMLElement;
    isDragging: boolean;
    isScrolling: boolean;
    startX: number;
    scrollLeft: number;
    startY: number;
    isVerticalScroll: boolean;
    options: any;
    state: {
        isDragging: boolean;
        startX: number;
        scrollLeft: number;
        currentSlide: number;
    };
    /**
     * Binds all necessary event listeners.
     */
    bindEvents(): void;
    onMouseDown: (e: any) => any;
    onMouseMove: (e: any) => any;
    onMouseUp: (e: any) => any;
    onMouseLeave: () => any;
    onScroll: Function;
    onTouchMove: (e: any) => void;
    /**
     * Debounce a function call.
     * @param {Function} func - The function to debounce.
     * @param {number} wait - The debounce delay in milliseconds.
     * @returns {Function} The debounced function.
     */
    debounce(func: Function, wait: number): Function;
    /**
     * Initializes the Snapgrab component.
     */
    init(): void;
    /**
     * Destroy the Snapgrab instance, removing all event listeners.
     */
    destroy(): void;
}
