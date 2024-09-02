function d(i) {
  return i.type.includes("touch") ? i.touches[0].pageX : i.pageX;
}
function p(i, t, e) {
  t.isDragging = e, i.wrapper.style.cursor = e ? "grabbing" : "grab";
}
function u(i) {
  i.type.includes("touch") && i.preventDefault();
}
function g(i, t) {
  const e = i.wrapper.scrollWidth - i.wrapper.clientWidth;
  i.wrapper.scrollLeft <= 0 ? c(i.wrapper, "no-more-left") : i.wrapper.scrollLeft >= e && c(i.wrapper, "no-more-right");
}
function c(i, t) {
  i.classList.add(t), setTimeout(() => i.classList.remove(t), 500);
}
function f(i, t, e) {
  return Math.max(t, Math.min(i, e));
}
function S(i, t, e) {
  const s = d(i);
  p(t, e, !0), e.startX = s - t.wrapper.offsetLeft, e.scrollLeft = t.wrapper.scrollLeft, u(i);
}
function m(i, t, e) {
  if (!e.isDragging) return;
  const s = d(i);
  u(i);
  const o = (s - e.startX) * 1.5, n = t.wrapper.scrollWidth - t.wrapper.clientWidth;
  let r = e.scrollLeft - o;
  r = f(r, 0, n), t.wrapper.scrollLeft = r, g(t);
}
function L(i, t) {
  p(i, t, !1);
}
function M(i, t) {
  t.isDragging && p(i, t, !1);
}
function b(i, t, e) {
  if (!e.isDragging) return;
  const o = (d(i) - t.wrapper.offsetLeft - e.startX) * 1.5, n = t.wrapper.scrollWidth - t.wrapper.clientWidth;
  let r = e.scrollLeft - o;
  r = f(r, 0, n), t.wrapper.scrollLeft = r, g(t);
}
class y {
  /**
   * Create a Snapgrab instance.
   * @param {HTMLElement} element - The main element containing the slider.
   * @param {Object} [options={}] - Configuration options for the slider.
   */
  constructor(t, e = {}) {
    this.element = t, this.wrapper = this.element.querySelector('[data-ref="wrapper"]'), this.dots = this.element.querySelector('[data-ref="dots"]'), this.prev = this.element.querySelector('[data-ref="prev"]'), this.next = this.element.querySelector('[data-ref="next"]'), this.isDragging = !1, this.isScrolling = !1, this.startX = 0, this.scrollLeft = 0, this.startY = 0, this.isVerticalScroll = !1, this.options = e, this.state = {
      isDragging: this.isDragging,
      startX: this.startX,
      scrollLeft: this.scrollLeft,
      currentSlide: 0
    }, this.bindEvents();
  }
  /**
   * Bind the necessary event handlers to the elements.
   */
  bindEvents() {
    var t, e;
    this.onMouseDown = (s) => this.handleMouseDown(s), this.onMouseMove = (s) => this.handleMouseMove(s), this.onMouseUp = (s) => this.handleMouseUp(s), this.onMouseLeave = () => this.handleMouseLeave(), this.onScroll = this.debounce(() => this.detectCurrentSlide(), 100), this.onTouchMove = (s) => b(s, this, this.state), this.wrapper.addEventListener("mousedown", this.onMouseDown), this.wrapper.addEventListener("mousemove", this.onMouseMove), this.wrapper.addEventListener("mouseup", this.onMouseUp), this.wrapper.addEventListener("mouseleave", this.onMouseLeave), this.wrapper.addEventListener("scroll", this.onScroll), this.wrapper.addEventListener("touchstart", (s) => this.onTouchStart(s), { passive: !0 }), this.wrapper.addEventListener("touchmove", this.onTouchMove, { passive: !0 }), this.wrapper.addEventListener("touchend", this.onMouseUp), (t = this.prev) == null || t.addEventListener("click", () => this.handlePrevClick()), (e = this.next) == null || e.addEventListener("click", () => this.handleNextClick()), this.wrapper.addEventListener("slideChange", () => this.handleHeight()), window.addEventListener("resize", this.handleHeight.bind(this));
  }
  /**
   * Initialize the Snapgrab component.
   */
  init() {
    this.preventImageDragging(), this.updateButtonState(), this.handleHeight(), this.createDots(), this.detectCurrentSlide(), this.wrapper.children.length > 1 ? this.wrapper.style.cursor = "grab" : (this.dots && (this.dots.style.display = "none"), this.prev && (this.prev.style.display = "none"), this.next && (this.next.style.display = "none")), this.element.classList.add("loaded");
  }
  /**
   * Prevent images within the slider from being dragged.
   */
  preventImageDragging() {
    this.wrapper.querySelectorAll("img").forEach((e) => {
      e.setAttribute("draggable", "false"), e.addEventListener("load", () => this.handleHeight());
    });
  }
  /**
   * Handle the touch start event.
   * @param {TouchEvent} e - The touch event object.
   */
  onTouchStart(t) {
    this.isDragging = !0, this.startX = t.touches[0].pageX - this.wrapper.offsetLeft, this.scrollLeft = this.wrapper.scrollLeft, this.startY = t.touches[0].pageY, this.isVerticalScroll = !1;
  }
  /**
   * Handle the mouse down event.
   * @param {MouseEvent} e - The mouse event object.
   */
  handleMouseDown(t) {
    this.wrapper.children.length > 1 && (S(t, this, this.state), this.isScrolling = !1, this.wrapper.style.cursor = "grabbing");
  }
  /**
   * Handle the mouse up event.
   * @param {MouseEvent} e - The mouse event object.
   */
  handleMouseUp(t) {
    this.wrapper.children.length > 1 && (L(this, this.state), this.isScrolling || this.handleSlideChange(), this.isScrolling = !1, this.wrapper.style.cursor = "grab");
  }
  /**
   * Handle the mouse leave event.
   */
  handleMouseLeave() {
    this.wrapper.children.length > 1 && (M(this, this.state), this.wrapper.style.cursor = "grab");
  }
  /**
   * Handle the mouse move event.
   * @param {MouseEvent} e - The mouse event object.
   */
  handleMouseMove(t) {
    m(t, this, this.state), this.isScrolling = !0;
  }
  /**
   * Detect the currently visible slide and update the state accordingly.
   */
  detectCurrentSlide() {
    const t = this.wrapper.children[0].offsetWidth, e = Math.floor(this.wrapper.offsetWidth / t), s = Math.round(this.wrapper.scrollLeft / t), o = s + e - 1;
    s !== this.state.currentSlide ? (this.state.currentSlide = s, this.state.visibleSlides = e, this.updateAriaHidden(), this.updateButtonState(), this.updateActiveDot(s, o), this.triggerSlideChangeEvent(s)) : this.updateButtonState();
  }
  /**
   * Handle the slide change event.
   */
  handleSlideChange() {
    const t = Math.round(this.wrapper.scrollLeft / this.wrapper.offsetWidth);
    t !== this.state.currentSlide && (this.state.currentSlide = t, this.updateAriaHidden(), this.updateButtonState(), this.triggerSlideChangeEvent(t), this.handleHeight());
  }
  /**
   * Update the `aria-hidden` attribute for slides based on visibility.
   */
  updateAriaHidden() {
    const t = Array.from(this.wrapper.children), e = t[0].offsetWidth, s = Math.floor(this.wrapper.offsetWidth / e), o = this.state.currentSlide;
    t.forEach((n, r) => {
      r >= o && r < o + s ? n.setAttribute("aria-hidden", "false") : n.setAttribute("aria-hidden", "true");
    });
  }
  /**
   * Trigger a custom slide change event.
   * @param {number} slideIndex - The index of the newly active slide.
   */
  triggerSlideChangeEvent(t) {
    const e = new CustomEvent("slideChange", { detail: { slideIndex: t } });
    this.wrapper.dispatchEvent(e), this.options.onSlideChange && this.options.onSlideChange(t);
  }
  /**
   * Adjust the height of the slider wrapper based on the current slide's content.
   */
  handleHeight() {
    const t = this.wrapper.children[this.state.currentSlide];
    if (!t) return;
    const e = window.getComputedStyle(t), s = parseFloat(e.paddingTop) || 0, o = parseFloat(e.paddingBottom) || 0;
    let n = Array.from(t.children).reduce((r, l) => {
      const a = l.getBoundingClientRect().height, h = window.getComputedStyle(l), w = parseFloat(h.marginTop) || 0, v = parseFloat(h.marginBottom) || 0;
      return r + a + w + v;
    }, 0);
    if (n += s + o, e.display.includes("flex")) {
      const r = parseFloat(e.rowGap) || 0;
      n += r * (t.children.length - 1);
    } else if (e.display.includes("grid")) {
      const r = Array.from(t.children).reduce((l, a, h) => (l[h % e.gridTemplateColumns.split(" ").length] += a.getBoundingClientRect().height, l), Array(e.gridTemplateColumns.split(" ").length).fill(0));
      n = Math.max(...r);
    }
    this.wrapper.style.height = `${n}px`, this.wrapper.offsetHeight;
  }
  /**
   * Handle the "previous" button click to scroll the slides backward.
   */
  handlePrevClick() {
    this.scrollSlides(-1);
  }
  /**
   * Handle the "next" button click to scroll the slides forward.
   */
  handleNextClick() {
    this.scrollSlides(1);
  }
  /**
   * Scroll the slides in the given direction.
   * @param {number} direction - The direction to scroll (1 for forward, -1 for backward).
   */
  scrollSlides(t) {
    var o;
    const e = ((o = this.wrapper.children[0]) == null ? void 0 : o.offsetWidth) || 0, s = this.wrapper.scrollLeft + t * e;
    this.updateButtonState(), this.wrapper.scrollTo({ left: s, behavior: "smooth" }), this.detectCurrentSlide();
  }
  /**
   * Debounce function to limit the rate of function execution.
   * @param {Function} func - The function to debounce.
   * @param {number} wait - The delay in milliseconds.
   * @returns {Function} - The debounced function.
   */
  debounce(t, e) {
    let s;
    return (...o) => {
      clearTimeout(s), s = setTimeout(() => t.apply(this, o), e);
    };
  }
  /**
   * Update the state of navigation buttons (previous and next) based on scroll position.
   */
  updateButtonState() {
    var n, r, l;
    const t = ((n = this.wrapper.children[0]) == null ? void 0 : n.offsetWidth) || 0, e = Math.floor(this.wrapper.offsetWidth / t), o = (this.wrapper.children.length - e) * t;
    (r = this.prev) == null || r.toggleAttribute("disabled", this.wrapper.scrollLeft <= 0), (l = this.next) == null || l.toggleAttribute("disabled", this.wrapper.scrollLeft >= o);
  }
  /**
   * Create navigation dots for the slider.
   */
  createDots() {
    var n;
    if (!this.dots) return;
    const t = this.wrapper.children.length;
    this.dots.innerHTML = "";
    for (let r = 0; r < t; r++) {
      const l = document.createElement("button");
      l.className = "dot", l.addEventListener("click", () => this.goToSlide(r)), this.dots.appendChild(l);
    }
    const e = ((n = this.wrapper.children[0]) == null ? void 0 : n.offsetWidth) || 0, s = parseFloat(window.getComputedStyle(this.wrapper).gap) || 0, o = Math.floor(this.wrapper.offsetWidth / (e + s));
    this.state.visibleSlides = o, this.updateActiveDot(0, o - 1);
  }
  /**
   * Update the active state of dots based on the visible slides.
   * @param {number} startIndex - The start index of the visible slides.
   * @param {number} endIndex - The end index of the visible slides.
   */
  updateActiveDot(t, e) {
    if (!this.dots) return;
    const s = this.dots.querySelectorAll("button"), o = s.length, n = this.state.visibleSlides;
    s.forEach((r, l) => {
      let a = l >= t && l <= e;
      e >= o - 1 && (a = l >= o - n), r.classList.toggle("is-active", a);
    });
  }
  /**
   * Navigate to a specific slide.
   * @param {number} index - The index of the slide to navigate to.
   */
  goToSlide(t) {
    const e = t * this.wrapper.offsetWidth;
    this.wrapper.scrollTo({ left: e, behavior: "smooth" }), this.detectCurrentSlide();
  }
  /**
   * Destroy the Snapgrab instance by removing all event listeners.
   */
  destroy() {
    this.wrapper.removeEventListener("mousedown", this.onMouseDown), this.wrapper.removeEventListener("mousemove", this.onMouseMove), this.wrapper.removeEventListener("mouseup", this.onMouseUp), this.wrapper.removeEventListener("mouseleave", this.onMouseLeave), this.wrapper.removeEventListener("scroll", this.onScroll);
  }
}
export {
  y as Snapgrab
};
