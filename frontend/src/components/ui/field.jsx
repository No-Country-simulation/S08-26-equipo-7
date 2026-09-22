import { cn } from "@/lib/utils";

function FieldError({ errors, className, ...props }) {
  const messages = Array.isArray(errors)
    ? errors
    : errors?.message
      ? [errors.message]
      : typeof errors === "string"
        ? [errors]
        : [];

  if (messages.length === 0) {
    return null;
  }

  return (
    <div
      role="alert"
      className={cn("text-destructive text-sm font-medium", className)}
      {...props}
    >
      {messages.map((message, index) => (
        <p key={`${message}-${index}`}>{message}</p>
      ))}
    </div>
  );
}

export { FieldError };
