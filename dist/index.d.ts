/**
 * Interface representing the options for the Snapgrab slider.
 */
interface SnapgrabOptions {
    onSlideChange?: (slideIndex: number) => void;
}
/**
 * Interface representing the internal state of the Snapgrab slider.
 */
interface SnapgrabState {
    isDragging: boolean;
    startX: number;
    scrollLeft: number;
    currentSlide: number;
    visibleSlides?: number;
}
/**
 * Class representing a Snapgrab slider component.
 */
export declare class Snapgrab {
    element: HTMLElement;
    wrapper: HTMLElement;
    dots: HTMLElement | null;
    prev: HTMLElement | null;
    next: HTMLElement | null;
    isDragging: boolean;
    isScrolling: boolean;
    startX: number;
    scrollLeft: number;
    startY: number;
    isVerticalScroll: boolean;
    options: SnapgrabOptions;
    state: SnapgrabState;
    onMouseDown: (e: MouseEvent) => void;
    onMouseMove: (e: MouseEvent) => void;
    onMouseUp: (e: MouseEvent) => void;
    onMouseLeave: () => void;
    onScroll: () => void;
    onTouchMove: (e: TouchEvent) => void;
    constructor(element: HTMLElement, options?: SnapgrabOptions);
    bindEvents(): void;
    init(): void;
    preventImageDragging(): void;
    onTouchStart(e: TouchEvent): void;
    handleMouseDown(e: MouseEvent): void;
    handleMouseUp(e: MouseEvent): void;
    handleMouseLeave(): void;
    handleMouseMove(e: MouseEvent): void;
    detectCurrentSlide(): void;
    handleSlideChange(): void;
    updateAriaHidden(): void;
    triggerSlideChangeEvent(slideIndex: number): void;
    handleHeight(): void;
    handlePrevClick(): void;
    handleNextClick(): void;
    scrollSlides(direction: number): void;
    debounce(func: (...args: any[]) => void, wait: number): (...args: any[]) => void;
    updateButtonState(): void;
    createDots(): void;
    updateActiveDot(startIndex: number, endIndex: number): void;
    goToSlide(index: number): void;
    destroy(): void;
}
export {};
