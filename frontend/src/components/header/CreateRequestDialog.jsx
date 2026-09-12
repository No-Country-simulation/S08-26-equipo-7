import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateRequestDialog(){
  return(
    <div>
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button
              className="btn-gradient-primary !h-8 !w-8 !rounded-md cursor-pointer overflow-hidden !p-0 sm:!h-10 sm:!w-auto sm:!px-4 md:!h-11 md:!px-6"
              size="icon-xs"
              aria-label="Nueva solicitud"
              title="Nueva solicitud"
            >
              <Plus />
              <span className="hidden sm:inline">Nueva Solicitud</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="h-11 px-6 py-2 rounded-xl cursor-pointer">Cancel</Button>
              </DialogClose>
              <Button type="submit" className="btn-gradient-primary cursor-pointer">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};