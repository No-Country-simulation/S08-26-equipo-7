import { ArrowLeft, Compass, House } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function NotFoundPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const homePath = user ? "/dashboard" : "/login";
  const homeLabel = user ? "Ir al resumen" : "Volver al inicio de sesión";

  return (
    <main className="flex min-h-[65vh] w-full items-center justify-center px-4 py-10 sm:px-6">
      <section className="bg-card border-border relative w-full max-w-2xl overflow-hidden rounded-3xl border shadow-xl shadow-black/5">
        <div
          aria-hidden="true"
          className="bg-primary/5 pointer-events-none absolute -top-28 -right-24 size-72 rounded-full blur-3xl"
        />
        <div className="relative flex flex-col items-center px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="bg-primary/10 text-primary ring-primary/5 mb-6 flex size-16 items-center justify-center rounded-2xl ring-8">
            <Compass aria-hidden="true" className="size-8" />
          </div>
          <p className="text-primary text-sm font-bold tracking-[0.2em]">
            ERROR 404
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            No encontramos esta página
          </h1>
          <p className="text-muted-foreground mt-3 max-w-md text-sm leading-6 sm:text-base">
            Puede que el enlace esté incompleto o que la página haya cambiado de
            ubicación. Revisa la dirección o vuelve a una sección segura.
          </p>
          <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-md px-5"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft aria-hidden="true" />
              Volver atrás
            </Button>
            <Button
              asChild
              className="btn-gradient-primary h-11 rounded-md px-5"
            >
              <Link to={homePath}>
                <House aria-hidden="true" />
                {homeLabel}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
