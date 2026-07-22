'use strict';

const { BacenDispatcher } = require('./dispatcher/bacen-client');
const { Ledger } = require('./ledger/store');

const dispatcher = new BacenDispatcher();
const ledger = new Ledger();

async function handlePixTransfer(req, res) {
  const { amount, source, destination, idempotencyKey } = req.body;

  if (!amount || !source || !destination) {
    return res.status(400).json({ error: 'missing_required_fields' });
  }

  try {
    const existing = await ledger.findByIdempotencyKey(idempotencyKey);
    if (existing) return res.status(200).json(existing);

    const transaction = await ledger.create({
      amount,
      source,
      destination,
      idempotencyKey,
      status: 'pending',
    });

    const result = await dispatcher.dispatch(transaction);

    await ledger.update(transaction.id, {
      status: 'settled',
      bacenReference: result.reference,
    });

    return res.status(201).json({ id: transaction.id, status: 'settled' });
  } catch (err) {
    await ledger.update(req.body.transactionId, { status: 'failed', error: err.message });
    return res.status(502).json({ error: 'bacen_dispatch_failed' });
  }
}

module.exports = { handlePixTransfer };
