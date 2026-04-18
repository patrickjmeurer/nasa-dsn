import { useEffect, useState } from "react";
import { mergeSnapshotWithConfig, parseDSNConfigXml } from "../lib/dsnConfig";
import { parseDSNXml } from "../lib/dsnParser";
import type { DSNSnapshot } from "../types/dsn";

export const DSN_XML_URL = "https://eyes.nasa.gov/dsn/data/dsn.xml";
export const DSN_CONFIG_URL = "https://eyes.nasa.gov/apps/dsn-now/config.xml";
export const DSN_POLL_INTERVAL = 5000;

let dsnConfigPromise: Promise<ReturnType<typeof parseDSNConfigXml>> | undefined;

interface DsnSnapshotState {
  data: DSNSnapshot | null;
  error: Error | null;
  isLoading: boolean;
}

async function fetchDSNConfig() {
  const response = await fetch(DSN_CONFIG_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch NASA DSN config XML");
  }

  const xml = await response.text();
  return parseDSNConfigXml(xml);
}

async function getDSNConfig() {
  if (!dsnConfigPromise) {
    dsnConfigPromise = fetchDSNConfig().catch((error) => {
      dsnConfigPromise = undefined;
      throw error;
    });
  }

  return dsnConfigPromise;
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
        const fetchedAt = Date.now();
        const [config, response] = await Promise.all([
          getDSNConfig().catch(() => undefined),
          fetch(DSN_XML_URL, { cache: "no-store" }),
        ]);

        if (!response.ok) {
          throw new Error("Failed to fetch NASA DSN XML");
        }

        const xml = await response.text();
        const snapshot = parseDSNXml(xml, fetchedAt);
        const data = config ? mergeSnapshotWithConfig(snapshot, config) : snapshot;

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
