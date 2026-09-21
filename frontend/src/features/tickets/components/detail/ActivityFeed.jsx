

export default function ActivityFeed({ storyLine, message }) {
  return (
    <div className="bg-card border-border order-4 rounded-lg border shadow-md">
      <div className="bg-muted-foreground/5 w-full rounded-t-lg px-2 py-4">
        <span className="text-primary border-primary border-b-2 pb-4 text-sm font-semibold">
          Historial de Trazabilidad & Conversación
        </span>
      </div>
      <div className="p-4">
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-muted-foreground/70">Trazabilidad</h3>
          {storyLine?.map((item, index) => (
            <p key={index} className="text-sm text-muted-foreground/90">{item}</p>
          ))}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground/70">Conversación</h3>
          {message?.map((item, index) => (
            <p key={index} className="text-sm text-muted-foreground/90">{item}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
