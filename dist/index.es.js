function f(s) {
  return s.type.includes("touch") ? s.touches[0].pageX : s.pageX;
}
function g(s, t, e) {
  t.isDragging = e, s.wrapper.style.cursor = e ? "grabbing" : "grab";
}
function v(s) {
  s.type.includes("touch") && s.preventDefault();
}
function w(s, t) {
  const e = s.wrapper.scrollWidth - s.wrapper.clientWidth;
  s.wrapper.scrollLeft <= 0 ? m(s.wrapper, "no-more-left") : s.wrapper.scrollLeft >= e && m(s.wrapper, "no-more-right");
}
function m(s, t) {
  s.classList.add(t), setTimeout(() => s.classList.remove(t), 500);
}
function S(s, t, e) {
  return Math.max(t, Math.min(s, e));
}
function y(s, t, e) {
  const i = f(s);
  g(t, e, !0), e.startX = i - t.wrapper.offsetLeft, e.scrollLeft = t.wrapper.scrollLeft, v(s);
}
function M(s, t, e) {
  if (!e.isDragging) return;
  const i = f(s);
  v(s);
  const r = (i - e.startX) * 1.5, a = t.wrapper.scrollWidth - t.wrapper.clientWidth;
  let o = e.scrollLeft - r;
  o = S(o, 0, a), t.wrapper.scrollLeft = o, w(t);
}
function E(s, t) {
  g(s, t, !1);
}
function b(s, t) {
  t.isDragging && g(s, t, !1);
}
function C(s, t, e) {
  if (!e.isDragging) return;
  const r = (f(s) - t.wrapper.offsetLeft - e.startX) * 1.5, a = t.wrapper.scrollWidth - t.wrapper.clientWidth;
  let o = e.scrollLeft - r;
  o = S(o, 0, a), t.wrapper.scrollLeft = o, w(t);
}
function A(s, t, e) {
  this.timeoutId = null, this.delay = t, this.remaining = t, this.callback = s, this.isPaused = !1, this.loop = e || !1, this.startTimestamp = null, this.start = function() {
    var i = this;
    this.startTimestamp = Date.now(), this.timeoutId = setTimeout(function() {
      i.callback(), i.loop && i.reset();
    }, this.remaining);
  }, this.pause = function() {
    this.timeoutId && (clearTimeout(this.timeoutId), this.timeoutId = null, this.startTimestamp !== null && (this.remaining -= Date.now() - this.startTimestamp), this.isPaused = !0);
  }, this.resume = function() {
    this.isPaused && (this.isPaused = !1, this.start());
  }, this.reset = function(i) {
    this.timeoutId && (clearTimeout(this.timeoutId), this.timeoutId = null), this.remaining = i !== void 0 ? i : this.delay, this.isPaused = !1, this.start();
  }, this.destroy = function() {
    this.timeoutId && clearTimeout(this.timeoutId), this.timeoutId = null, this.isPaused = !1, this.startTimestamp = null, this.remaining = this.delay;
  }, this.start();
}
class T {
  /**
      * Creates a new Snapgrab slider instance.
      * @param {HTMLElement} element - The DOM element to attach the slider to.
      * @param {Object} [options={}] - Configuration options for the slider.
      * @param {number} [options.autoplay] - Interval in milliseconds for autoplay. If not provided, autoplay is disabled.
      * @param {function} [options.onSlideChange] - Callback function to be called when the slide changes.
      */
  constructor(t, e = {}) {
    this.element = t, this.wrapper = this.element.querySelector('[data-ref="wrapper"]'), this.dots = this.element.querySelector('[data-ref="dots"]'), this.prev = this.element.querySelector('[data-ref="prev"]'), this.next = this.element.querySelector('[data-ref="next"]'), this.isDragging = !1, this.isScrolling = !1, this.startX = 0, this.scrollLeft = 0, this.startY = 0, this.isVerticalScroll = !1, this.options = e, this.state = {
      isDragging: this.isDragging,
      startX: this.startX,
      scrollLeft: this.scrollLeft,
      currentSlide: 0,
      visibleSlides: void 0
    }, this.autoplay = null, this.bindEvents();
  }
  /**
      * Binds event handlers to the necessary DOM elements.
      */
  bindEvents() {
    this.onMouseDown = (t) => this.handleMouseDown(t), this.onMouseMove = (t) => this.handleMouseMove(t), this.onMouseUp = (t) => this.handleMouseUp(t), this.onMouseLeave = () => this.handleMouseLeave(), this.onScroll = this.debounce(() => this.detectCurrentSlide(), 100), this.onTouchMove = (t) => C(t, this, this.state), this.wrapper.addEventListener("mousedown", this.onMouseDown), this.wrapper.addEventListener("mousemove", this.onMouseMove), this.wrapper.addEventListener("mouseup", this.onMouseUp), this.wrapper.addEventListener("mouseleave", this.onMouseLeave), this.wrapper.addEventListener("scroll", this.onScroll), this.wrapper.addEventListener("touchstart", (t) => this.onTouchStart(t), { passive: !0 }), this.wrapper.addEventListener("touchmove", this.onTouchMove, { passive: !0 }), this.wrapper.addEventListener("touchend", (t) => this.handleMouseUp(t)), this.prev && this.prev.addEventListener("click", () => this.handlePrevClick()), this.next && this.next.addEventListener("click", () => this.handleNextClick()), this.wrapper.addEventListener("slideChange", () => {
      console.log("Slide changed, updating height"), this.handleHeight();
    }), window.addEventListener("resize", this.handleHeight()), this.wrapper.addEventListener("mouseover", () => this.pauseAutoplay()), this.prev && this.prev.addEventListener("mouseover", () => this.pauseAutoplay()), this.next && this.next.addEventListener("mouseover", () => this.pauseAutoplay()), this.wrapper.addEventListener("mouseout", () => this.resumeAutoplay()), this.prev && this.prev.addEventListener("mouseout", () => this.resumeAutoplay()), this.next && this.next.addEventListener("mouseout", () => this.resumeAutoplay()), this.wrapper.addEventListener("transitionend", () => this.handleHeight());
  }
  /**
      * Initializes the slider component.
      */
  init() {
    this.preventImageDragging(), this.updateButtonState(), this.handleHeight(), this.createDots(), this.detectCurrentSlide(), this.handleHeight(), this.wrapper.children.length > 1 ? this.wrapper.style.cursor = "grab" : (this.dots && (this.dots.style.display = "none"), this.prev && (this.prev.style.display = "none"), this.next && (this.next.style.display = "none")), this.element.classList.add("loaded"), this.startAutoplay();
  }
  /**
      * Starts the autoplay functionality for the slider.
      */
  startAutoplay() {
    const t = this.options.autoplay;
    if (!t)
      return;
    const e = () => {
      this.handleNextClick(), this.handleHeight();
    };
    this.autoplay = new A(e, t, !0);
  }
  /**
      * Pauses the autoplay.
      */
  pauseAutoplay() {
    this.autoplay && this.autoplay.pause();
  }
  /**
      * Resumes the autoplay.
      */
  resumeAutoplay() {
    this.autoplay && this.autoplay.resume();
  }
  /**
      * Prevents images inside the slider from being draggable.
      */
  preventImageDragging() {
    this.wrapper.querySelectorAll("img").forEach((e) => {
      e.setAttribute("draggable", "false"), e.addEventListener("load", () => this.handleHeight());
    });
  }
  /**
      * Handles touch start event.
      * @param {TouchEvent} e - The touch event.
      */
  onTouchStart(t) {
    this.isDragging = !0, this.startX = t.touches[0].pageX - this.wrapper.offsetLeft, this.scrollLeft = this.wrapper.scrollLeft, this.startY = t.touches[0].pageY, this.isVerticalScroll = !1, this.autoplay && this.autoplay.reset();
  }
  /**
      * Handles mouse down event.
      * @param {MouseEvent} e - The mouse event.
      */
  handleMouseDown(t) {
    this.wrapper.children.length > 1 && (y(t, this, this.state), this.isScrolling = !1, this.wrapper.style.cursor = "grabbing");
  }
  /**
      * Handles mouse up event.
      * @param {MouseEvent} e - The mouse event.
      */
  handleMouseUp(t) {
    this.wrapper.children.length > 1 && (E(this, this.state), this.isScrolling || this.handleSlideChange(), this.isScrolling = !1, this.wrapper.style.cursor = "grab", this.autoplay && this.autoplay.reset());
  }
  /**
      * Handles mouse leave event.
      */
  handleMouseLeave() {
    this.wrapper.children.length > 1 && (b(this, this.state), this.wrapper.style.cursor = "grab");
  }
  /**
      * Handles mouse move event.
      * @param {MouseEvent} e - The mouse event.
      */
  handleMouseMove(t) {
    M(t, this, this.state), this.isScrolling = !0;
  }
  /**
      * Detects the current slide based on the scroll position.
      */
  detectCurrentSlide() {
    const t = this.wrapper.children[0].offsetWidth, e = Math.floor(this.wrapper.offsetWidth / t), i = Math.round(this.wrapper.scrollLeft / t), r = i + e - 1;
    i !== this.state.currentSlide ? (this.state.currentSlide = i, this.state.visibleSlides = e, this.updateAriaHidden(), this.updateButtonState(), this.updateActiveDot(i, r), this.triggerSlideChangeEvent(i)) : this.updateButtonState();
  }
  /**
      * Handles the slide change event.
      */
  handleSlideChange() {
    const t = Math.round(this.wrapper.scrollLeft / this.wrapper.offsetWidth);
    t !== this.state.currentSlide && (this.state.currentSlide = t, this.updateAriaHidden(), this.updateButtonState(), this.triggerSlideChangeEvent(t)), this.handleHeight();
  }
  /**
      * Updates the `aria-hidden` attribute for accessibility.
      */
  updateAriaHidden() {
    const t = Array.from(this.wrapper.children), e = t[0].offsetWidth, i = Math.floor(this.wrapper.offsetWidth / e), r = this.state.currentSlide;
    t.forEach((a, o) => {
      o >= r && o < r + i ? a.setAttribute("aria-hidden", "false") : a.setAttribute("aria-hidden", "true");
    });
  }
  /**
      * Triggers a custom event when the slide changes.
      * @param {number} slideIndex - The index of the current slide.
      */
  triggerSlideChangeEvent(t) {
    const e = new CustomEvent("slideChange", { detail: { slideIndex: t } });
    this.wrapper.dispatchEvent(e), this.options.onSlideChange && this.options.onSlideChange(t);
  }
  /**
  * Handles the slider height dynamically.
  */
  handleHeight() {
    const t = Array.from(this.wrapper.children);
    if (!t.length) return;
    let e = 0;
    t.forEach((i) => {
      const r = window.getComputedStyle(i);
      if (!(i.getAttribute("aria-hidden") === "true")) {
        const o = parseFloat(r.paddingTop) || 0, n = parseFloat(r.paddingBottom) || 0;
        let h = 0;
        if (r.display.includes("grid")) {
          const l = r.gridTemplateColumns.split(" ").length, d = Array(l).fill(0);
          Array.from(i.children).forEach((u, p) => {
            const c = u.getBoundingClientRect().height;
            d[p % l] += c;
          }), h = Math.max(...d);
        } else if (h = Array.from(i.children).reduce((l, d) => {
          const u = d.getBoundingClientRect().height, p = window.getComputedStyle(d), c = parseFloat(p.marginTop) || 0, L = parseFloat(p.marginBottom) || 0;
          return l + u + c + L;
        }, 0), h += o + n, r.display.includes("flex")) {
          const l = parseFloat(r.rowGap) || 0;
          h += l * (i.children.length - 1);
        }
        e = Math.max(e, h);
      }
    }), e > 0 ? (this.wrapper.style.height = `${e}px`, this.wrapper.offsetHeight) : console.warn("Max height calculation failed; check your slide content and layout styles.");
  }
  /**
      * Handles the click event for the previous button.
      */
  handlePrevClick() {
    this.scrollSlides(-1);
  }
  /**
      * Handles the click event for the next button.
      */
  handleNextClick() {
    var t = this.wrapper.children.length, e = this.wrapper.children[0].offsetWidth || 0, i = Math.floor(this.wrapper.offsetWidth / e), r = (t - i) * e;
    this.wrapper.scrollLeft >= r ? (this.goToSlide(0), this.updateActiveDot(0, i - 1)) : this.scrollSlides(1), this.handleHeight();
  }
  /**
      * Scrolls the slides in the specified direction.
      * @param {number} direction - The direction to scroll, -1 for left, 1 for right.
      */
  scrollSlides(t) {
    var r;
    const e = ((r = this.wrapper.children[0]) == null ? void 0 : r.offsetWidth) || 0, i = this.wrapper.scrollLeft + t * e;
    this.wrapper.scrollTo({ left: i, behavior: "smooth" }), this.detectCurrentSlide(), this.handleHeight();
  }
  /**
      * Debounces a function call.
      * @param {function} func - The function to debounce.
      * @param {number} wait - The delay in milliseconds.
      * @returns {function} The debounced function.
      */
  debounce(t, e) {
    let i;
    return (...r) => {
      clearTimeout(i), i = setTimeout(() => t.apply(this, r), e);
    };
  }
  /**
      * Updates the state of navigation buttons.
      */
  updateButtonState() {
    var a;
    const t = ((a = this.wrapper.children[0]) == null ? void 0 : a.offsetWidth) || 0, e = Math.floor(this.wrapper.offsetWidth / t), r = (this.wrapper.children.length - e) * t;
    this.prev && this.prev.toggleAttribute("disabled", this.wrapper.scrollLeft <= 0), this.next && this.next.toggleAttribute("disabled", this.wrapper.scrollLeft >= r);
  }
  /**
      * Creates navigation dots for the slider.
      */
  createDots() {
    var a;
    if (!this.dots) return;
    const t = this.wrapper.children.length;
    this.dots.innerHTML = "";
    for (let o = 0; o < t; o++) {
      const n = document.createElement("button");
      n.className = "dot", n.addEventListener("click", () => this.goToSlide(o)), this.dots.appendChild(n);
    }
    const e = ((a = this.wrapper.children[0]) == null ? void 0 : a.offsetWidth) || 0, i = parseFloat(window.getComputedStyle(this.wrapper).gap) || 0, r = Math.floor(this.wrapper.offsetWidth / (e + i));
    this.state.visibleSlides = r, this.updateActiveDot(0, r - 1);
  }
  /**
      * Updates the active state of navigation dots.
      * @param {number} startIndex - The starting index of the visible slides.
      * @param {number} endIndex - The ending index of the visible slides.
      */
  updateActiveDot(t, e) {
    if (!this.dots) return;
    const i = this.dots.querySelectorAll("button"), r = i.length, a = this.state.visibleSlides;
    i.forEach((o, n) => {
      let h = n >= t && n <= e;
      e >= r - 1 && (h = n >= r - a), o.classList.toggle("is-active", h);
    });
  }
  /**
      * Navigates to a specific slide.
      * @param {number} slideIndex - The index of the slide to navigate to.
      */
  goToSlide(t) {
    const e = t * this.wrapper.offsetWidth;
    this.wrapper.scrollTo({ left: e, behavior: "smooth" }), this.detectCurrentSlide();
    const i = this.wrapper.children[0].offsetWidth;
    this.wrapper.scrollLeft = i * t, this.state.currentSlide = t, this.updateButtonState(), this.triggerSlideChangeEvent(t), this.handleHeight();
  }
  /**
      * Destroys the slider and removes event listeners.
      */
  destroy() {
    this.wrapper.removeEventListener("mousedown", this.onMouseDown), this.wrapper.removeEventListener("mousemove", this.onMouseMove), this.wrapper.removeEventListener("mouseup", this.onMouseUp), this.wrapper.removeEventListener("mouseleave", this.onMouseLeave), this.wrapper.removeEventListener("scroll", this.onScroll);
  }
}
export {
  T as Snapgrab
};
