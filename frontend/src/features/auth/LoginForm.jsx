import { useState, useActionState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from 'lucide-react';

async function loginAction(prevState, formData) {

  const email = formData.get('email');
  const password = formData.get('password');

  /*const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: { email },
      password: { password },
    }),
  });

  if (!response.ok) {
    throw new Error('Credenciales inválidas');
  }

  return response.json();
}*/

  await new Promise(resolve => setTimeout(resolve, 2000));
  if (email !== "admin@tuempresa.com" || password !== "123456") {
    return { error: "Credenciales inválidas" };
  }

  return { success: true, message: `Bienvenido, ${email}` };
}

export default function LoginForm() {

  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(loginAction,null);


  return (
    <div className="w-full max-w-100">
      <div className="flex flex-col items-center mb-2">
        <p className="text-sm text-slate-500">
            Ingresa tus credenciales para continuar
        </p>
      </div>
      <form className="space-y-2 md:space-y-4 flex flex-col gap-4 bg-white p-8 rounded-lg shadow-md w-full max-w-md" action={formAction} method="POST">
        <div className="space-y-2.5">
          <Label htmlFor="email" className="text-sm font-medium text-slate-700">
          Correo electrónico corporativo
          </Label>
          <Input 
            type="email" 
            name="email" 
            id="email" 
            placeholder="nombre@tuempresa.com"
            required
            disabled={isPending}
            autoComplete="email"
          />
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-slate-700">
          Contraseña
            </Label>
            <Link to="/forgot-password" className="text-xs font-semibold text-slate-700 hover:underline underline-offset-4 cursor-pointer">
          ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <Input 
              id="password"
              name="password"
              type={showPassword ? "text" : "password"} 
              required
              disabled={isPending}
              autoComplete="current-password"
              className="pr-10" // Espacio para el icono
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-slate-900"
              tabIndex={-1} // Para que no interfiera en la navegación por tabulador
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        {state?.error && (
          <div className="text-rose-600 text-sm w-full flex justify-center my-0">
            {state.error}
          </div>
        )}
        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-800 cursor-pointer" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Autenticando...
            </>
          ) : (
            "Iniciar Sesión"
          )}
        </Button>
      </form>
      <p className="text-center text-xs text-slate-500 mt-8">
          ServiceFlow es un sistema de uso interno exclusivo.<br/>
          Si necesitas acceso, contacta con tu administrador de área.
      </p>
    </div>
  );
}