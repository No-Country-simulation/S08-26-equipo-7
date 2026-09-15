import * as React from "react";

import TicketsTableDesktop from "./TicketsTableDesktop";
import TicketsTableMobile from "./TicketsTableMobile";

const MOBILE_BREAKPOINT = 684;

export default function TicketsTable(props) {
  const containerRef = React.useRef(null);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
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
      {isMobile ? <TicketsTableMobile {...props} /> : <TicketsTableDesktop {...props} />}
    </div>
  );
};