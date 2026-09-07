import { useActionState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeftIcon } from 'lucide-react';
import { Label } from "@/components/ui/label";

async function forgotPassAction(/*prevState, formData*/) {

  // TODO: reemplazar por llamada real a backend para enviar correo de recuperación de contraseña

  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    "success": true,
    "message": "Si el correo está registrado en el sistema, se ha generado una solicitud de recuperación al administrador."
  };
}

export default function ForgotPass() {

  const [state, formAction, isPending] = useActionState(forgotPassAction,null);

  return (
    <div className="w-full space-y-1 px-3 py-2">
      <div className="flex flex-col justify-center items-center mb-6">
        <p className="text-sm text-chart-2 text-center mt-2 font-semibold">
            Recuperación de acceso seguro.
        </p>
      </div>
      <form action={formAction} className="space-y-2 flex flex-col gap-4 bg-card p-8 rounded-4xl shadow-md w-full border border-border">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs sm:text-sm font-bold">
          Correo asociado a tu cuenta
          </Label>
          <p className="text-sm text-muted-foreground">
            Ingresa tu correo corporativo y si esta en la base de datos crearemos un ticket.
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
      {state?.success && (
        <div className="text-green-800 text-sm w-full flex justify-center mt-4 text-center">
          {state.message}
        </div>
      )}
      <p className="text-center text-xs text-slate-500 mt-8">
          Powered by NoCountry S08-26-equipo 7<br />
Uso interno exclusivo
      </p>
    </div>
  );
}
