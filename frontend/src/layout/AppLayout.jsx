import ThemeToggle from "@/components/ThemeToggle";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import Header from '@/components/Header';

export default function AppLayout({ children }){

  return(
    <div className="relative flex flex-col items-center justify-center w-screen h-screen px-4 md:px-0 bg-background">
      <SidebarProvider>
        <Sidebar>
          <ThemeToggle />
          { children }
        </Sidebar>
        <Header />
      </SidebarProvider>
      
    </div>
  );
}