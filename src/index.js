import { onMouseDown, onMouseLeave, onMouseMove, onMouseUp, onTouchMove } from './utils/mouseHandlers'

export class Snapgrab {
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

	preventImageDragging() {
		const images = this.wrapper.querySelectorAll('img')
		images.forEach((img) => {
			img.setAttribute('draggable', 'false')
			img.addEventListener('load', () => this.handleHeight())
		})
	}

	onTouchStart(e) {
		this.isDragging = true
		this.startX = e.touches[0].pageX - this.wrapper.offsetLeft
		this.scrollLeft = this.wrapper.scrollLeft
		this.startY = e.touches[0].pageY
		this.isVerticalScroll = false
	}

	handleMouseDown(e) {
		if (this.wrapper.children.length > 1) {
			onMouseDown(e, this, this.state)
			this.isScrolling = false
			this.wrapper.style.cursor = 'grabbing'
		}
	}
	
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
	
	handleMouseLeave() {
		if (this.wrapper.children.length > 1) {
			onMouseLeave(this, this.state)
			this.wrapper.style.cursor = 'grab'
		}
	}

	handleMouseMove(e) {
		onMouseMove(e, this, this.state)
		this.isScrolling = true
	}

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

	updateAriaHidden() {
		const slides = this.wrapper.querySelectorAll('.testimonial__slide')
		slides.forEach((slide, index) => {
			slide.setAttribute('aria-hidden', index !== this.state.currentSlide)
		})
	}

	triggerSlideChangeEvent(slideIndex) {
		const event = new CustomEvent('slideChange', { detail: { slideIndex } })
		this.wrapper.dispatchEvent(event)
		if (this.options.onSlideChange) {
			this.options.onSlideChange(slideIndex)
		}
	}

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

	handlePrevClick() {
		this.scrollSlides(-1)
	}

	handleNextClick() {
		this.scrollSlides(1)
	}

	scrollSlides(direction) {
		const slideWidth = this.wrapper.children[0]?.offsetWidth || 0
		const newScrollLeft = this.wrapper.scrollLeft + direction * slideWidth // Change to scroll by one slide width
	
		this.updateButtonState()
		this.wrapper.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
		this.detectCurrentSlide()
	}

	debounce(func, wait) {
		let timeout
		return (...args) => {
			clearTimeout(timeout)
			timeout = setTimeout(() => func.apply(this, args), wait)
		}
	}

	updateButtonState() {
		const slideWidth = this.wrapper.children[0]?.offsetWidth || 0
		const visibleSlides = Math.floor(this.wrapper.offsetWidth / slideWidth)
		const totalSlides = this.wrapper.children.length
		const maxScrollLeft = (totalSlides - visibleSlides) * slideWidth
	
		this.prev?.toggleAttribute('disabled', this.wrapper.scrollLeft <= 0)        
		this.next?.toggleAttribute('disabled', this.wrapper.scrollLeft >= maxScrollLeft)
	}

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
	
		console.log('Visible Slides on Init:', visibleSlides, 'Total Slides:', slideCount)
	
		this.updateActiveDot(0, visibleSlides - 1)
	}

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

	goToSlide(index) {
		const newScrollLeft = index * this.wrapper.offsetWidth
		this.wrapper.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
		this.detectCurrentSlide()
	}

	destroy() {
		this.wrapper.removeEventListener('mousedown', this.onMouseDown)
		this.wrapper.removeEventListener('mousemove', this.onMouseMove)
		this.wrapper.removeEventListener('mouseup', this.onMouseUp)
		this.wrapper.removeEventListener('mouseleave', this.onMouseLeave)
		this.wrapper.removeEventListener('scroll', this.onScroll)
	}
}
