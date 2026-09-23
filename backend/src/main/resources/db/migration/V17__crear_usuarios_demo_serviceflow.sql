-- Usuarios serviceflow (agente/solicitante/supervisor) + fix hashes demo (estaban truncos)
INSERT INTO usuarios (nombre, email, password_hash, rol_id)
SELECT 'Agente Demo', 'agente@serviceflow.com',
       '$2b$12$.Z5VtNY7bjBprLMNxUoBoOSKd.Dd4v4GwXHWuxwNqc8D/d0Ktt0fq',
       r.id FROM roles r WHERE r.nombre = 'AGENT'
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

INSERT INTO usuarios (nombre, email, password_hash, rol_id)
SELECT 'Solicitante Demo', 'solicitante@serviceflow.com',
       '$2b$12$Ndq6W4zof9IpkpQE48ki6u.SQcIWmE0qpDEF/Db8sBsslK0OYbkSi',
       r.id FROM roles r WHERE r.nombre = 'REQUESTER'
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

INSERT INTO usuarios (nombre, email, password_hash, rol_id)
SELECT 'Supervisor Demo', 'supervisor@serviceflow.com',
       '$2b$12$8Dzomzn21LJlCCzgZvz1heFp3AeaIccZeL6BClhq74tLR7l5nQ6yW',
       r.id FROM roles r WHERE r.nombre = 'SUPERVISOR'
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Fix hashes demo @demo.com (estaban truncos, ahora demo123)
UPDATE usuarios SET password_hash = '$2b$12$mrLnRRTlLQNtpFOL4OmoCuplPU0aRCcxJy6oP3xgGkSvSUECLe44u'
WHERE email LIKE '%@demo.com';
