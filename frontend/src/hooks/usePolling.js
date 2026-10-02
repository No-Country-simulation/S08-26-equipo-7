import { useCallback, useEffect, useRef, useState } from "react";

export function usePolling({
  fetchData,
  onSuccess,
  interval = 30_000,
  enabled = true,
  showInitialLoading = true,
  reloadKey,
}) {
  const fetchDataRef = useRef(fetchData);
  const onSuccessRef = useRef(onSuccess);
  const refreshRef = useRef(null);
  const hasLoadedRef = useRef(false);
  const [loading, setLoading] = useState(showInitialLoading);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDataRef.current = fetchData;
    onSuccessRef.current = onSuccess;
  }, [fetchData, onSuccess]);

  const refresh = useCallback((showLoading = false) => {
    refreshRef.current?.(showLoading);
  }, []);

  useEffect(() => {
    if (!enabled) {
      refreshRef.current = null;
      return undefined;
    }

    let cancelled = false;
    let isFetching = false;
    let timeoutId;
    hasLoadedRef.current = false;

    function clearPoll() {
      window.clearTimeout(timeoutId);
    }

    async function runRefresh(showLoading = false) {
      if (cancelled || isFetching) return;

      isFetching = true;
      if (showLoading) setLoading(true);

      try {
        const data = await fetchDataRef.current();
        if (cancelled) return;

        hasLoadedRef.current = true;
        setError(null);
        onSuccessRef.current?.(data);
      } catch (requestError) {
        if (!cancelled) setError(requestError);
      } finally {
        isFetching = false;
        if (showLoading && !cancelled) setLoading(false);

        if (!cancelled && document.visibilityState === "visible") {
          timeoutId = window.setTimeout(() => runRefresh(), interval);
        }
      }
    }

    function handleVisibilityChange() {
      clearPoll();

      if (document.visibilityState === "visible") {
        runRefresh(showInitialLoading && !hasLoadedRef.current);
      }
    }

    refreshRef.current = runRefresh;
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (document.visibilityState === "visible") {
      runRefresh(showInitialLoading);
    }

    return () => {
      cancelled = true;
      clearPoll();
      refreshRef.current = null;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, interval, reloadKey, showInitialLoading]);

  return { loading, error, refresh };
}
