import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { formatTicketDate } from "@/lib/utils";

export default function ActivityFeed({
  timeline,
  conversation,
  onSendMessage,
}) {
  const { user } = useAuth();
  console.log(user);
  return (
    <div className="bg-card border-border order-4 rounded-lg border shadow-md">
      <div className="bg-muted-foreground/5 w-full rounded-t-lg px-2">
        <div className="border-primary w-fit border-b-2 py-4">
          <span className="text-primary text-xs font-semibold sm:text-sm">
            Historial de Trazabilidad & Conversación
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-8">
          <h3
            id="trazabilidad-title"
            className="text-muted-foreground/70 mb-3 text-sm font-semibold"
          >
            Trazabilidad
          </h3>
          <div
            className="bg-muted-foreground/5 relative rounded-lg p-4 pl-6"
            role="region"
            aria-labelledby="trazabilidad-title"
          >
            <div
              className="bg-muted-foreground/20 pointer-events-none absolute top-7 bottom-7 left-6.75 w-0.5"
              aria-hidden="true"
            />
            <div className="space-y-4">
              {timeline?.map((item, index) => (
                <article
                  key={index}
                  className="relative flex items-start gap-3"
                >
                  <div
                    className="bg-primary ring-ring relative z-10 mt-1.5 h-2 w-2 shrink-0 rounded-full ring-4"
                    aria-hidden="true"
                  />
                  <div className="flex-1 text-sm">
                    <div>
                      <span className="text-muted-foreground/70 text-xs">
                        {formatTicketDate(item.fecha)}&nbsp;&mdash;&nbsp;
                      </span>
                      <span className="text-muted-foreground text-xs font-medium">
                        {item.actorNombre}
                      </span>
                    </div>
                    <p className="text-muted-foreground/90 mt-0.5 text-xs sm:text-sm">
                      {item.descripcion}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-border">
          <h3 className="text-muted-foreground/70 mb-2 text-sm font-semibold">
            Conversación
          </h3>
          <div className="space-y-2">
            {conversation?.map((message, index) => (
              <div
                key={index}
                className="text-muted-foreground/90 bg-ring w-full space-y-1 rounded-lg p-4 text-xs sm:text-sm"
              >
                <div className="flex justify-between items-center">
                  <div className="text-muted-foreground/70 text-xs font-semibold">
                    {message.autorNombre}
                  </div>
                  <div className="text-muted-foreground/70 text-xs font-semibold">
                    {message.creadoEn && formatTicketDate(message.creadoEn)}
                  </div>
                </div>
                <div>{message.mensaje}</div>
              </div>
            ))}
          </div>
          <form
            className="mt-4 flex"
            onSubmit={(e) => {
              e.preventDefault();
              const newMessage = e.target.message.value;
              onSendMessage(newMessage);
              e.target.reset();
            }}
          >
            <Input
              placeholder="Escribe un mensaje..."
              id="message"
              name="message"
              className="w-full"
            />
            <Button
              type="submit"
              className="btn-gradient-primary ml-2 cursor-pointer py-5"
            >
              Enviar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
