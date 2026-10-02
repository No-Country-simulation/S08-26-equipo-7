import { useEffect, useRef, useState } from "react";

import TableDepartmensDesktop from "./TableDepartmensDesktop";
import TableDepartmensMobile from "./TableDepartmensMobile";

const MOBILE_BREAKPOINT = 768;

export default function TableDepartmensManager() {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setIsMobile(entry.contentRect.width < MOBILE_BREAKPOINT);
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      {isMobile ? <TableDepartmensMobile /> : <TableDepartmensDesktop />}
    </div>
  );
}
