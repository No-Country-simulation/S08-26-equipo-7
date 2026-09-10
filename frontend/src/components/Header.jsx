import ThemeToggle from "@/components/ThemeToggle";
import { Search, Bell, Plus } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";


export default function Header(){
  return(
    <div className="w-full bg-card/80 text-center h-20 border-b flex justify-between items-center px-8">
      <InputGroup className="max-w-xs border border-border">
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
      </InputGroup>
      <div className="flex space-x-2 sm:min-w-75">
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
        <div className="space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button"
                variant="ghost"
                size="icon-2xl"
                className="bg-card rounded-full flex-items justify-center border border-border cursor-pointer"
              >
                <Bell />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
            </PopoverContent>
          </Popover>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}