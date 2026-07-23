'use strict';

const config = require('../config/production.json');

class RedBancariaClient {
  constructor(opts = {}) {
    this.endpoint = opts.endpoint || config.red_bancaria_uy.endpoint;
    this.timeoutMs = opts.timeoutMs || config.red_bancaria_uy.timeout_ms;
    this.retryPolicy = opts.retryPolicy || config.red_bancaria_uy.retry_policy;
    this.circuitBreaker = opts.circuitBreaker;
  }

  async dispatch(transaction) {
    const controller = new AbortController();
    const timeoutHandle = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      for (let attempt = 1; attempt <= this.retryPolicy.max_attempts; attempt++) {
        try {
          const response = await fetch(`${this.endpoint}/transfer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction),
            signal: controller.signal,
          });

          if (response.ok) {
            return await response.json();
          }
          if (response.status >= 500 && attempt < this.retryPolicy.max_attempts) {
            await this._backoff(attempt);
            continue;
          }
          throw new Error(`Red Bancaria UY rechazó la solicitud: ${response.status}`);
        } catch (err) {
          if (attempt === this.retryPolicy.max_attempts) throw err;
          await this._backoff(attempt);
        }
      }
    } finally {
      clearTimeout(timeoutHandle);
    }
  }

  async _backoff(attempt) {
    const base = this.retryPolicy.backoff_ms * Math.pow(2, attempt - 1);
    const jitter = this.retryPolicy.jitter ? Math.random() * base : 0;
    await new Promise((r) => setTimeout(r, base + jitter));
  }
}

module.exports = { RedBancariaClient };
