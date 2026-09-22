import StatCardSkeleton from "@/features/skeleton/StatCardSkeleton";

export default function StatCard({
  icon,
  label,
  value,
  text,
  color,
  variant,
  iconText,
  loading = false,
}) {
  const variantClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  };

  const iconClass = variantClasses[variant] ?? variantClasses.primary;
  const textClasses = {
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
    primary: "text-primary",
    neutro: "text-muted-foreground",
  };

  if (loading) {
    return <StatCardSkeleton label={label} />;
  }

  return (
    <div className="bg-card border-border my-2 flex w-full max-w-62.5 min-w-42 flex-col rounded-lg border p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-muted-foreground text-sm font-semibold">
          {label}
        </div>
        <div className={`rounded-md p-1 [&_svg]:size-5 ${iconClass}`}>
          {icon}
        </div>
      </div>
      <div className="mb-4 text-3xl font-bold">{value}</div>
      <div className={`flex items-center ${textClasses[color] ?? ""}`}>
        <span className="mr-1 [&_svg]:size-4">{iconText}</span>
        <span className="text-sm font-medium">{text}</span>
      </div>
    </div>
  );
}
