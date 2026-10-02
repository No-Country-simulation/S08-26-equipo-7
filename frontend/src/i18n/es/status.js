const STATUS = {
  PENDIENTE: "Pendiente",
  EN_PROCESO: "En Proceso",
  EN_APROBACION: "En Aprobación",
  EXPIRADO: "Expirado",
  RESUELTO: "Resuelto",
};

export function translateStatus(status) {
  return STATUS[status] ?? status;
}
