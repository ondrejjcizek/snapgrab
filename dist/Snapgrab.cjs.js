"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});function u(s){return s.type.includes("touch")?s.touches[0].pageX:s.pageX}function p(s,t,e){t.isDragging=e,s.wrapper.style.cursor=e?"grabbing":"grab"}function f(s){s.type.includes("touch")&&s.preventDefault()}function m(s,t){const e=s.wrapper.scrollWidth-s.wrapper.clientWidth;s.wrapper.scrollLeft<=0?c(s.wrapper,"no-more-left"):s.wrapper.scrollLeft>=e&&c(s.wrapper,"no-more-right")}function c(s,t){s.classList.add(t),setTimeout(()=>s.classList.remove(t),500)}function w(s,t,e){return Math.max(t,Math.min(s,e))}function v(s,t,e){const i=u(s);p(t,e,!0),e.startX=i-t.wrapper.offsetLeft,e.scrollLeft=t.wrapper.scrollLeft,f(s)}function S(s,t,e){if(!e.isDragging)return;const i=u(s);f(s);const r=(i-e.startX)*3,a=t.wrapper.scrollWidth-t.wrapper.clientWidth;let o=e.scrollLeft-r;o=w(o,0,a),t.wrapper.scrollLeft=o,m(t)}function y(s,t){p(s,t,!1)}function L(s,t){t.isDragging&&p(s,t,!1)}function M(s,t,e){this.timeoutId=null,this.delay=t,this.remaining=t,this.callback=s,this.isPaused=!1,this.loop=e||!1,this.startTimestamp=null,this.start=function(){var i=this;this.startTimestamp=Date.now(),this.timeoutId=setTimeout(function(){i.callback(),i.loop&&i.reset()},this.remaining)},this.pause=function(){this.timeoutId&&(clearTimeout(this.timeoutId),this.timeoutId=null,this.startTimestamp!==null&&(this.remaining-=Date.now()-this.startTimestamp),this.isPaused=!0)},this.resume=function(){this.isPaused&&(this.isPaused=!1,this.start())},this.reset=function(i){this.timeoutId&&(clearTimeout(this.timeoutId),this.timeoutId=null),this.remaining=i!==void 0?i:this.delay,this.isPaused=!1,this.start()},this.destroy=function(){this.timeoutId&&clearTimeout(this.timeoutId),this.timeoutId=null,this.isPaused=!1,this.startTimestamp=null,this.remaining=this.delay},this.start()}class b{constructor(t,e={}){this.element=t,this.wrapper=this.element.querySelector('[data-ref="wrapper"]'),this.dots=this.element.querySelector('[data-ref="dots"]'),this.prev=this.element.querySelector('[data-ref="prev"]'),this.next=this.element.querySelector('[data-ref="next"]'),this.isDragging=!1,this.isScrolling=!1,this.startX=0,this.scrollLeft=0,this.startY=0,this.isVerticalScroll=!1,this.options={autoheight:!1,...e},this.hasUserInteracted=!1,this.state={isDragging:this.isDragging,startX:this.startX,scrollLeft:this.scrollLeft,currentSlide:0,visibleSlides:void 0},this.autoplay=null,this.bindEvents()}bindEvents(){this.onMouseDown=t=>{this.handleMouseDown(t),this.stopAutoplayIfNeeded()},this.onMouseMove=t=>this.handleMouseMove(t),this.onMouseUp=t=>{this.handleMouseUp(t),this.stopAutoplayIfNeeded()},this.onMouseLeave=()=>{this.handleMouseLeave(),this.stopAutoplayIfNeeded()},this.onScroll=this.debounce(()=>this.detectCurrentSlide(),100),this.wrapper.addEventListener("mousedown",this.onMouseDown),this.wrapper.addEventListener("mousemove",this.onMouseMove),this.wrapper.addEventListener("mouseup",this.onMouseUp),this.wrapper.addEventListener("mouseleave",this.onMouseLeave),this.wrapper.addEventListener("scroll",this.onScroll),this.wrapper.addEventListener("touchstart",t=>{this.onTouchStart(t),this.stopAutoplayIfNeeded()},{passive:!0}),this.wrapper.addEventListener("touchmove",t=>this.onTouchMove(t),{passive:!0}),this.wrapper.addEventListener("touchend",t=>{this.onTouchEnd(t),this.stopAutoplayIfNeeded()}),this.prev&&this.prev.addEventListener("click",()=>{this.handlePrevClick(),this.stopAutoplayIfNeeded()}),this.next&&this.next.addEventListener("click",()=>{this.handleNextClick(),this.stopAutoplayIfNeeded()}),this.wrapper.addEventListener("slideChange",()=>{this.handleHeight()}),window.addEventListener("resize",()=>this.handleHeight())}init(){this.preventImageDragging(),this.updateButtonState(),this.options.autoheight&&this.handleHeight(),this.createDots(),this.detectCurrentSlide(),this.options.autoheight&&this.handleHeight(),this.wrapper.children.length>1?this.wrapper.style.cursor="grab":(this.dots&&(this.dots.style.display="none"),this.prev&&(this.prev.style.display="none"),this.next&&(this.next.style.display="none")),this.element.classList.add("is-loaded"),this.startAutoplay()}startAutoplay(){const t=this.options.autoplay;if(!t||this.hasUserInteracted)return;const e=()=>{this.hasUserInteracted||(this.handleNextClick(),this.options.autoheight&&this.handleHeight())};this.autoplay=new M(e,t,!0)}stopAutoplay(){this.autoplay&&(this.autoplay.destroy(),this.autoplay=null)}pauseAutoplay(){this.autoplay&&this.autoplay.pause()}resumeAutoplay(){this.autoplay&&this.autoplay.resume()}stopAutoplayIfNeeded(){this.options.autoplayStopOnInteraction&&!this.hasUserInteracted&&(this.hasUserInteracted=!0,this.stopAutoplay())}preventImageDragging(){this.wrapper.querySelectorAll("img").forEach(e=>{e.setAttribute("draggable","false"),e.addEventListener("load",()=>this.handleHeight())})}onTouchStart(t){this.isDragging=!0,this.startX=t.touches[0].pageX-this.wrapper.offsetLeft,this.scrollLeft=this.wrapper.scrollLeft,this.startY=t.touches[0].pageY,this.isVerticalScroll=!1,this.handleUserInteraction()}handleMouseDown(t){this.wrapper.children.length>1&&(v(t,this,this.state),this.isScrolling=!1,this.wrapper.style.cursor="grabbing",this.handleUserInteraction())}handleMouseUp(t){this.wrapper.children.length>1&&(y(this,this.state),this.isScrolling||this.handleSlideChange(),this.isScrolling=!1,this.wrapper.style.cursor="grab",this.autoplay&&this.autoplay.reset())}handleMouseLeave(){this.wrapper.children.length>1&&(L(this,this.state),this.wrapper.style.cursor="grab")}handleMouseMove(t){S(t,this,this.state),this.isScrolling=!0}detectCurrentSlide(){const t=this.wrapper.children[0].offsetWidth,e=Math.floor(this.wrapper.offsetWidth/t),i=Math.round(this.wrapper.scrollLeft/t),r=i+e-1;i!==this.state.currentSlide?(this.state.currentSlide=i,this.state.visibleSlides=e,this.updateAriaHidden(),this.updateButtonState(),this.updateActiveDot(i,r),this.triggerSlideChangeEvent(i)):this.updateButtonState()}handleSlideChange(){const t=Math.round(this.wrapper.scrollLeft/this.wrapper.offsetWidth);t!==this.state.currentSlide&&(this.state.currentSlide=t,this.updateAriaHidden(),this.updateButtonState(),this.triggerSlideChangeEvent(t)),this.handleHeight()}updateAriaHidden(){const t=Array.from(this.wrapper.children),e=t[0].offsetWidth,i=Math.floor(this.wrapper.offsetWidth/e),r=this.state.currentSlide;t.forEach((a,o)=>{o>=r&&o<r+i?(a.setAttribute("aria-hidden","false"),a.setAttribute("aria-current","true")):(a.setAttribute("aria-hidden","true"),a.removeAttribute("aria-current"))})}triggerSlideChangeEvent(t){const e=new CustomEvent("slideChange",{detail:{slideIndex:t}});this.wrapper.dispatchEvent(e),this.options.onSlideChange&&this.options.onSlideChange(t)}handleHeight(){if(!this.options.autoheight)return;const t=Array.from(this.wrapper.children);if(!t.length)return;let e=0;t.forEach(i=>{i.style.display=""}),t.forEach(i=>{const r=window.getComputedStyle(i);if(!(i.getAttribute("aria-hidden")==="true")){let o=this.calculateSlideHeight(i);const h=parseFloat(r.minHeight)||0;o=Math.max(o,h),e=Math.max(e,o)}}),e>0?this.wrapper.style.height=`${e}px`:console.warn("Max height calculation failed; check your slide content and layout styles.")}calculateSlideHeight(t){const e=window.getComputedStyle(t),i=parseFloat(e.paddingTop)||0,r=parseFloat(e.paddingBottom)||0;let a=0;if(e.display.includes("grid")){const o=e.gridTemplateColumns.split(" ").length,h=Array(o).fill(0);Array.from(t.children).forEach((n,l)=>{const d=n.getBoundingClientRect().height;h[l%o]+=d}),a=Math.max(...h)}else if(a=Array.from(t.children).reduce((o,h)=>{const n=h.getBoundingClientRect().height,l=window.getComputedStyle(h),d=parseFloat(l.marginTop)||0,g=parseFloat(l.marginBottom)||0;return o+n+d+g},0),a+=i+r,e.display.includes("flex")){const o=parseFloat(e.rowGap)||0;a+=o*(t.children.length-1)}return a}handlePrevClick(){this.handleUserInteraction(),this.scrollSlides(-1),this.handleHeight()}handleNextClick(){this.handleUserInteraction();const t=this.wrapper.children.length,e=this.wrapper.children[0].offsetWidth||0,i=Math.floor(this.wrapper.offsetWidth/e),r=(t-i)*e;this.wrapper.scrollLeft>=r?(this.goToSlide(0),this.updateActiveDot(0,i-1)):this.scrollSlides(1),this.handleHeight()}handleUserInteraction(){this.options.autoplayStopOnInteraction&&!this.hasUserInteracted&&(this.hasUserInteracted=!0,this.stopAutoplay())}scrollSlides(t){var r;const e=((r=this.wrapper.children[0])==null?void 0:r.offsetWidth)||0,i=this.wrapper.scrollLeft+t*e;this.wrapper.scrollTo({left:i,behavior:"smooth"}),this.detectCurrentSlide(),this.handleHeight()}debounce(t,e){let i;return(...r)=>{clearTimeout(i),i=setTimeout(()=>t.apply(this,r),e)}}updateButtonState(){var a;const t=((a=this.wrapper.children[0])==null?void 0:a.offsetWidth)||0,e=Math.floor(this.wrapper.offsetWidth/t),r=(this.wrapper.children.length-e)*t;this.prev&&this.prev.toggleAttribute("disabled",this.wrapper.scrollLeft<=0),this.next&&this.next.toggleAttribute("disabled",this.wrapper.scrollLeft>=r)}createDots(){var a;if(!this.dots)return;const t=this.wrapper.children.length;this.dots.innerHTML="";for(let o=0;o<t;o++){const h=document.createElement("button");h.className="dot",h.addEventListener("click",()=>this.goToSlide(o)),this.dots.appendChild(h)}const e=((a=this.wrapper.children[0])==null?void 0:a.offsetWidth)||0,i=parseFloat(window.getComputedStyle(this.wrapper).gap)||0,r=Math.floor(this.wrapper.offsetWidth/(e+i));this.state.visibleSlides=r,this.updateActiveDot(0,r-1)}updateActiveDot(t,e){if(!this.dots)return;const i=this.dots.querySelectorAll("button"),r=i.length,a=this.state.visibleSlides;i.forEach((o,h)=>{let n=h>=t&&h<=e;e>=r-1&&(n=h>=r-a),o.classList.toggle("is-active",n)})}goToSlide(t){const e=t*this.wrapper.offsetWidth;this.wrapper.scrollTo({left:e,behavior:"smooth"}),this.detectCurrentSlide();const i=this.wrapper.children[0].offsetWidth;this.wrapper.scrollLeft=i*t,this.state.currentSlide=t,this.updateButtonState(),this.triggerSlideChangeEvent(t),this.handleHeight()}destroy(){this.wrapper.removeEventListener("mousedown",this.onMouseDown),this.wrapper.removeEventListener("mousemove",this.onMouseMove),this.wrapper.removeEventListener("mouseup",this.onMouseUp),this.wrapper.removeEventListener("mouseleave",this.onMouseLeave),this.wrapper.removeEventListener("scroll",this.onScroll)}}exports.Snapgrab=b;
