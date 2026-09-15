import * as React from "react";

import TicketsTableDesktop from "./TicketsTableDesktop";
import TicketsTableMobile from "./TicketsTableMobile";

const MOBILE_BREAKPOINT = 684;
const MOBILE_BREAKPOINT_LARGE = 790;

export default function TicketsTableManager({ isResume = false, ...props }) {
  const containerRef = React.useRef(null);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setIsMobile(entry.contentRect.width < (isResume ? MOBILE_BREAKPOINT : MOBILE_BREAKPOINT_LARGE));
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, [isResume]);

  return (
    <div ref={containerRef}>
      {isMobile ? <TicketsTableMobile {...props} /> : <TicketsTableDesktop {...props} />}
    </div>
  );
};