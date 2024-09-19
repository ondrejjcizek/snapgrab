import { onMouseDown, onMouseLeave, onMouseMove, onMouseUp, onTouchMove } from './utils/mouseHandlers'
import { runTimeout } from './utils/runTimeout'

/**
 * Class representing a Snapgrab slider component.
 */
export class Snapgrab {
	/**
     * Creates a new Snapgrab slider instance.
     * @param {HTMLElement} element - The DOM element to attach the slider to.
     * @param {Object} [options={}] - Configuration options for the slider.
     * @param {number} [options.autoplay] - Interval in milliseconds for autoplay. If not provided, autoplay is disabled.
	 * @param {boolean} [options.autoplayStopOnInteraction] - Whether to stop autoplay on any user interaction.
     * @param {function} [options.onSlideChange] - Callback function to be called when the slide changes.
     */
	constructor(element, options = {}) {
		this.element = element
		this.wrapper = this.element.querySelector('[data-ref="wrapper"]')
		this.dots = this.element.querySelector('[data-ref="dots"]')
		this.prev = this.element.querySelector('[data-ref="prev"]')
		this.next = this.element.querySelector('[data-ref="next"]')

		this.isDragging = false
		this.isScrolling = false
		this.startX = 0
		this.scrollLeft = 0
		this.startY = 0
		this.isVerticalScroll = false

		 // Set default options
		 this.options = {
			autoheight: false, // Default to false
			...options // Overwrite with user-provided options
		}
		
		this.hasUserInteracted = false // Flag to track user interactions

		this.state = {
			isDragging: this.isDragging,
			startX: this.startX,
			scrollLeft: this.scrollLeft,
			currentSlide: 0,
			visibleSlides: undefined
		}

		this.autoplay = null

		this.bindEvents()
	}

