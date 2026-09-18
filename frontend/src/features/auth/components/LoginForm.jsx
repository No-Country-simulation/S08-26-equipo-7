import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import SuccessCard from "@/components/SuccessCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { login } from "@/features/auth/services/authService.js";

async function loginAction(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const user = await login(email, password);
    return { success: true, user };
  } catch (error) {
    return { error: error.message };
  }
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { loginContext } = useAuth();
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.success) return;

    if (state.user) {
      loginContext(state.user);
    }

    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 1500);

    return () => clearTimeout(timer);
  }, [state, navigate, loginContext]);

  return (
    <div className="w-full max-w-md space-y-1 px-3 py-2">
      <Card
        className="w-full space-y-1.5 rounded-4xl p-5 shadow-md sm:p-8"
        aria-live="polite"
      >
        {state?.success ? (
          <SuccessCard
            title="¡Sesión iniciada!"
            message="Redirigiendo a tu espacio de trabajo..."
          />
        ) : (
          <form className="space-y-4" action={formAction}>
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-accent-foreground text-xs font-semibold sm:text-sm"
              >
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
                <Label
                  htmlFor="password"
                  className="text-accent-foreground text-xs font-semibold sm:text-sm"
                >
                  Contraseña
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-chart-1 cursor-pointer text-center text-xs font-semibold underline-offset-4 hover:underline sm:text-sm"
                >
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
                  className="border-border pr-10 font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 focus:outline-none"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
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
              <div
                role="alert"
                className="text-destructive mb-4 flex w-full justify-center text-sm"
              >
                {state.error}
              </div>
            )}
            <Button
              type="submit"
              className="btn-gradient-primary w-full cursor-pointer"
              disabled={isPending}
            >
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
