import { useCallback, useEffect, useState } from "react";

export function useSearchParams() {
  const readParams = useCallback(
    () => new URLSearchParams(window.location.search),
    []
  );
  const [params, setParams] = useState(readParams);

  useEffect(() => {
    const sync = () => setParams(readParams());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [readParams]);

  return params;
}
