function h(e) {
  return e.type.includes("touch") ? e.touches[0].pageX : e.pageX;
}
function l(e, t) {
  const s = e.wrapper.scrollWidth - e.wrapper.clientWidth;
  e.wrapper.scrollLeft <= 0 ? n(e.wrapper, "no-more-left") : e.wrapper.scrollLeft >= s && n(e.wrapper, "no-more-right");
}
function n(e, t) {
  e.classList.add(t), setTimeout(() => e.classList.remove(t), 500);
}
function p(e, t, s) {
  return Math.max(t, Math.min(e, s));
}
function d(e, t, s) {
  if (!s.isDragging) return;
  const r = (h(e) - t.wrapper.offsetLeft - s.startX) * 1.5, a = t.wrapper.scrollWidth - t.wrapper.clientWidth;
  let o = s.scrollLeft - r;
  o = p(o, 0, a), t.wrapper.scrollLeft = o, l(t);
}
class u {
  /**
   * Creates an instance of Snapgrab.
   * @param {HTMLElement} element - The DOM element to attach the Snapgrab component to.
   * @param {Object} [options={}] - Optional settings for the Snapgrab component.
   */
  constructor(t, s = {}) {
    this.element = t, this.wrapper = /** @type {HTMLElement} */
    this.element.querySelector('[data-ref="wrapper"]'), this.dots = /** @type {HTMLElement} */
    this.element.querySelector('[data-ref="dots"]'), this.prev = /** @type {HTMLElement} */
    this.element.querySelector('[data-ref="prev"]'), this.next = /** @type {HTMLElement} */
    this.element.querySelector('[data-ref="next"]'), this.isDragging = !1, this.isScrolling = !1, this.startX = 0, this.scrollLeft = 0, this.startY = 0, this.isVerticalScroll = !1, this.options = s, this.state = {
      isDragging: this.isDragging,
      startX: this.startX,
      scrollLeft: this.scrollLeft,
      currentSlide: 0
    }, this.bindEvents();
  }
  /**
   * Binds all necessary event listeners.
   */
  bindEvents() {
    var t, s;
    this.onMouseDown = (i) => this.handleMouseDown(i), this.onMouseMove = (i) => this.handleMouseMove(i), this.onMouseUp = (i) => this.handleMouseUp(i), this.onMouseLeave = () => this.handleMouseLeave(), this.onScroll = this.debounce(() => this.detectCurrentSlide(), 100), this.onTouchMove = (i) => d(i, this, this.state), this.wrapper.addEventListener("mousedown", this.onMouseDown), this.wrapper.addEventListener("mousemove", this.onMouseMove), this.wrapper.addEventListener("mouseup", this.onMouseUp), this.wrapper.addEventListener("mouseleave", this.onMouseLeave), this.wrapper.addEventListener("scroll", this.onScroll), this.wrapper.addEventListener("touchstart", (i) => this.onTouchStart(
      /** @type {TouchEvent} */
      i
    ), { passive: !0 }), this.wrapper.addEventListener("touchmove", this.onTouchMove, { passive: !0 }), this.wrapper.addEventListener("touchend", this.onMouseUp), (t = this.prev) == null || t.addEventListener("click", () => this.handlePrevClick()), (s = this.next) == null || s.addEventListener("click", () => this.handleNextClick()), this.wrapper.addEventListener("slideChange", () => this.handleHeight()), window.addEventListener("resize", this.handleHeight.bind(this));
  }
  /**
   * Debounce a function call.
   * @param {Function} func - The function to debounce.
   * @param {number} wait - The debounce delay in milliseconds.
   * @returns {Function} The debounced function.
   */
  debounce(t, s) {
    let i;
    return (...r) => {
      clearTimeout(i), i = setTimeout(() => t.apply(this, r), s);
    };
  }
  /**
   * Initializes the Snapgrab component.
   */
  init() {
    this.preventImageDragging(), this.updateButtonState(), this.handleHeight(), this.createDots(), this.detectCurrentSlide();
  }
  // Additional methods with basic JSDoc annotations...
  /**
   * Destroy the Snapgrab instance, removing all event listeners.
   */
  destroy() {
    this.wrapper.removeEventListener("mousedown", this.onMouseDown), this.wrapper.removeEventListener("mousemove", this.onMouseMove), this.wrapper.removeEventListener("mouseup", this.onMouseUp), this.wrapper.removeEventListener("mouseleave", this.onMouseLeave), this.wrapper.removeEventListener("scroll", this.onScroll);
  }
}
typeof module < "u" && module.exports && (module.exports = u);
export {
  u as default
};
