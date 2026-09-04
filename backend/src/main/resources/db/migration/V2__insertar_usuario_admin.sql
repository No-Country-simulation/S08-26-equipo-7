INSERT INTO roles (nombre, descripcion) VALUES
    ('COLABORADOR', 'Usuario que solicita y sigue el estado de sus solicitudes'),
    ('AGENTE', 'Usuario que procesa y asigna solicitudes'),
    ('APROBADOR', 'Usuario que aprueba solicitudes o restablecimientos'),
    ('ADMIN', 'Administrador del sistema');

INSERT INTO usuarios (nombre, email, password_hash, rol_id)
SELECT 'Administrador', 'admin@serviceflow.com',
       '$2b$10$2Xha.zPt8U1j2DgxnUOW/Omqp1Z5gA9yjqWUk/etB9wa9kSyYiRS2',
       r.id
FROM roles r
WHERE r.nombre = 'ADMIN';
