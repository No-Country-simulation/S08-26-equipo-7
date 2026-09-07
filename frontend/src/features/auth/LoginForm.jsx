import { useState, useActionState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from 'lucide-react';

async function loginAction(prevState, formData) {

  const email = formData.get('email');
  const password = formData.get('password');

  // TODO: reemplazar por llamada real a backend para autenticar usuario

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
    <div className="w-full space-y-1 px-3 py-2">
      <div className="flex flex-col justify-center items-center mb-6">
        <p className="text-sm text-chart-2 text-center mt-2 font-semibold">
            Bienvenido de nuevo, organiza tu trabajo.
        </p>
      </div>
      <form className="md:space-y-4 flex flex-col gap-4 bg-card p-8 rounded-4xl shadow-md w-full border border-border" action={formAction} method="POST">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs sm:text-sm font-bold">
          Correo electrónico
          </Label>
          <Input 
            type="email" 
            name="email" 
            id="email" 
            placeholder="nombre@tuempresa.com"
            required
            disabled={isPending}
            autoComplete="email"
            className="border-border font-semibold"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs sm:text-sm font-bold">
          Contraseña
            </Label>
            <Link to="/forgot-password" className="text-center text-xs sm:text-sm font-bold hover:underline underline-offset-4 text-chart-1 cursor-pointer">
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
              placeholder="••••••••"
              className="pr-10 border-border font-semibold" // Espacio para el icono
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
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
        <Button type="submit" className="w-full btn-gradient-primary cursor-pointer" disabled={isPending}>
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
          Powered by NoCountry S08-26-equipo 7<br />
Uso interno exclusivo
      </p>
    </div>
  );
}