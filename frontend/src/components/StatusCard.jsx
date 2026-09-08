import { CircleCheck } from 'lucide-react';

export default function StatustCard ({ title, message, action }){

  return(
    <div className="flex flex-col items-center justify-center space-y-2 my-8">
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-success/20 text-success">
        <CircleCheck size={36} />
      </div>
      <div className="text-xl w-full flex justify-center font-semibold text-center">
        { title }
      </div>
      <div className="text-sm w-full flex justify-center text-center text-muted-foreground">
        { message }
      </div>
      { action }
    </div>
  );
}