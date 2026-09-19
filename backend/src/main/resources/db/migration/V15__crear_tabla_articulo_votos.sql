CREATE TABLE articulo_votos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    articulo_id UUID NOT NULL REFERENCES articulos(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    megusta BOOLEAN NOT NULL, -- true = útil, false = no útil
    creado_en TIMESTAMP NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_articulo_usuario_voto UNIQUE (articulo_id, usuario_id)
);

CREATE INDEX idx_articulo_votos_articulo ON articulo_votos(articulo_id);
CREATE INDEX idx_articulo_votos_usuario ON articulo_votos(usuario_id);