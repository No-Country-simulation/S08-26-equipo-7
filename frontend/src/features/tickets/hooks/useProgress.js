import { useEffect, useState } from "react";

function calculateProgress(createdAt, slaDueAt, now = Date.now()) {
  const inicio = new Date(createdAt).getTime();
  const vencimiento = new Date(slaDueAt).getTime();
  const duracionTotal = vencimiento - inicio;

  if (!Number.isFinite(inicio) || !Number.isFinite(vencimiento) || duracionTotal <= 0) {
    return 0;
  }

  const porcentaje = ((now - inicio) / duracionTotal) * 100;
  return Math.max(0, Math.min(porcentaje, 100));
}

function hasResolvedAt(resolvedAt) {
  return resolvedAt !== null &&
    resolvedAt !== undefined &&
    String(resolvedAt).trim() !== "";
}

function calculateResolvedProgress(createdAt, slaDueAt, resolvedAt) {
  return calculateProgress(
    createdAt,
    slaDueAt,
    new Date(resolvedAt).getTime(),
  );
}

export function useProgress(createdAt, slaDueAt, resolvedAt) {
  const isResolved = hasResolvedAt(resolvedAt);
  const [progress, setProgress] = useState(() =>
    isResolved
      ? calculateResolvedProgress(createdAt, slaDueAt, resolvedAt)
      : calculateProgress(createdAt, slaDueAt),
  );

  useEffect(() => {
    if (isResolved) return undefined;

    const actualizarProgress = () => {
      const progreso = calculateProgress(createdAt, slaDueAt);

      setProgress(progreso);

      return progreso >= 100;
    };

    if (calculateProgress(createdAt, slaDueAt) >= 100) return undefined;

    const initialUpdate = setTimeout(actualizarProgress, 0);
    const interval = setInterval(() => {
      if (actualizarProgress()) clearInterval(interval);
    }, 60000);

    return () => {
      clearTimeout(initialUpdate);
      clearInterval(interval);
    };
  }, [createdAt, isResolved, slaDueAt]);

  return progress;
}