	/**
	 * Binds event handlers to the necessary DOM elements.
	 */
	bindEvents() {
		const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

		this.onMouseDown = (e) => {
			this.handleMouseDown(e)
			this.stopAutoplayIfNeeded() // Stop autoplay on interaction
		}
		this.onMouseMove = (e) => this.handleMouseMove(e)
		this.onMouseUp = (e) => {
			this.handleMouseUp(e)
			this.stopAutoplayIfNeeded() // Stop autoplay on interaction
		}
		this.onMouseLeave = () => {
			this.handleMouseLeave()
			this.stopAutoplayIfNeeded() // Stop autoplay on interaction
		}
		this.onScroll = this.debounce(() => this.detectCurrentSlide(), 100)

		// Attach mouse events for non-touch devices
		this.wrapper.addEventListener('mousedown', this.onMouseDown)
		this.wrapper.addEventListener('mousemove', this.onMouseMove)
		this.wrapper.addEventListener('mouseup', this.onMouseUp)
		this.wrapper.addEventListener('mouseleave', this.onMouseLeave)
		this.wrapper.addEventListener('scroll', this.onScroll)

		// Attach touch events for all devices
		this.wrapper.addEventListener('touchstart', (e) => {
			this.onTouchStart(e)
			this.stopAutoplayIfNeeded() // Stop autoplay on interaction
		}, { passive: true })
		this.wrapper.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: true })
		this.wrapper.addEventListener('touchend', (e) => {
			this.onTouchEnd(e)
			this.stopAutoplayIfNeeded() // Stop autoplay on interaction
		})

		if (this.prev) {
			this.prev.addEventListener('click', () => {
				this.handlePrevClick()
				this.stopAutoplayIfNeeded() // Stop autoplay on interaction
			})
		}

		if (this.next) {
			this.next.addEventListener('click', () => {
				this.handleNextClick()
				this.stopAutoplayIfNeeded() // Stop autoplay on interaction
			})
		}

		this.wrapper.addEventListener('slideChange', () => {
			this.handleHeight()
		})

		window.addEventListener('resize', () => this.handleHeight())
	}

	/**
     * Initializes the slider component.
     */
	init() {
		this.preventImageDragging()
		this.updateButtonState()
		if (this.options.autoheight) {
			this.handleHeight() // Ensure height is adjusted if enabled
		}
		this.createDots()
		this.detectCurrentSlide()

		if (this.options.autoheight) {
			this.handleHeight() // Ensure height is adjusted if enabled
		}

		const slideCount = this.wrapper.children.length
		if (slideCount > 1) {
			this.wrapper.style.cursor = 'grab'
		} else {
			if (this.dots) this.dots.style.display = 'none'
			if (this.prev) this.prev.style.display = 'none'
			if (this.next) this.next.style.display = 'none'
		}

		this.element.classList.add('is-loaded')

		this.startAutoplay()
	}

	/**
	 * Starts the autoplay functionality for the slider.
	 */
	startAutoplay() {
		const autoplayInterval = this.options.autoplay
		if (!autoplayInterval || this.hasUserInteracted) {
			// Only start autoplay if enabled and no user interaction has happened
			return
		}

		const autoplayFunction = () => {
			if (!this.hasUserInteracted) { // Check again before each iteration
				this.handleNextClick()

				// Only adjust height if autoheight is enabled
				if (this.options.autoheight) {
					this.handleHeight()
				}
			}
		}

		this.autoplay = new runTimeout(autoplayFunction, autoplayInterval, true)
	}

	/**
	 * Stops the autoplay.
	 */
	stopAutoplay() {
		if (this.autoplay) {
			this.autoplay.destroy() // Ensure autoplay is completely stopped
			this.autoplay = null
		}
	}

	/**
     * Pauses the autoplay.
     */
	pauseAutoplay() {
		if (this.autoplay) {
			this.autoplay.pause()
		}
	}

	/**
     * Resumes the autoplay.
     */
	resumeAutoplay() {
		if (this.autoplay) {
			this.autoplay.resume()
		}
	}

	/**
	 * Stops the autoplay if necessary.
	 */
	stopAutoplayIfNeeded() {
		if (this.options.autoplayStopOnInteraction && !this.hasUserInteracted) {
			this.hasUserInteracted = true
			this.stopAutoplay() // Stop autoplay on first user interaction
		}
	}

	/**
     * Prevents images inside the slider from being draggable.
     */
	preventImageDragging() {
		const images = this.wrapper.querySelectorAll('img')
		images.forEach((img) => {
			img.setAttribute('draggable', 'false')
			img.addEventListener('load', () => this.handleHeight())
		})
	}

	  /**
     * Handles touch start event.
     * @param {TouchEvent} e - The touch event.
     */
	  onTouchStart(e) {
		this.isDragging = true
		this.startX = e.touches[0].pageX - this.wrapper.offsetLeft
		this.scrollLeft = this.wrapper.scrollLeft
		this.startY = e.touches[0].pageY
		this.isVerticalScroll = false
		this.handleUserInteraction() // Check and handle user interaction
	}

	/**
     * Handles mouse down event.
     * @param {MouseEvent} e - The mouse event.
     */
	handleMouseDown(e) {
		if (this.wrapper.children.length > 1) {
			onMouseDown(e, this, this.state)
			this.isScrolling = false
			this.wrapper.style.cursor = 'grabbing'
			this.handleUserInteraction() // Check and handle user interaction
		}
	}

	/**
     * Handles mouse up event.
     * @param {MouseEvent} e - The mouse event.
     */
	handleMouseUp(e) {
		if (this.wrapper.children.length > 1) {
			onMouseUp(this, this.state)
			if (!this.isScrolling) {
				this.handleSlideChange()
			}
			this.isScrolling = false
			this.wrapper.style.cursor = 'grab'
			if (this.autoplay) {
				this.autoplay.reset()
			}
		}
	}

	/**
     * Handles mouse leave event.
     */
	handleMouseLeave() {
		if (this.wrapper.children.length > 1) {
			onMouseLeave(this, this.state)
			this.wrapper.style.cursor = 'grab'
		}
	}

	/**
     * Handles mouse move event.
     * @param {MouseEvent} e - The mouse event.
     */
	handleMouseMove(e) {
		onMouseMove(e, this, this.state)
		this.isScrolling = true
	}

	/**
     * Detects the current slide based on the scroll position.
     */
	detectCurrentSlide() {
		const slideWidth = this.wrapper.children[0].offsetWidth
		const visibleSlides = Math.floor(this.wrapper.offsetWidth / slideWidth)
		const newSlideStart = Math.round(this.wrapper.scrollLeft / slideWidth)
		const newSlideEnd = newSlideStart + visibleSlides - 1

		if (newSlideStart !== this.state.currentSlide) {
			this.state.currentSlide = newSlideStart
			this.state.visibleSlides = visibleSlides
			this.updateAriaHidden()
			this.updateButtonState()
			this.updateActiveDot(newSlideStart, newSlideEnd)
			this.triggerSlideChangeEvent(newSlideStart)
		} else {
			this.updateButtonState()
		}
	}

	/**
     * Handles the slide change event.
     */
	handleSlideChange() {
		const newSlide = Math.round(this.wrapper.scrollLeft / this.wrapper.offsetWidth)
		if (newSlide !== this.state.currentSlide) {
			this.state.currentSlide = newSlide
			this.updateAriaHidden()
			this.updateButtonState()
			this.triggerSlideChangeEvent(newSlide) // Ensure this is firing the event
		}
		this.handleHeight() // Call handleHeight to adjust the height after a slide change
	}

	/**
     * Updates the `aria-hidden` attribute for accessibility.
     */
	updateAriaHidden() {
		const slides = Array.from(this.wrapper.children)
		const slideWidth = slides[0].offsetWidth
		const visibleSlides = Math.floor(this.wrapper.offsetWidth / slideWidth)
		const currentSlideIndex = this.state.currentSlide

		slides.forEach((slide, index) => {
			if (index >= currentSlideIndex && index < currentSlideIndex + visibleSlides) {
				slide.setAttribute('aria-hidden', 'false')
				slide.setAttribute('aria-current', 'true')
			} else {
				slide.setAttribute('aria-hidden', 'true')
				slide.removeAttribute('aria-current')
			}
		})
	}

	/**
     * Triggers a custom event when the slide changes.
     * @param {number} slideIndex - The index of the current slide.
     */
	triggerSlideChangeEvent(slideIndex) {
		const event = new CustomEvent('slideChange', { detail: { slideIndex } })
		this.wrapper.dispatchEvent(event) // Dispatch the event to notify other parts of the code
    
		// Ensure the callback is also called if provided
		if (this.options.onSlideChange) {
			this.options.onSlideChange(slideIndex)
		}
	}
    
	/**
	 * Handles the slider height dynamically, recalculating the height based on the current visible slides.
	 */
	handleHeight() {
		// Early return if autoheight is disabled
		if (!this.options.autoheight) return
	
		const slides = Array.from(this.wrapper.children)
		if (!slides.length) return
	
		let maxHeight = 0
	
		// Ensure all slides are temporarily visible to calculate their heights correctly
		slides.forEach((slide) => {
			slide.style.display = '' // Reset any display property that might hide the slide
		})
	
		slides.forEach((slide) => {
			const slideStyle = window.getComputedStyle(slide)
			const isHidden = slide.getAttribute('aria-hidden') === 'true' // Check if the slide is hidden
	
			if (!isHidden) { // Only consider slides that are not hidden
				let slideHeight = this.calculateSlideHeight(slide) // Use the new function
	
				// Ensure minimum height is respected
				const minHeight = parseFloat(slideStyle.minHeight) || 0
				slideHeight = Math.max(slideHeight, minHeight)
	
				maxHeight = Math.max(maxHeight, slideHeight)
			}
		})
	
		// Update the wrapper height
		if (maxHeight > 0) {
			this.wrapper.style.height = `${maxHeight}px`
		} else {
			console.warn('Max height calculation failed; check your slide content and layout styles.')
		}
	}
	
	// Helper function to calculate slide height
	calculateSlideHeight(slide) {
		const slideStyle = window.getComputedStyle(slide)
		const paddingTop = parseFloat(slideStyle.paddingTop) || 0
		const paddingBottom = parseFloat(slideStyle.paddingBottom) || 0
		let slideHeight = 0
	
		if (slideStyle.display.includes('grid')) {
			// Calculate height for grid layout
			const columns = slideStyle.gridTemplateColumns.split(' ').length
			const columnHeights = Array(columns).fill(0)
	
			Array.from(slide.children).forEach((child, index) => {
				const childHeight = child.getBoundingClientRect().height
				columnHeights[index % columns] += childHeight
			})
	
			slideHeight = Math.max(...columnHeights)
		} else {
			// Calculate height for non-grid layout (e.g., flex or block)
			slideHeight = Array.from(slide.children).reduce((acc, child) => {
				const childHeight = child.getBoundingClientRect().height
				const style = window.getComputedStyle(child)
				const marginTop = parseFloat(style.marginTop) || 0
				const marginBottom = parseFloat(style.marginBottom) || 0
				return acc + childHeight + marginTop + marginBottom
			}, 0)
	
			slideHeight += paddingTop + paddingBottom
	
			if (slideStyle.display.includes('flex')) {
				const gap = parseFloat(slideStyle.rowGap) || 0
				slideHeight += gap * (slide.children.length - 1)
			}
		}
	
		return slideHeight
	}

	/**
     * Handles the click event for the previous button.
     */
	handlePrevClick() {
		this.handleUserInteraction()
		this.scrollSlides(-1)
		this.handleHeight()
	}

	/**
     * Handles the click event for the next button.
     */
	
	handleNextClick() {
		const totalSlides = this.wrapper.children.length
		const slideWidth = this.wrapper.children[0].offsetWidth || 0
		const visibleSlides = Math.floor(this.wrapper.offsetWidth / slideWidth)
		const maxScrollLeft = (totalSlides - visibleSlides) * slideWidth

		if (this.wrapper.scrollLeft >= maxScrollLeft) {
			this.goToSlide(0)
			this.updateActiveDot(0, visibleSlides - 1)
		} else {
			this.scrollSlides(1)
		}

		this.updateButtonState()
		this.handleHeight()
	}

	/**
	 * Handles user interaction and stops autoplay if necessary.
	 */
	handleUserInteraction() {
		if (this.options.autoplayStopOnInteraction && !this.hasUserInteracted) {
			this.hasUserInteracted = true
			this.stopAutoplay() // Stop autoplay on first user interaction
		}
	}

	/**
     * Scrolls the slides in the specified direction.
     * @param {number} direction - The direction to scroll, -1 for left, 1 for right.
     */
	scrollSlides(direction) {
		const slideWidth = this.wrapper.children[0]?.offsetWidth || 0
		const newScrollLeft = this.wrapper.scrollLeft + direction * slideWidth
    
		this.wrapper.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
		this.detectCurrentSlide()
		this.handleHeight() // Adjust the height after scrolling
	}

	/**
     * Debounces a function call.
     * @param {function} func - The function to debounce.
     * @param {number} wait - The delay in milliseconds.
     * @returns {function} The debounced function.
     */
	debounce(func, wait) {
		let timeout
		return (...args) => {
			clearTimeout(timeout)
			timeout = setTimeout(() => func.apply(this, args), wait)
		}
	}

	/**
     * Updates the state of navigation buttons.
     */
	updateButtonState() {
		const slideWidth = this.wrapper.children[0]?.offsetWidth || 0
		const visibleSlides = Math.floor(this.wrapper.offsetWidth / slideWidth)
		const totalSlides = this.wrapper.children.length
		const maxScrollLeft = this.wrapper.scrollWidth - this.wrapper.clientWidth
	
		if (this.prev) {
			const prevDisabled = this.wrapper.scrollLeft <= 0
			this.prev.toggleAttribute('disabled', prevDisabled)
		}
	
		if (this.next) {
			const nextDisabled = this.wrapper.scrollLeft >= maxScrollLeft
			this.next.toggleAttribute('disabled', nextDisabled)
		}
	}

	/**
     * Creates navigation dots for the slider.
     */
	createDots() {
		if (!this.dots) return

		const slideCount = this.wrapper.children.length
		this.dots.innerHTML = ''

		for (let i = 0; i < slideCount; i++) {
			const dot = document.createElement('button')
			dot.className = 'dot'
			dot.addEventListener('click', () => this.goToSlide(i))
			this.dots.appendChild(dot)
		}

		const slideWidth = this.wrapper.children[0]?.offsetWidth || 0
		const gap = parseFloat(window.getComputedStyle(this.wrapper).gap) || 0
		const visibleSlides = Math.floor(this.wrapper.offsetWidth / (slideWidth + gap))
		this.state.visibleSlides = visibleSlides

		this.updateActiveDot(0, visibleSlides - 1)
	}

	/**
     * Updates the active state of navigation dots.
     * @param {number} startIndex - The starting index of the visible slides.
     * @param {number} endIndex - The ending index of the visible slides.
     */
	updateActiveDot(startIndex, endIndex) {
		if (!this.dots) return

		const dots = this.dots.querySelectorAll('button')
		const totalDots = dots.length
		const visibleSlides = this.state.visibleSlides

		dots.forEach((dot, index) => {
			let isActive = index >= startIndex && index <= endIndex

			if (endIndex >= totalDots - 1) {
				isActive = index >= totalDots - visibleSlides
			}

			dot.classList.toggle('is-active', isActive)
		})
	}

	/**
     * Navigates to a specific slide.
     * @param {number} slideIndex - The index of the slide to navigate to.
     */
	goToSlide(slideIndex) {
		const newScrollLeft = slideIndex * this.wrapper.offsetWidth
		this.wrapper.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
		this.detectCurrentSlide()

		const slideWidth = this.wrapper.children[0].offsetWidth
		this.wrapper.scrollLeft = slideWidth * slideIndex
		this.state.currentSlide = slideIndex
		this.updateButtonState()
		this.triggerSlideChangeEvent(slideIndex)
    
		this.handleHeight() // Adjust height after going to a specific slide
	}

	/**
     * Destroys the slider and removes event listeners.
     */
	destroy() {
		// Remove mouse event listeners
		this.wrapper.removeEventListener('mousedown', this.onMouseDown) // Correct reference
		this.wrapper.removeEventListener('mousemove', this.onMouseMove) // Correct reference
		this.wrapper.removeEventListener('mouseup', this.onMouseUp)     // Correct reference
		this.wrapper.removeEventListener('mouseleave', this.onMouseLeave) // Correct reference
		this.wrapper.removeEventListener('scroll', this.onScroll)        // Correct reference for debounced scroll handler
	
		// Remove touch event listeners
		this.wrapper.removeEventListener('touchstart', this.onTouchStart) // Correct reference
		this.wrapper.removeEventListener('touchmove', this.onTouchMove)   // Correct reference
		this.wrapper.removeEventListener('touchend', this.onTouchEnd)     // Correct reference
	
		// Remove event listeners for navigation buttons
		if (this.prev) {
			this.prev.removeEventListener('click', this.handlePrevClick) // Correct reference
		}
		if (this.next) {
			this.next.removeEventListener('click', this.handleNextClick) // Correct reference
		}
	
		// Remove window resize listener
		window.removeEventListener('resize', this.handleHeight) // Correct reference
	
		// Stop autoplay if it exists and clean it up
		if (this.autoplay) {
			this.autoplay.destroy() // Ensure autoplay is stopped
			this.autoplay = null // Set it to null to avoid memory leaks
		}
	
		// Reset any DOM styles that were changed
		this.wrapper.style.cursor = '' // Reset the 'grabbing' cursor or any other styles
	
		// Remove any dynamically added classes
		this.element.classList.remove('is-loaded')
	
		// Clean up dots navigation if it exists
		if (this.dots) {
			this.dots.innerHTML = '' // Remove dots from DOM
		}
	
		// Dispatch a custom event to signal that the slider is destroyed
		this.wrapper.dispatchEvent(new CustomEvent('destroy'))
	
		// Nullify all important references to avoid memory leaks
		this.element = null
		this.wrapper = null
		this.dots = null
		this.prev = null
		this.next = null
		this.isDragging = false
		this.isScrolling = false
		this.startX = 0
		this.scrollLeft = 0
		this.startY = 0
		this.isVerticalScroll = false
	}	
}