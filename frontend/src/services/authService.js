// services/authService.js
export async function login(email, password) {
  await new Promise(r => setTimeout(r, 1000));
  if (email !== "admin@tuempresa.com" || password !== "123456") {
    throw new Error("Credenciales inválidas");
  }
  return { email };
}

export async function forgotPassword(email) {
  await new Promise(r => setTimeout(r, 1000));
  if (email.trim() === "") {
    throw new Error("El correo no puede estar vacío");
  }
  return { message: "Si el correo existe, se creará un ticket." };
}