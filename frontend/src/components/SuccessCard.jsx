import { CircleCheck } from "lucide-react";

export default function SuccessCard({ title, message, action }) {
  return (
    <div className="my-8 flex flex-col items-center justify-center space-y-2">
      <div className="bg-success/20 text-success flex h-16 w-16 items-center justify-center rounded-full">
        <CircleCheck size={36} />
      </div>
      <div className="flex w-full justify-center text-center text-xl font-semibold">
        {title}
      </div>
      <div className="text-muted-foreground flex w-full justify-center text-center text-sm">
        {message}
      </div>
      {action}
    </div>
  );
}
