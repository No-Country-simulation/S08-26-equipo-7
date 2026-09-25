export const initialMockArticle = {
  id: 1,
  titulo: "Cómo conectar y configurar la VPN corporativa GlobalProtect",
  descripcion: "Guía paso a paso para autenticación multifactor y resolución de errores comunes de certificado SSL.",
  categoria: "IT",
  tiempoLecturaMin: 1,
  actualizadoEn: new Date(),
  satisfaccion: 0,
  megusta: 0,
  nomegusta: 0,
  layoutConfig: {
    columns: {
      left: [],
      center: [
        {
          id: 'c-steps-1',
          type: 'steps',
          title: 'Pasos Detallados',
          items: [
            "Descargue GlobalProtect desde el portal de TI.",
            "Configure la puerta de enlace: vpn.empresa.com.",
            "Inicie sesión con su usuario corporativo y complete la autenticación multifactor (MFA)."
          ]
        }
      ],
      right: []
    }
  }
};