# PIX Gateway Service

Payment gateway service for PIX (Brazil instant payments) integration with dLocal payment orchestration layer.

## Architecture

- **Runtime:** Node.js 20 LTS
- **Broker:** RabbitMQ (payment events)
- **Persistence:** PostgreSQL 15 (transaction ledger)
- **BACEN Integration:** SPI (Sistema de Pagamentos Instantâneos) via SICOOB partner bank

## Services

| Service | Responsibility |
|---|---|
| `pix-gateway` | Public API, request validation, orchestration |
| `pix-dispatcher` | BACEN SPI communication, retry policy |
| `pix-ledger` | Transaction persistence and reconciliation |

## Regional Ownership

- **Region:** BR (Brazil)
- **On-call rotation:** payments-br-oncall
- **SLA:** 99.95% availability, p99 <= 3000ms end-to-end

## Runbooks

See Confluence space `dLocal PIX` for incident response runbooks.
