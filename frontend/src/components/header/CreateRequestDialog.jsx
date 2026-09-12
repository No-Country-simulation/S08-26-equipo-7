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
            <Button className="btn-gradient-primary cursor-pointer">
              <Plus />
              {}
          Nueva Solicitud
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