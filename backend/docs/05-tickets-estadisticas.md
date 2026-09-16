# Estadísticas de tickets

## GET /tickets/stats/monthly

Estadísticas para gráficas del admin. `month` opcional en formato `YYYY-MM` (default: mes actual).

```json
// respuesta 200
{
  "created": 5,
  "resolved": 3,
  "resolvedOnTime": 2,
  "resolvedLate": 1,
  "avgResolutionHours": 6.5,
  "byStatus": { "SUBMITTED": 1, "RESOLVED": 3, ... },
  "byCategory": { "IT": 2, "HARDWARE": 1, ... }
}
```

## GET /tickets/stats/summary

Resumen del dashboard del admin — tickets activos, próximos a vencer, vencidos y cumplimiento de SLA. **Solo ADMIN y SUPERVISOR** (403 para otros roles). `month` opcional en formato `YYYY-MM` (default: mes actual). Los campos con sufijo `PrevMonth` y los `*Delta` comparan contra el mes anterior.

```json
// respuesta 200
{
  "month": "2026-09",
  "activeTickets": 12,
  "activePrevMonth": 10,
  "activeDelta": 2,
  "nearSlaExpiry": 3,
  "overdueSla": 1,
  "resolved": 9,
  "resolvedPrevMonth": 7,
  "resolvedOnTime": 8,
  "resolvedOnTimePrev": 6,
  "slaCompliance": 88.9,
  "slaCompliancePrev": 85.7,
  "created": 15,
  "createdPrevMonth": 13
}
```

| Campo | Descripción |
|---|---|
| `activeTickets` | Tickets no cerrados ni resueltos (activos hoy) |
| `activePrevMonth` | Activos al cierre del mes anterior |
| `activeDelta` | `activeTickets` − `activePrevMonth` |
| `nearSlaExpiry` | Activos cuyo SLA vence dentro de las próximas **12 h** |
| `overdueSla` | Activos ya vencidos (SLA pasado, sin resolver) |
| `resolvedOnTime` | Resueltos a tiempo en el mes |
| `slaCompliance` | `resolvedOnTime / resolved × 100`, máx. 2 decimales |
| `slaCompliancePrev` | Idem para mes anterior |
| `created` / `createdPrevMonth` | Creados en el mes actual / anterior |