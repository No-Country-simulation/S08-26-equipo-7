CREATE TABLE categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT true,
    requires_approval BOOLEAN NOT NULL DEFAULT false,
    creado_en TIMESTAMP NOT NULL DEFAULT now()
);

INSERT INTO categorias (code, name, description, active, requires_approval) VALUES
    ('IT', 'Infraestructura IT', 'Equipos, redes, VPN y sistemas', true, false),
    ('ACCESS', 'Accesos y Seguridad', 'Usuarios, permisos y credenciales', true, true),
    ('HARDWARE', 'Hardware', 'Equipos y periféricos', true, true),
    ('FACILITIES', 'Facilities y Logística', 'Espacios físicos, mantenimiento y logística', true, false),
    ('FINANCE', 'Finanzas y Compras', 'Compras, gastos y viáticos', true, true),
    ('PASSWORD_RECOVERY', 'Recuperación de contraseña', 'Interno: solicitud de restablecimiento de contraseña', false, false)
ON CONFLICT (code) DO NOTHING;