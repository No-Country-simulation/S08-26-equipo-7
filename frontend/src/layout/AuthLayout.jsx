import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";

export default function AuthLayout({ subtitle, children }) {
  return (
    <div className="relative flex flex-col items-center justify-center w-screen h-screen px-4 md:px-0 body-app">
      <div className="absolute top-0 right-0 mr-8 mt-4">
        <ThemeToggle />
      </div>
      <Logo />
      <div className="flex flex-col justify-center items-center mb-4">
        <p className="text-sm text-chart-2 text-center mt-2 font-semibold">
          { subtitle }
        </p>
      </div>
      { children }
      <p className="text-center text-xs text-muted-foreground mt-8">
          Powered by NoCountry S08-26-equipo 7<br />
Uso interno exclusivo
      </p>
    </div>
  );
}