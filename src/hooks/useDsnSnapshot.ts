import { useEffect, useState } from "react";
import { parseDSNXml } from "../lib/dsnParser";
import type { DSNSnapshot } from "../types/dsn";

export const DSN_XML_URL = "https://eyes.nasa.gov/dsn/data/dsn.xml";
export const DSN_POLL_INTERVAL = 5000;

interface DsnSnapshotState {
  data: DSNSnapshot | null;
  error: Error | null;
  isLoading: boolean;
}

export function useDsnSnapshot() {
  const [state, setState] = useState<DsnSnapshotState>({
    data: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    let isActive = true;

    async function loadSnapshot() {
      try {
        const response = await fetch(DSN_XML_URL, { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Failed to fetch NASA DSN XML");
        }

        const xml = await response.text();
        const data = parseDSNXml(xml, Date.now());

        if (!isActive) return;

        setState({
          data,
          error: null,
          isLoading: false,
        });
      } catch (error) {
        if (!isActive) return;

        setState((current) => ({
          data: current.data,
          error: error instanceof Error ? error : new Error("Unknown DSN fetch error"),
          isLoading: false,
        }));
      }
    }

    loadSnapshot();
    const interval = window.setInterval(loadSnapshot, DSN_POLL_INTERVAL);

    return () => {
      isActive = false;
      window.clearInterval(interval);
    };
  }, []);

  return state;
}
