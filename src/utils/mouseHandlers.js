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

function detectScrollBoundaries(ref, walk) {
	const maxScrollLeft = ref.wrapper.scrollWidth - ref.wrapper.clientWidth

	if (walk > 0 && ref.wrapper.scrollLeft <= 0) {
		triggerBoundaryClass(ref.wrapper, 'no-more-left')
	} else if (walk < 0 && ref.wrapper.scrollLeft >= maxScrollLeft) {
		triggerBoundaryClass(ref.wrapper, 'no-more-right')
	}
}

function triggerBoundaryClass(wrapper, className) {
	wrapper.classList.add(className)
	setTimeout(() => wrapper.classList.remove(className), 500)
}

export function onMouseDown(e, ref, state) {
	const startX = getEventX(e)

	setDraggingState(ref, state, true)
	state.startX = startX - ref.wrapper.offsetLeft
	state.scrollLeft = ref.wrapper.scrollLeft

	preventDefaultTouchEvent(e)
}

export function onMouseMove(e, ref, state) {
	if (!state.isDragging) return

	const x = getEventX(e)
	preventDefaultTouchEvent(e)

	const walk = (x - state.startX) * 1.5
	ref.wrapper.scrollLeft = state.scrollLeft - walk

	detectScrollBoundaries(ref, walk)
}

export function onMouseUp(ref, state) {
	setDraggingState(ref, state, false)
}

export function onMouseLeave(ref, state) {
	if (state.isDragging) {
		setDraggingState(ref, state, false)
	}
}

export function onTouchMove(e, ref, state) {
	if (!state.isDragging) return

	const x = getEventX(e) - ref.wrapper.offsetLeft
	const walk = (x - state.startX) * 3

	ref.wrapper.scrollLeft = state.scrollLeft - walk

	detectScrollBoundaries(ref, walk)
}
