import { useState, useActionState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { login } from "@/services/authService.js";
import { Card } from "@/components/ui/card";
import StatustCard from '@/components/StatusCard';

async function loginAction(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const user = await login(email, password);
    return { success: true, user };
  } catch (error) {
    return { error: error.message };
  }
}

export default function LoginForm() {

  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(loginAction,null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!state?.success) return;

    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 1500);

    return () => clearTimeout(timer);
  }, [state, navigate]);

  return (
    <div className="w-full max-w-md space-y-1 px-3 py-2">
      <Card className="space-y-1.5 p-8 rounded-4xl shadow-md w-full" aria-live="polite">
        {state?.success ? (
          <StatustCard title="¡Sesión iniciada!" message="Redirigiendo a tu espacio de trabajo..."  />
        ) : (
          <form className="space-y-4" action={formAction} method="POST">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs sm:text-sm font-semibold text-accent-foreground">
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
                <Label htmlFor="password" className="text-xs sm:text-sm font-semibold text-accent-foreground">
          Contraseña
                </Label>
                <Link to="/forgot-password" className="text-center text-xs sm:text-sm font-semibold hover:underline underline-offset-4 text-chart-1 cursor-pointer">
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
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
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
              <div role="alert" className="text-destructive text-sm w-full flex justify-center mb-4">
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
                "Iniciar sesión"
              )}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}