INSERT INTO roles (nombre, descripcion) VALUES
    ('COLABORADOR', 'Usuario que solicita y sigue el estado de sus solicitudes'),
    ('AGENTE', 'Usuario que procesa y asigna solicitudes'),
    ('APROBADOR', 'Usuario que aprueba solicitudes o restablecimientos'),
    ('ADMIN', 'Administrador del sistema');

INSERT INTO usuarios (nombre, email, password_hash, rol_id)
SELECT 'Administrador', 'admin@serviceflow.com',
       '${admin_password_hash}',
       r.id
FROM roles r
WHERE r.nombre = 'ADMIN';
