// TEMPORAL: elimina esta importación junto con la llamada waitForApiDelay()
// cuando ya no se necesite simular latencia en las respuestas de la API.
import { waitForApiDelay } from "@/config/apiConfig";
import { translateApiMessage } from "@/i18n/es/apiMessages";

const API_URL = import.meta.env.VITE_API_URL;

function buildUrl(endpoint) {
  if (!API_URL) {
    throw new Error("La variable VITE_API_URL no está configurada");
  }

  return `${API_URL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
}

function getCookie(name) {
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  return cookie
    ? decodeURIComponent(cookie.split("=").slice(1).join("="))
    : null;
}

function requiresCsrf(method, endpoint) {
  const normalizedEndpoint = endpoint.replace(/^\/+/, "");
  const publicEndpoints = [
    "auth/login",
    "auth/recover-password",
    "auth/logout",
  ];
  const safeMethods = ["GET", "HEAD", "OPTIONS"];

  return (
    !safeMethods.includes(method) &&
    !publicEndpoints.includes(normalizedEndpoint)
  );
}

async function ensureCsrfToken() {
  if (getCookie("XSRF-TOKEN")) {
    return;
  }

  const response = await fetch(buildUrl("auth/csrf"), {
    credentials: "include",
  });

  if (!response.ok || !getCookie("XSRF-TOKEN")) {
    throw new Error("No se pudo obtener el token de seguridad del servidor.");
  }
}

export async function apiRequest(endpoint, options = {}) {
  const { body, headers, ...requestOptions } = options;
  const method = (requestOptions.method || "GET").toUpperCase();
  const needsCsrf = requiresCsrf(method, endpoint);
  const csrfToken = needsCsrf ? getCookie("XSRF-TOKEN") : null;
  let response;

  try {
    if (needsCsrf) {
      await ensureCsrfToken();
    }

    // TEMPORAL: elimina esta línea para desactivar completamente el delay simulado.
    await waitForApiDelay();
    response = await fetch(buildUrl(endpoint), {
      ...requestOptions,
      credentials: "include",
      headers: {
        ...(body !== undefined && { "Content-Type": "application/json" }),
        ...(csrfToken && { "X-XSRF-TOKEN": csrfToken }),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error(
      "No se pudo conectar con el servidor. Comprueba que la API esté encendida y que el origen del frontend esté permitido.",
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      translateApiMessage(data?.error || data?.message, response.status),
    );
    error.status = response.status;

    const isPublicAuthEndpoint = ["auth/login", "auth/recover-password"].some(
      (publicEndpoint) => endpoint.replace(/^\/+/, "") === publicEndpoint,
    );

    if (!isPublicAuthEndpoint && response.status === 401) {
      window.dispatchEvent(new CustomEvent("auth:expired"));
    }

    throw error;
  }

  return data;
}
