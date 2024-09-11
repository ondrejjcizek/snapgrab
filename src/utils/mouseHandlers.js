function getEventX(e) {
	return e.type.includes('touch') ? e.touches[0].pageX : e.pageX
}

function setDraggingState(ref, state, isDragging) {
	state.isDragging = isDragging
	ref.wrapper.style.cursor = isDragging ? 'grabbing' : 'grab'
}

function preventDefaultTouchEvent(e) {
	if (e.type.includes('touch')) {
		e.preventDefault()
	}
}

function triggerBoundaryClass(wrapper, className) {
	wrapper.classList.add(className)
	setTimeout(() => wrapper.classList.remove(className), 500) 
}

function detectScrollBoundaries(ref, walk) {
	const maxScrollLeft = ref.wrapper.scrollWidth - ref.wrapper.clientWidth

	if (ref.wrapper.scrollLeft <= 0 && walk > 0) {
		triggerBoundaryClass(ref.wrapper, 'no-more-left')
	} 
	
	else if (ref.wrapper.scrollLeft >= maxScrollLeft && walk < 0) {
		triggerBoundaryClass(ref.wrapper, 'no-more-right')
	}
}

function clampScrollPosition(scrollLeft, min, max) {
	return Math.max(min, Math.min(scrollLeft, max))
}

export function onMouseDown(e, ref, state) {
	const startX = getEventX(e)

	state.startX = startX - ref.wrapper.offsetLeft
	state.scrollLeft = ref.wrapper.scrollLeft
	state.hasMoved = false  
	state.isMouseDown = true 

	preventDefaultTouchEvent(e)
}

export function onMouseMove(e, ref, state) {
	
	if (!state.isMouseDown) return

	if (state.isDragging) {
		const x = getEventX(e)
		preventDefaultTouchEvent(e)

		const walk = (x - state.startX) * 3
		const maxScrollLeft = ref.wrapper.scrollWidth - ref.wrapper.clientWidth
		let newScrollLeft = state.scrollLeft - walk

		newScrollLeft = clampScrollPosition(newScrollLeft, 0, maxScrollLeft)
		ref.wrapper.scrollLeft = newScrollLeft

		detectScrollBoundaries(ref, walk)
		return
	}
	
	const diffX = Math.abs(getEventX(e) - (state.startX + ref.wrapper.offsetLeft))
	
	if (diffX > 10 && !state.hasMoved) {
		state.isDragging = true
		setDraggingState(ref, state, true)
		state.hasMoved = true 
	}
}

export function onMouseUp(ref, state) {
	setDraggingState(ref, state, false)
	state.hasMoved = false 
	state.isMouseDown = false 
}

export function onMouseLeave(ref, state) {
	if (state.isDragging) {
		setDraggingState(ref, state, false)
	}
	state.hasMoved = false 
	state.isMouseDown = false 
}

export function onTouchStart(e, ref, state) {
	e.preventDefault()
}

export function onTouchMove(e, ref, state) {
	if (!state.isDragging) return

	const x = getEventX(e) - ref.wrapper.offsetLeft
	const walk = (x - state.startX) * 1.5
	const maxScrollLeft = ref.wrapper.scrollWidth - ref.wrapper.clientWidth
	let newScrollLeft = state.scrollLeft - walk

	newScrollLeft = clampScrollPosition(newScrollLeft, 0, maxScrollLeft)
	ref.wrapper.scrollLeft = newScrollLeft

	detectScrollBoundaries(ref, walk)
}

export function onTouchEnd(e, ref, state) {
	e.preventDefault()
}
