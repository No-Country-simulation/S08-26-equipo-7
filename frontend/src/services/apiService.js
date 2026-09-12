const API_URL = import.meta.env.VITE_API_URL;
import { translateApiMessage } from "@/i18n/es/apiMessages";

function buildUrl(endpoint) {
  if (!API_URL) {
    throw new Error("La variable VITE_API_URL no está configurada");
  }

  return `${API_URL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
}

export async function apiRequest(endpoint, options = {}) {
  const { body, headers, ...requestOptions } = options;
  let response;

  try {
    response = await fetch(buildUrl(endpoint), {
      ...requestOptions,
      credentials: "include",
      headers: {
        ...(body !== undefined && { "Content-Type": "application/json" }),
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
    throw new Error(
      translateApiMessage(data?.error || data?.message, response.status),
    );
  }

  return data;
}
