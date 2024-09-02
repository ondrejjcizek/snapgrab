import { onMouseDown, onMouseLeave, onMouseMove, onMouseUp, onTouchMove } from './utils/mouseHandlers'

/**
 * Class representing a Snapgrab slider component.
 */
export class Snapgrab {
	/**
	 * Create a Snapgrab instance.
	 * @param {HTMLElement} element - The main element containing the slider.
	 * @param {Object} [options={}] - Configuration options for the slider.
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

		this.options = options

		this.state = {
			isDragging: this.isDragging,
			startX: this.startX,
			scrollLeft: this.scrollLeft,
			currentSlide: 0,
		}

		this.bindEvents()
	}

	/**
	 * Bind the necessary event handlers to the elements.
	 */
	bindEvents() {
		this.onMouseDown = (e) => this.handleMouseDown(e)
		this.onMouseMove = (e) => this.handleMouseMove(e)
		this.onMouseUp = (e) => this.handleMouseUp(e)
		this.onMouseLeave = () => this.handleMouseLeave()
		this.onScroll = this.debounce(() => this.detectCurrentSlide(), 100)
		this.onTouchMove = (e) => onTouchMove(e, this, this.state)

		this.wrapper.addEventListener('mousedown', this.onMouseDown)
		this.wrapper.addEventListener('mousemove', this.onMouseMove)
		this.wrapper.addEventListener('mouseup', this.onMouseUp)
		this.wrapper.addEventListener('mouseleave', this.onMouseLeave)
		this.wrapper.addEventListener('scroll', this.onScroll)
		this.wrapper.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: true })
		this.wrapper.addEventListener('touchmove', this.onTouchMove, { passive: true })
		this.wrapper.addEventListener('touchend', this.onMouseUp)

		this.prev?.addEventListener('click', () => this.handlePrevClick())
		this.next?.addEventListener('click', () => this.handleNextClick())
		this.wrapper.addEventListener('slideChange', () => this.handleHeight())
		window.addEventListener('resize', this.handleHeight.bind(this))
	}

	/**
	 * Initialize the Snapgrab component.
	 */
	init() {
		this.preventImageDragging()
		this.updateButtonState()
		this.handleHeight()
		this.createDots()
		this.detectCurrentSlide()

		const slideCount = this.wrapper.children.length
		if (slideCount > 1) {
			this.wrapper.style.cursor = 'grab'
		} else {
			if (this.dots) {
				this.dots.style.display = 'none'
			}
			if (this.prev) {
				this.prev.style.display = 'none'
			}
			if (this.next) {
				this.next.style.display = 'none'
			}
		}

		this.element.classList.add('loaded')
	}

	/**
	 * Prevent images within the slider from being dragged.
	 */
	preventImageDragging() {
		const images = this.wrapper.querySelectorAll('img')
		images.forEach((img) => {
			img.setAttribute('draggable', 'false')
			img.addEventListener('load', () => this.handleHeight())
		})
	}

	/**
	 * Handle the touch start event.
	 * @param {TouchEvent} e - The touch event object.
	 */
	onTouchStart(e) {
		this.isDragging = true
		this.startX = e.touches[0].pageX - this.wrapper.offsetLeft
		this.scrollLeft = this.wrapper.scrollLeft
		this.startY = e.touches[0].pageY
		this.isVerticalScroll = false
	}

	/**
	 * Handle the mouse down event.
	 * @param {MouseEvent} e - The mouse event object.
	 */
	handleMouseDown(e) {
		if (this.wrapper.children.length > 1) {
			onMouseDown(e, this, this.state)
			this.isScrolling = false
			this.wrapper.style.cursor = 'grabbing'
		}
	}

	/**
	 * Handle the mouse up event.
	 * @param {MouseEvent} e - The mouse event object.
	 */
	handleMouseUp(e) {
		if (this.wrapper.children.length > 1) {
			onMouseUp(this, this.state)
			if (!this.isScrolling) {
				this.handleSlideChange()
			}
			this.isScrolling = false
			this.wrapper.style.cursor = 'grab'
		}
	}

	/**
	 * Handle the mouse leave event.
	 */
	handleMouseLeave() {
		if (this.wrapper.children.length > 1) {
			onMouseLeave(this, this.state)
			this.wrapper.style.cursor = 'grab'
		}
	}

	/**
	 * Handle the mouse move event.
	 * @param {MouseEvent} e - The mouse event object.
	 */
	handleMouseMove(e) {
		onMouseMove(e, this, this.state)
		this.isScrolling = true
	}

	/**
	 * Detect the currently visible slide and update the state accordingly.
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
	 * Handle the slide change event.
	 */
	handleSlideChange() {
		const newSlide = Math.round(this.wrapper.scrollLeft / this.wrapper.offsetWidth)
		if (newSlide !== this.state.currentSlide) {
			this.state.currentSlide = newSlide
			this.updateAriaHidden()
			this.updateButtonState()
			this.triggerSlideChangeEvent(newSlide)
			this.handleHeight()
		}
	}

	/**
	 * Update the `aria-hidden` attribute for slides based on visibility.
	 */
	updateAriaHidden() {
		const slides = Array.from(this.wrapper.children)
		const slideWidth = slides[0].offsetWidth
		const visibleSlides = Math.floor(this.wrapper.offsetWidth / slideWidth)
		const currentSlideIndex = this.state.currentSlide
	
		slides.forEach((slide, index) => {
			if (index >= currentSlideIndex && index < currentSlideIndex + visibleSlides) {
				slide.setAttribute('aria-hidden', 'false')
			} else {
				slide.setAttribute('aria-hidden', 'true')
			}
		})
	}

	/**
	 * Trigger a custom slide change event.
	 * @param {number} slideIndex - The index of the newly active slide.
	 */
	triggerSlideChangeEvent(slideIndex) {
		const event = new CustomEvent('slideChange', { detail: { slideIndex } })
		this.wrapper.dispatchEvent(event)
		if (this.options.onSlideChange) {
			this.options.onSlideChange(slideIndex)
		}
	}

	/**
	 * Adjust the height of the slider wrapper based on the current slide's content.
	 */
	handleHeight() {
		const currentSlideElement = this.wrapper.children[this.state.currentSlide]
		if (!currentSlideElement) return

		const slideStyle = window.getComputedStyle(currentSlideElement)
		const paddingTop = parseFloat(slideStyle.paddingTop) || 0
		const paddingBottom = parseFloat(slideStyle.paddingBottom) || 0

		let totalHeight = Array.from(currentSlideElement.children).reduce((acc, child) => {
			const childHeight = child.getBoundingClientRect().height
			const style = window.getComputedStyle(child)
			const marginTop = parseFloat(style.marginTop) || 0
			const marginBottom = parseFloat(style.marginBottom) || 0
			return acc + childHeight + marginTop + marginBottom
		}, 0)

		totalHeight += paddingTop + paddingBottom

		if (slideStyle.display.includes('flex')) {
			const gap = parseFloat(slideStyle.rowGap) || 0
			totalHeight += gap * (currentSlideElement.children.length - 1)
		} else if (slideStyle.display.includes('grid')) {
			const columnHeights = Array.from(currentSlideElement.children).reduce((heights, child, index) => {
				heights[index % slideStyle.gridTemplateColumns.split(' ').length] += child.getBoundingClientRect().height
				return heights
			}, Array(slideStyle.gridTemplateColumns.split(' ').length).fill(0))
			totalHeight = Math.max(...columnHeights)
		}

		this.wrapper.style.height = `${totalHeight}px`
		void this.wrapper.offsetHeight
	}

	/**
	 * Handle the "previous" button click to scroll the slides backward.
	 */
	handlePrevClick() {
		this.scrollSlides(-1)
	}

	/**
	 * Handle the "next" button click to scroll the slides forward.
	 */
	handleNextClick() {
		this.scrollSlides(1)
	}

	/**
	 * Scroll the slides in the given direction.
	 * @param {number} direction - The direction to scroll (1 for forward, -1 for backward).
	 */
	scrollSlides(direction) {
		const slideWidth = this.wrapper.children[0]?.offsetWidth || 0
		const newScrollLeft = this.wrapper.scrollLeft + direction * slideWidth

		this.updateButtonState()
		this.wrapper.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
		this.detectCurrentSlide()
	}

	/**
	 * Debounce function to limit the rate of function execution.
	 * @param {Function} func - The function to debounce.
	 * @param {number} wait - The delay in milliseconds.
	 * @returns {Function} - The debounced function.
	 */
	debounce(func, wait) {
		let timeout
		return (...args) => {
			clearTimeout(timeout)
			timeout = setTimeout(() => func.apply(this, args), wait)
		}
	}

	/**
	 * Update the state of navigation buttons (previous and next) based on scroll position.
	 */
	updateButtonState() {
		const slideWidth = this.wrapper.children[0]?.offsetWidth || 0
		const visibleSlides = Math.floor(this.wrapper.offsetWidth / slideWidth)
		const totalSlides = this.wrapper.children.length
		const maxScrollLeft = (totalSlides - visibleSlides) * slideWidth

		this.prev?.toggleAttribute('disabled', this.wrapper.scrollLeft <= 0)
		this.next?.toggleAttribute('disabled', this.wrapper.scrollLeft >= maxScrollLeft)
	}

	/**
	 * Create navigation dots for the slider.
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
	 * Update the active state of dots based on the visible slides.
	 * @param {number} startIndex - The start index of the visible slides.
	 * @param {number} endIndex - The end index of the visible slides.
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
	 * Navigate to a specific slide.
	 * @param {number} index - The index of the slide to navigate to.
	 */
	goToSlide(index) {
		const newScrollLeft = index * this.wrapper.offsetWidth
		this.wrapper.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
		this.detectCurrentSlide()
	}

	/**
	 * Destroy the Snapgrab instance by removing all event listeners.
	 */
	destroy() {
		this.wrapper.removeEventListener('mousedown', this.onMouseDown)
		this.wrapper.removeEventListener('mousemove', this.onMouseMove)
		this.wrapper.removeEventListener('mouseup', this.onMouseUp)
		this.wrapper.removeEventListener('mouseleave', this.onMouseLeave)
		this.wrapper.removeEventListener('scroll', this.onScroll)
		// More event listeners could be removed here as needed.
	}
}