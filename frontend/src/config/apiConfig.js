// TEMPORAL: configuración para simular la latencia de una API real durante las pruebas.
// Cuando ya no se necesite el delay, elimina este archivo y la importación/llamada
// de waitForApiDelay en src/services/apiService.js.
const configuredDelay = Number(import.meta.env.VITE_API_DELAY_MS);

export const API_DELAY_MS = Number.isFinite(configuredDelay)
  ? Math.max(0, configuredDelay)
  : 2000;

export const API_DELAY_ENABLED = import.meta.env.VITE_API_DELAY_ENABLED !== "false";

export function waitForApiDelay() {
  if (!API_DELAY_ENABLED || API_DELAY_MS === 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => setTimeout(resolve, API_DELAY_MS));
}
