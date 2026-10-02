import { useEffect, useRef, useState } from "react";

import DesktopUsersTable from "@/features/users/components/table/DesktopUsersTable";
import MobileUsersTable from "@/features/users/components/table/MobileUsersTable";

const MOBILE_BREAKPOINT = 700;

export default function UsersTableManager({ users }) {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof ResizeObserver === "undefined") return undefined;

    const observer = new ResizeObserver(([entry]) => {
      setIsMobile(entry.contentRect.width < MOBILE_BREAKPOINT);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      {isMobile ? <MobileUsersTable users={users} /> : <DesktopUsersTable users={users} />}
    </div>
  );
}
