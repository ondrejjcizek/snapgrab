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
  t > 0 && i.wrapper.scrollLeft <= 0 ? c(i.wrapper, "no-more-left") : t < 0 && i.wrapper.scrollLeft >= e && c(i.wrapper, "no-more-right");
}
function c(i, t) {
  i.classList.add(t), setTimeout(() => i.classList.remove(t), 500);
}
function v(i, t, e) {
  const s = d(i);
  p(t, e, !0), e.startX = s - t.wrapper.offsetLeft, e.scrollLeft = t.wrapper.scrollLeft, u(i);
}
function S(i, t, e) {
  if (!e.isDragging) return;
  const s = d(i);
  u(i);
  const r = (s - e.startX) * 1.5;
  t.wrapper.scrollLeft = e.scrollLeft - r, g(t, r);
}
function m(i, t) {
  p(i, t, !1);
}
function L(i, t) {
  t.isDragging && p(i, t, !1);
}
function M(i, t, e) {
  if (!e.isDragging) return;
  const r = (d(i) - t.wrapper.offsetLeft - e.startX) * 3;
  t.wrapper.scrollLeft = e.scrollLeft - r, g(t, r);
}
class y {
  constructor(t, e = {}) {
    this.element = t, this.wrapper = this.element.querySelector('[data-ref="wrapper"]'), this.dots = this.element.querySelector('[data-ref="dots"]'), this.prev = this.element.querySelector('[data-ref="prev"]'), this.next = this.element.querySelector('[data-ref="next"]'), this.isDragging = !1, this.isScrolling = !1, this.startX = 0, this.scrollLeft = 0, this.startY = 0, this.isVerticalScroll = !1, this.options = e, this.state = {
      isDragging: this.isDragging,
      startX: this.startX,
      scrollLeft: this.scrollLeft,
      currentSlide: 0
    }, this.bindEvents();
  }
  bindEvents() {
    var t, e;
    this.onMouseDown = (s) => this.handleMouseDown(s), this.onMouseMove = (s) => this.handleMouseMove(s), this.onMouseUp = (s) => this.handleMouseUp(s), this.onMouseLeave = () => this.handleMouseLeave(), this.onScroll = this.debounce(() => this.detectCurrentSlide(), 100), this.onTouchMove = (s) => M(s, this, this.state), this.wrapper.addEventListener("mousedown", this.onMouseDown), this.wrapper.addEventListener("mousemove", this.onMouseMove), this.wrapper.addEventListener("mouseup", this.onMouseUp), this.wrapper.addEventListener("mouseleave", this.onMouseLeave), this.wrapper.addEventListener("scroll", this.onScroll), this.wrapper.addEventListener("touchstart", (s) => this.onTouchStart(s), { passive: !0 }), this.wrapper.addEventListener("touchmove", this.onTouchMove, { passive: !0 }), this.wrapper.addEventListener("touchend", this.onMouseUp), (t = this.prev) == null || t.addEventListener("click", () => this.handlePrevClick()), (e = this.next) == null || e.addEventListener("click", () => this.handleNextClick()), this.wrapper.addEventListener("slideChange", () => this.handleHeight()), window.addEventListener("resize", this.handleHeight.bind(this));
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
    this.wrapper.children.length > 1 && (v(t, this, this.state), this.isScrolling = !1, this.wrapper.style.cursor = "grabbing");
  }
  handleMouseUp(t) {
    this.wrapper.children.length > 1 && (m(this, this.state), this.isScrolling || this.handleSlideChange(), this.isScrolling = !1, this.wrapper.style.cursor = "grab");
  }
  handleMouseLeave() {
    this.wrapper.children.length > 1 && (L(this, this.state), this.wrapper.style.cursor = "grab");
  }
  handleMouseMove(t) {
    S(t, this, this.state), this.isScrolling = !0;
  }
  detectCurrentSlide() {
    const t = this.wrapper.children[0].offsetWidth, e = Math.floor(this.wrapper.offsetWidth / t), s = Math.round(this.wrapper.scrollLeft / t), r = s + e - 1;
    s !== this.state.currentSlide ? (this.state.currentSlide = s, this.state.visibleSlides = e, this.updateAriaHidden(), this.updateButtonState(), this.updateActiveDot(s, r), this.triggerSlideChangeEvent(s)) : this.updateButtonState();
  }
  handleSlideChange() {
    const t = Math.round(this.wrapper.scrollLeft / this.wrapper.offsetWidth);
    t !== this.state.currentSlide && (this.state.currentSlide = t, this.updateAriaHidden(), this.updateButtonState(), this.triggerSlideChangeEvent(t), this.handleHeight());
  }
  updateAriaHidden() {
    this.wrapper.querySelectorAll(".testimonial__slide").forEach((e, s) => {
      e.setAttribute("aria-hidden", s !== this.state.currentSlide);
    });
  }
  triggerSlideChangeEvent(t) {
    const e = new CustomEvent("slideChange", { detail: { slideIndex: t } });
    this.wrapper.dispatchEvent(e), this.options.onSlideChange && this.options.onSlideChange(t);
  }
  handleHeight() {
    const t = this.wrapper.children[this.state.currentSlide];
    if (!t) return;
    const e = window.getComputedStyle(t), s = parseFloat(e.paddingTop) || 0, r = parseFloat(e.paddingBottom) || 0;
    let l = Array.from(t.children).reduce((n, o) => {
      const a = o.getBoundingClientRect().height, h = window.getComputedStyle(o), f = parseFloat(h.marginTop) || 0, w = parseFloat(h.marginBottom) || 0;
      return n + a + f + w;
    }, 0);
    if (l += s + r, e.display.includes("flex")) {
      const n = parseFloat(e.rowGap) || 0;
      l += n * (t.children.length - 1);
    } else if (e.display.includes("grid")) {
      const n = Array.from(t.children).reduce((o, a, h) => (o[h % e.gridTemplateColumns.split(" ").length] += a.getBoundingClientRect().height, o), Array(e.gridTemplateColumns.split(" ").length).fill(0));
      l = Math.max(...n);
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
    var r;
    const e = ((r = this.wrapper.children[0]) == null ? void 0 : r.offsetWidth) || 0, s = this.wrapper.scrollLeft + t * e;
    this.updateButtonState(), this.wrapper.scrollTo({ left: s, behavior: "smooth" }), this.detectCurrentSlide();
  }
  debounce(t, e) {
    let s;
    return (...r) => {
      clearTimeout(s), s = setTimeout(() => t.apply(this, r), e);
    };
  }
  updateButtonState() {
    var l, n, o;
    const t = ((l = this.wrapper.children[0]) == null ? void 0 : l.offsetWidth) || 0, e = Math.floor(this.wrapper.offsetWidth / t), r = (this.wrapper.children.length - e) * t;
    (n = this.prev) == null || n.toggleAttribute("disabled", this.wrapper.scrollLeft <= 0), (o = this.next) == null || o.toggleAttribute("disabled", this.wrapper.scrollLeft >= r);
  }
  createDots() {
    var l;
    if (!this.dots) return;
    const t = this.wrapper.children.length;
    this.dots.innerHTML = "";
    for (let n = 0; n < t; n++) {
      const o = document.createElement("button");
      o.className = "dot", o.addEventListener("click", () => this.goToSlide(n)), this.dots.appendChild(o);
    }
    const e = ((l = this.wrapper.children[0]) == null ? void 0 : l.offsetWidth) || 0, s = parseFloat(window.getComputedStyle(this.wrapper).gap) || 0, r = Math.floor(this.wrapper.offsetWidth / (e + s));
    this.state.visibleSlides = r, console.log("Visible Slides on Init:", r, "Total Slides:", t), this.updateActiveDot(0, r - 1);
  }
  updateActiveDot(t, e) {
    if (!this.dots) return;
    const s = this.dots.querySelectorAll("button"), r = s.length, l = this.state.visibleSlides;
    s.forEach((n, o) => {
      let a = o >= t && o <= e;
      e >= r - 1 && (a = o >= r - l), n.classList.toggle("is-active", a);
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
  y as Snapgrab
};
