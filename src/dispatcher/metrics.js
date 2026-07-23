'use strict';

const client = require('prom-client');

const dispatchLatency = new client.Histogram({
  name: 'pagos_uy_dispatch_duration_seconds',
  help: 'Duración de las solicitudes a la Red Bancaria Uruguay en segundos',
  labelNames: ['partner_bank', 'result'],
  buckets: [0.1, 0.5, 1, 2, 3, 5, 10, 30],
});

const dispatcherErrors = new client.Counter({
  name: 'pagos_uy_dispatcher_errors_total',
  help: 'Total de errores del dispatcher',
  labelNames: ['reason'],
});

module.exports = { dispatchLatency, dispatcherErrors };
