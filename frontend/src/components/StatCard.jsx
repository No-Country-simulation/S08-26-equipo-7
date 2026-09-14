export default function StatCard({ icon, label, value, text, color, variant, iconText }) {
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
  };

  return (
    <div className="p-4 bg-card rounded-lg shadow-md flex flex-col w-full max-w-62.5 min-w-42 my-2 border border-border">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-semibold text-muted-foreground">{label}</div>
        <div className={`[&_svg]:size-5 rounded-md p-1 ${iconClass}`}>{icon}</div>
      </div>
      <div className="text-3xl font-bold mb-4">{value}</div>
      <div className={`flex items-center ${textClasses[color] ?? ""}`}><span className="mr-1 [&_svg]:size-4">{iconText}</span><span className="text-sm font-medium">{text}</span></div>
      
    </div>
  );
}