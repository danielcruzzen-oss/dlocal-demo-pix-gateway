# pagos-uy-service

Servicio de procesamiento de transferencias bancarias hacia y desde bancos uruguayos. Forma parte de la capa de orquestación de pagos de dLocal para operaciones en Uruguay.

## Descripción

Este servicio recibe solicitudes de transferencia desde el orquestador central de pagos y las traduce al protocolo de la Red Bancaria Uruguay, que interconecta a los principales bancos del país (BROU, Itaú UY, Santander UY, entre otros).

## Arquitectura

- **Runtime:** Node.js 20 LTS
- **Broker de eventos:** RabbitMQ
- **Persistencia:** PostgreSQL 15 (libro mayor de transacciones)
- **Integración externa:** Red Bancaria Uruguay vía partner banking (contrato con BROU)

## Servicios internos

| Componente | Responsabilidad |
|---|---|
| `api` | API pública, validación de solicitudes, orquestación |
| `dispatcher` | Comunicación con la Red Bancaria Uruguay, política de reintentos |
| `ledger` | Persistencia de transacciones y reconciliación |

## Propiedad del servicio

- **Región:** UY (Uruguay)
- **Rotación de guardia:** pagos-uy-oncall
- **SLA:** 99.95% disponibilidad, p99 <= 3000ms end-to-end
- **Owner del código:** equipo Payments Cono Sur

## Documentación operativa

Los runbooks de recuperación de incidentes viven en el espacio de Confluence **dLocal PIX** (se renombrará próximamente a dLocal Uruguay). Ver:

- Runbook: Recuperación de fallos en Red Bancaria Uruguay
- Postmortem Template
