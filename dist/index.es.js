var L = Object.defineProperty;
var M = (s, t, e) => t in s ? L(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var n = (s, t, e) => M(s, typeof t != "symbol" ? t + "" : t, e);
function p(s) {
  return s.type.includes("touch") ? s.touches[0].pageX : s.pageX;
}
function c(s, t, e) {
  t.isDragging = e, s.wrapper.style.cursor = e ? "grabbing" : "grab";
}
function f(s) {
  s.type.includes("touch") && s.preventDefault();
}
function w(s, t) {
  const e = s.wrapper.scrollWidth - s.wrapper.clientWidth;
  s.wrapper.scrollLeft <= 0 ? g(s.wrapper, "no-more-left") : s.wrapper.scrollLeft >= e && g(s.wrapper, "no-more-right");
}
function g(s, t) {
  s.classList.add(t), setTimeout(() => s.classList.remove(t), 500);
}
function v(s, t, e) {
  return Math.max(t, Math.min(s, e));
}
function E(s, t, e) {
  const i = p(s);
  c(t, e, !0), e.startX = i - t.wrapper.offsetLeft, e.scrollLeft = t.wrapper.scrollLeft, f(s);
}
function b(s, t, e) {
  if (!e.isDragging) return;
  const i = p(s);
  f(s);
  const o = (i - e.startX) * 1.5, l = t.wrapper.scrollWidth - t.wrapper.clientWidth;
  let r = e.scrollLeft - o;
  r = v(r, 0, l), t.wrapper.scrollLeft = r, w(t);
}
function y(s, t) {
  c(s, t, !1);
}
function C(s, t) {
  t.isDragging && c(s, t, !1);
}
function D(s, t, e) {
  if (!e.isDragging) return;
  const o = (p(s) - t.wrapper.offsetLeft - e.startX) * 1.5, l = t.wrapper.scrollWidth - t.wrapper.clientWidth;
  let r = e.scrollLeft - o;
  r = v(r, 0, l), t.wrapper.scrollLeft = r, w(t);
}
class T {
  constructor(t, e = {}) {
    n(this, "element");
    n(this, "wrapper");
    n(this, "dots");
    n(this, "prev");
    n(this, "next");
    n(this, "isDragging");
    n(this, "isScrolling");
    n(this, "startX");
    n(this, "scrollLeft");
    n(this, "startY");
    n(this, "isVerticalScroll");
    n(this, "options");
    n(this, "state");
    n(this, "onMouseDown", () => {
    });
    n(this, "onMouseMove", () => {
    });
    n(this, "onMouseUp", () => {
    });
    n(this, "onMouseLeave", () => {
    });
    n(this, "onScroll", () => {
    });
    n(this, "onTouchMove", () => {
    });
    this.element = t, this.wrapper = this.element.querySelector('[data-ref="wrapper"]'), this.dots = this.element.querySelector('[data-ref="dots"]'), this.prev = this.element.querySelector('[data-ref="prev"]'), this.next = this.element.querySelector('[data-ref="next"]'), this.isDragging = !1, this.isScrolling = !1, this.startX = 0, this.scrollLeft = 0, this.startY = 0, this.isVerticalScroll = !1, this.options = e, this.state = {
      isDragging: this.isDragging,
      startX: this.startX,
      scrollLeft: this.scrollLeft,
      currentSlide: 0
    }, this.bindEvents();
  }
  bindEvents() {
    var t, e;
    this.onMouseDown = (i) => this.handleMouseDown(i), this.onMouseMove = (i) => this.handleMouseMove(i), this.onMouseUp = (i) => this.handleMouseUp(i), this.onMouseLeave = () => this.handleMouseLeave(), this.onScroll = this.debounce(() => this.detectCurrentSlide(), 100), this.onTouchMove = (i) => D(i, this, this.state), this.wrapper.addEventListener("mousedown", this.onMouseDown), this.wrapper.addEventListener("mousemove", this.onMouseMove), this.wrapper.addEventListener("mouseup", this.onMouseUp), this.wrapper.addEventListener("mouseleave", this.onMouseLeave), this.wrapper.addEventListener("scroll", this.onScroll), this.wrapper.addEventListener("touchstart", (i) => this.onTouchStart(i), { passive: !0 }), this.wrapper.addEventListener("touchmove", this.onTouchMove, { passive: !0 }), this.wrapper.addEventListener("touchend", (i) => this.handleMouseUp(i)), (t = this.prev) == null || t.addEventListener("click", () => this.handlePrevClick()), (e = this.next) == null || e.addEventListener("click", () => this.handleNextClick()), this.wrapper.addEventListener("slideChange", () => this.handleHeight()), window.addEventListener("resize", this.handleHeight.bind(this));
  }
  init() {
    this.preventImageDragging(), this.updateButtonState(), this.handleHeight(), this.createDots(), this.detectCurrentSlide(), this.wrapper.children.length > 1 ? this.wrapper.style.cursor = "grab" : (this.dots && (this.dots.style.display = "none"), this.prev && (this.prev.style.display = "none"), this.next && (this.next.style.display = "none")), this.element.classList.add("loaded");
  }
  preventImageDragging() {
    this.wrapper.querySelectorAll("img").forEach((e) => {
      e.setAttribute("draggable", "false"), e.addEventListener("load", () => this.handleHeight());
    });
  }
  onTouchStart(t) {
    this.isDragging = !0, this.startX = t.touches[0].pageX - this.wrapper.offsetLeft, this.scrollLeft = this.wrapper.scrollLeft, this.startY = t.touches[0].pageY, this.isVerticalScroll = !1;
  }
  handleMouseDown(t) {
    this.wrapper.children.length > 1 && (E(t, this, this.state), this.isScrolling = !1, this.wrapper.style.cursor = "grabbing");
  }
  handleMouseUp(t) {
    this.wrapper.children.length > 1 && (y(this, this.state), this.isScrolling || this.handleSlideChange(), this.isScrolling = !1, this.wrapper.style.cursor = "grab");
  }
  handleMouseLeave() {
    this.wrapper.children.length > 1 && (C(this, this.state), this.wrapper.style.cursor = "grab");
  }
  handleMouseMove(t) {
    b(t, this, this.state), this.isScrolling = !0;
  }
  detectCurrentSlide() {
    const t = this.wrapper.children[0].offsetWidth, e = Math.floor(this.wrapper.offsetWidth / t), i = Math.round(this.wrapper.scrollLeft / t), o = i + e - 1;
    i !== this.state.currentSlide ? (this.state.currentSlide = i, this.state.visibleSlides = e, this.updateAriaHidden(), this.updateButtonState(), this.updateActiveDot(i, o), this.triggerSlideChangeEvent(i)) : this.updateButtonState();
  }
  handleSlideChange() {
    const t = Math.round(this.wrapper.scrollLeft / this.wrapper.offsetWidth);
    t !== this.state.currentSlide && (this.state.currentSlide = t, this.updateAriaHidden(), this.updateButtonState(), this.triggerSlideChangeEvent(t), this.handleHeight());
  }
  updateAriaHidden() {
    const t = Array.from(this.wrapper.children), e = t[0].offsetWidth, i = Math.floor(this.wrapper.offsetWidth / e), o = this.state.currentSlide;
    t.forEach((l, r) => {
      r >= o && r < o + i ? l.setAttribute("aria-hidden", "false") : l.setAttribute("aria-hidden", "true");
    });
  }
  triggerSlideChangeEvent(t) {
    const e = new CustomEvent("slideChange", { detail: { slideIndex: t } });
    this.wrapper.dispatchEvent(e), this.options.onSlideChange && this.options.onSlideChange(t);
  }
  handleHeight() {
    const t = this.wrapper.children[this.state.currentSlide];
    if (!t) return;
    const e = window.getComputedStyle(t), i = parseFloat(e.paddingTop) || 0, o = parseFloat(e.paddingBottom) || 0;
    let l = Array.from(t.children).reduce((r, a) => {
      const h = a, d = h.getBoundingClientRect().height, u = window.getComputedStyle(h), S = parseFloat(u.marginTop) || 0, m = parseFloat(u.marginBottom) || 0;
      return r + d + S + m;
    }, 0);
    if (l += i + o, e.display.includes("flex")) {
      const r = parseFloat(e.rowGap) || 0;
      l += r * (t.children.length - 1);
    } else if (e.display.includes("grid")) {
      const r = Array.from(t.children).reduce((a, h, d) => (a[d % e.gridTemplateColumns.split(" ").length] += h.getBoundingClientRect().height, a), Array(e.gridTemplateColumns.split(" ").length).fill(0));
      l = Math.max(...r);
    }
    this.wrapper.style.height = `${l}px`, this.wrapper.offsetHeight;
  }
  handlePrevClick() {
    this.scrollSlides(-1);
  }
  handleNextClick() {
    this.scrollSlides(1);
  }
  scrollSlides(t) {
    var o;
    const e = ((o = this.wrapper.children[0]) == null ? void 0 : o.offsetWidth) || 0, i = this.wrapper.scrollLeft + t * e;
    this.updateButtonState(), this.wrapper.scrollTo({ left: i, behavior: "smooth" }), this.detectCurrentSlide();
  }
  debounce(t, e) {
    let i;
    return (...o) => {
      clearTimeout(i), i = setTimeout(() => t.apply(this, o), e);
    };
  }
  updateButtonState() {
    var l, r, a;
    const t = ((l = this.wrapper.children[0]) == null ? void 0 : l.offsetWidth) || 0, e = Math.floor(this.wrapper.offsetWidth / t), o = (this.wrapper.children.length - e) * t;
    (r = this.prev) == null || r.toggleAttribute("disabled", this.wrapper.scrollLeft <= 0), (a = this.next) == null || a.toggleAttribute("disabled", this.wrapper.scrollLeft >= o);
  }
  createDots() {
    var l;
    if (!this.dots) return;
    const t = this.wrapper.children.length;
    this.dots.innerHTML = "";
    for (let r = 0; r < t; r++) {
      const a = document.createElement("button");
      a.className = "dot", a.addEventListener("click", () => this.goToSlide(r)), this.dots.appendChild(a);
    }
    const e = ((l = this.wrapper.children[0]) == null ? void 0 : l.offsetWidth) || 0, i = parseFloat(window.getComputedStyle(this.wrapper).gap) || 0, o = Math.floor(this.wrapper.offsetWidth / (e + i));
    this.state.visibleSlides = o, this.updateActiveDot(0, o - 1);
  }
  updateActiveDot(t, e) {
    if (!this.dots) return;
    const i = this.dots.querySelectorAll("button"), o = i.length, l = this.state.visibleSlides;
    i.forEach((r, a) => {
      let h = a >= t && a <= e;
      e >= o - 1 && (h = a >= o - l), r.classList.toggle("is-active", h);
    });
  }
  goToSlide(t) {
    const e = t * this.wrapper.offsetWidth;
    this.wrapper.scrollTo({ left: e, behavior: "smooth" }), this.detectCurrentSlide();
  }
  destroy() {
    this.wrapper.removeEventListener("mousedown", this.onMouseDown), this.wrapper.removeEventListener("mousemove", this.onMouseMove), this.wrapper.removeEventListener("mouseup", this.onMouseUp), this.wrapper.removeEventListener("mouseleave", this.onMouseLeave), this.wrapper.removeEventListener("scroll", this.onScroll);
  }
}
export {
  T as Snapgrab
};
