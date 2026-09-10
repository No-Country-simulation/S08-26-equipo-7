import { useActionState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeftIcon } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { forgotPassword } from "@/services/authService.js";
import { Card } from "@/components/ui/card";
import StatustCard from '@/components/StatusCard';

async function forgotPassAction(prevState, formData) {
  console.log(formData);
  const email = formData.get('email');
  console.log(email);

  try {
    const result = await forgotPassword(email);
    return { success: true, message: result.message };
  } catch (error) {
    return { error: error.message };
  }
}

export default function ForgotPassForm() {

  const [state, formAction, isPending] = useActionState(forgotPassAction,null);

  return (
    <div className="w-full max-w-md space-y-1 px-3 py-2">
      <Card className="space-y-1.5 p-8 rounded-4xl shadow-md w-full" aria-live="polite">
        {state?.success ? (
          <StatustCard 
            title="¡Solicitud enviada!" 
            message="Si el correo existe, se creará un ticket automático para que puedas recuperar tu contraseña. Para más información, comunícate con el administrador." 
            action={ 
              <Link to="/login">
                <Button type="button" variant="ghost" className="w-full cursor-pointer text-muted-foreground text-md py-5">
                  <ArrowLeftIcon className="mr-2 h-4 w-4 " />
                    Volver al inicio de sesión
                </Button>
              </Link> } 
          />
        ) : (
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs sm:text-sm font-bold">
          Correo asociado a tu cuenta
              </Label>
              <p className="text-sm text-muted-foreground">
            Ingresa tu correo corporativo; si está en la base de datos, crearemos un ticket.
              </p>
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
            <Button type="submit" className="w-full btn-gradient-primary cursor-pointer" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar solicitud de recuperación"
              )}
            </Button>
            <Link to="/login">
              <Button type="button" variant="ghost" className="w-full cursor-pointer text-muted-foreground text-md py-5">
                <ArrowLeftIcon className="mr-2 h-4 w-4 " />
          Volver al inicio de sesión
              </Button>
            </Link>
          </form>
        )}
      </Card>
    </div>
  );
}
