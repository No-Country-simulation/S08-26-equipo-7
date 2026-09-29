import { Badge } from "@/components/ui/badge";

export function ApprovalBadge({ requiresApproval }) {
  if (requiresApproval) {
    return (
      <Badge className="rounded-sm bg-primary/10 px-2.5 py-1 font-semibold text-primary">
        Sí
      </Badge>
    );
  }

  return (
    <Badge className="rounded-sm bg-muted-foreground/10 px-2.5 py-1 font-semibold text-muted-foreground">
      No
    </Badge>
  );
}

export function StatusBadge({ active }) {
  if (active) {
    return (
      <Badge className="rounded-sm bg-success/10 px-2.5 py-1 font-semibold text-success">
        Activo
      </Badge>
    );
  }

  return (
    <Badge className="rounded-sm bg-destructive/10 px-2.5 py-1 font-semibold text-destructive">
      Inactivo
    </Badge>
  );
}
