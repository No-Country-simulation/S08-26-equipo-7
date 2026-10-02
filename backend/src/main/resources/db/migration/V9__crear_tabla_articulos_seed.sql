CREATE TABLE articulos (
    id UUID PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion VARCHAR(500),
    contenido TEXT,
    categoria VARCHAR(50) NOT NULL,
    visualizaciones BIGINT NOT NULL DEFAULT 0,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP NOT NULL,
    actualizado_en TIMESTAMP NOT NULL
);

INSERT INTO articulos (id, titulo, descripcion, contenido, categoria, visualizaciones, activo, creado_en, actualizado_en) VALUES
('11111111-1111-1111-1111-111111111111', 'Cómo conectar y configurar la VPN corporativa GlobalProtect',
 'Guía paso a paso para autenticación multifactor y resolución de errores comunes de certificado SSL.',
 '1. Descargue GlobalProtect desde el portal de TI.\n2. Configure la puerta de enlace: vpn.empresa.com.\n3. Inicie sesión con su usuario corporativo y complete la autenticación multifactor (MFA).\n4. Si aparece un error de certificado SSL, validar el perfil en el portal y reinstalar el cliente.\n5. Verifique el estado conectado antes de acceder a recursos internos.',
 'IT', 1400, TRUE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'Política de viáticos y reembolsos de gastos corporativos 2026',
 'Conozca los topes autorizados, plazos de presentación de comprobantes y formato de rendición.',
 'Topes autorizados según categoría de gasto y destino.\nLos comprobantes deben presentarse como máximo 15 días hábiles después del viaje.\nUse la plantilla oficial de rendición y adjunte cada factura escaneada.\nLos reembolsos se procesan en la última semana del mes.',
 'FINANCE', 850, TRUE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'Solicitud de accesos a bases de datos de producción y entornos de staging',
 'Requisitos de seguridad obligatorios y aprobación requerida por el CISO para perfiles de ingeniería.',
 'Complete el formulario de solicitud indicando el ambiente (producción o staging).\nTodo acceso a producción requiere aprobación explícita del CISO.\nLos accesos caducan cada 90 días y deben renovarse.\nProhibido compartir credenciales o usar cuentas compartidas.',
 'ACCESS', 620, TRUE, NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'Reserva de salas de reuniones ejecutivas y equipos audiovisuales',
 'Procedimiento operativo para agendamiento de auditorios principales y soporte técnico in-situ.',
 'Las salas se reservan con al menos 48 horas de anticipación por el portal.\nSolicite el soporte técnico audiovisual al menos 2 horas antes de la reunión.\nEn caso de cancelación, libere la sala para habilitar otros turnos.',
 'FACILITIES', 410, TRUE, NOW(), NOW());