declare module 'snapgrab' {
    export interface SnapgrabOptions {
        onSlideChange?: (slideIndex: number) => void
    }

    export interface SnapgrabState {
        isDragging: boolean
        startX: number
        scrollLeft: number
        currentSlide: number
        visibleSlides?: number
    }

    export class Snapgrab {
        element: HTMLElement
        wrapper: HTMLElement
        dots: HTMLElement | null
        prev: HTMLElement | null
        next: HTMLElement | null
        isDragging: boolean
        isScrolling: boolean
        startX: number
        scrollLeft: number
        startY: number
        isVerticalScroll: boolean
        options: SnapgrabOptions
        state: SnapgrabState

        constructor(element: HTMLElement, options?: SnapgrabOptions)

        bindEvents(): void
        init(): void
        preventImageDragging(): void
        onTouchStart(e: TouchEvent): void
        handleMouseDown(e: MouseEvent): void
        handleMouseUp(e: MouseEvent): void
        handleMouseLeave(): void
        handleMouseMove(e: MouseEvent): void
        detectCurrentSlide(): void
        handleSlideChange(): void
        updateAriaHidden(): void
        triggerSlideChangeEvent(slideIndex: number): void
        handleHeight(): void
        handlePrevClick(): void
        handleNextClick(): void
        scrollSlides(direction: number): void
        debounce(func: Function, wait: number): () => void
        updateButtonState(): void
        createDots(): void
        updateActiveDot(startIndex: number, endIndex: number): void
        goToSlide(index: number): void
        destroy(): void
    }
}
