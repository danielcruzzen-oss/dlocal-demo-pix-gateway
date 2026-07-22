'use strict';

const client = require('prom-client');

const bacenLatency = new client.Histogram({
  name: 'pix_bacen_request_duration_seconds',
  help: 'BACEN SPI request duration in seconds',
  labelNames: ['partner_bank', 'result'],
  buckets: [0.1, 0.5, 1, 2, 3, 5, 10, 30],
});

const dispatcherErrors = new client.Counter({
  name: 'pix_dispatcher_errors_total',
  help: 'Total dispatcher errors',
  labelNames: ['reason'],
});

module.exports = { bacenLatency, dispatcherErrors };
