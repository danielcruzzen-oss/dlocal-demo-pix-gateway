'use strict';

class CircuitBreaker {
  constructor(opts = {}) {
    this.failureThreshold = opts.failureThreshold ?? 0.5;
    this.windowSeconds = opts.windowSeconds ?? 60;
    this.halfOpenAfterSeconds = opts.halfOpenAfterSeconds ?? 30;
    this.state = 'closed';
    this.samples = [];
    this.openedAt = null;
  }

  recordSuccess() {
    this._push(true);
  }

  recordFailure() {
    this._push(false);
    if (this._failureRate() >= this.failureThreshold) {
      this.state = 'open';
      this.openedAt = Date.now();
    }
  }

  canExecute() {
    if (this.state === 'closed') return true;
    if (this.state === 'open') {
      const elapsed = (Date.now() - this.openedAt) / 1000;
      if (elapsed >= this.halfOpenAfterSeconds) {
        this.state = 'half_open';
        return true;
      }
      return false;
    }
    return true;
  }

  _push(success) {
    const now = Date.now();
    this.samples.push({ ts: now, success });
    const cutoff = now - this.windowSeconds * 1000;
    this.samples = this.samples.filter((s) => s.ts >= cutoff);
  }

  _failureRate() {
    if (this.samples.length === 0) return 0;
    const failures = this.samples.filter((s) => !s.success).length;
    return failures / this.samples.length;
  }
}

module.exports = { CircuitBreaker };
