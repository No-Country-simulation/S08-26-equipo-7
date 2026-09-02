import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2, LayoutDashboard } from 'lucide-react';

export default function LoginForm() {

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulamos una petición de red al backend (2 segundos)
    setTimeout(() => {
      setIsLoading(false);
      // Aquí iría el redireccionamiento al dashboard principal tras validar
      alert("Simulación: Inicio de sesión validado correctamente para " + email);
    }, 2000);
  };
  
  return (
    <div className="w-full max-w-100">
      <div className="flex flex-col items-center mb-8 space-y-2">
          <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-zinc-900/20">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-700 mt-4">
            ServiceFlow
          </h1>
          <p className="text-sm text-slate-500">
            Ingresa tus credenciales para continuar
          </p>
        </div>
    <form className="space-y-2 md:space-y-4 flex flex-col gap-4 bg-white p-8 rounded-lg shadow-md w-full max-w-md" onSubmit={handleSubmit}>
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
          disabled={isLoading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          />
      </div>
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
        <Label htmlFor="password" className="text-sm font-medium text-slate-700">
          Contraseña
        </Label>
        <a href="#" className="text-xs font-semibold text-slate-700 hover:underline underline-offset-4">
          ¿Olvidaste tu contraseña?
        </a>
        </div>
        <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
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
      <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-800 cursor-pointer" disabled={isLoading}>
              {isLoading ? (
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