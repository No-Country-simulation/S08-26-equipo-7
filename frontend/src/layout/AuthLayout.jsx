export default function AuthLayout({ children }) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        { children }
      </div>
    );
  }