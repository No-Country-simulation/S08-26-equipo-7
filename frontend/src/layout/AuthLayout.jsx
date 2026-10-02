import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

export default function AuthLayout({ subtitle, children }) {
  return (
    <div className="body-app relative flex min-h-screen w-full flex-col items-center justify-center overflow-y-auto px-4 py-6 md:px-0">
      <div className="absolute top-0 right-0 mt-4 mr-8">
        <ThemeToggle />
      </div>
      <Logo />
      <div className="mb-4 flex flex-col items-center justify-center">
        <p className="text-chart-2 mt-2 text-center text-sm font-semibold">
          {subtitle}
        </p>
      </div>
      {children}
      <p className="text-muted-foreground mt-8 text-center text-xs">
        Powered by NoCountry S08-26-equipo 7<br />
        Uso interno exclusivo
      </p>
    </div>
  );
}
