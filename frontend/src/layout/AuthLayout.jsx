import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";

export default function AuthLayout({ children }) {
  return (
    <div className="flex flex-col items-center justify-center w-full md:w-md px-4 md:px-0">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Logo />
      { children }
    </div>
  );
}