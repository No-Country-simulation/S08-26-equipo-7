import { useActionState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from 'lucide-react';

async function forgotPassAction(prevState, formData) {

  const email = formData.get('email');

  /*const response = await fetch('/api/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: { email },
    }),
  });

  if (!response.ok) {
    throw new Error('Credenciales inválidas');
  }

  return response.json();
}*/

  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    "success": true,
    "message": "Si el correo está registrado en el sistema, se ha generado una solicitud de recuperación al administrador."
  };
}

export default function ForgotPass() {

  const [state, formAction, isPending] = useActionState(forgotPassAction,null);

  return (
    <div className="w-full max-w-100">
      <div className="flex flex-col items-center mb-2">
        <p className="text-sm text-slate-500">
            Ingresa tu correo electrónico corporativo.
        </p>
      </div>
      <form action={formAction} className="space-y-2 md:space-y-4 flex flex-col gap-4 bg-white p-4 rounded-lg shadow-md w-full max-w-md">
        <div className="pt-4">
          <Input 
            type="email" 
            name="email" 
            id="email" 
            placeholder="nombre@tuempresa.com"
            required
            disabled={isPending}
            autoComplete="email"
          />
          <div className="flex justify-end align-items-center mt-2 -mb-4">
            <Link to="/login" className="text-xs font-semibold text-slate-700 hover:underline underline-offset-4 cursor-pointer">
          Regresar al inicio de sesión
            </Link>
          </div>
        </div>
        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-800 cursor-pointer" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
            </>
          ) : (
            "Enviar correo de recuperación"
          )}
        </Button>
      </form>
      {state?.success && (
        <div className="text-green-800 text-sm w-full flex justify-center mt-4 text-center">
          {state.message}
        </div>
      )}
    </div>
  );
}
