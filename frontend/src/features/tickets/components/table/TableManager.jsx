import * as React from "react";

import DesktopTable from "./DesktopTable";
import MobileTable from "./MobileTable";

const MOBILE_BREAKPOINT = 684;
const MOBILE_BREAKPOINT_LARGE = 1012;

export default function TableManager({ isResume = false, ...props }) {
  const containerRef = React.useRef(null);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setIsMobile(
        entry.contentRect.width <
          (isResume ? MOBILE_BREAKPOINT : MOBILE_BREAKPOINT_LARGE),
      );
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, [isResume]);

  return (
    <div ref={containerRef}>
      {isMobile ? <MobileTable {...props} /> : <DesktopTable {...props} />}
    </div>
  );
}
