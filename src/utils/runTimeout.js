export function runTimeout(callback, delay, loop) {
	this.timeoutId = null
	this.delay = delay
	this.remaining = delay
	this.callback = callback
	this.isPaused = false
	this.loop = loop || false
	this.startTimestamp = null

	this.start = function() {
		var self = this
		this.startTimestamp = Date.now()
		this.timeoutId = setTimeout(function() {
			self.callback()
			if (self.loop) {
				self.reset()
			}
		}, this.remaining)
	}

	this.pause = function() {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId)
			this.timeoutId = null
			if (this.startTimestamp !== null) {
				this.remaining -= Date.now() - this.startTimestamp
			}
			this.isPaused = true
		}
	}

	this.resume = function() {
		if (this.isPaused) {
			this.isPaused = false
			this.start()
		}
	}

	this.reset = function(newDelay) {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId)
			this.timeoutId = null
		}
		this.remaining = newDelay !== undefined ? newDelay : this.delay
		this.isPaused = false
		this.start()
	}

	this.destroy = function() {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId)
		}
		this.timeoutId = null
		this.isPaused = false
		this.startTimestamp = null
		this.remaining = this.delay
	}
    
	this.start()
}