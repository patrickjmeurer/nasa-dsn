import type {
  DSNDishSnapshot,
  DSNDishStatus,
  DSNSnapshot,
  DSNStationSnapshot,
} from "../types/dsn";

const MAINTENANCE_ACTIVITY_PATTERN = /maintenance|engineering|upgrade/i;

function parseInteger(value: string | null): number {
  if (!value) return 0;

  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? Math.trunc(parsed) : 0;
}

function getDirectChildren(parent: Element, tagName: string): Element[] {
  return Array.from(parent.children).filter((child) => child.tagName === tagName);
}

function isLiveSignal(signal: Element): boolean {
  return (
    signal.getAttribute("active") === "true" &&
    (signal.getAttribute("signalType") || "none") !== "none"
  );
}

function getDishStatus(
  activity: string,
  hasLiveUplink: boolean,
  hasLiveDownlink: boolean,
): DSNDishStatus {
  if (hasLiveUplink || hasLiveDownlink) return "active";
  if (MAINTENANCE_ACTIVITY_PATTERN.test(activity)) return "maintenance";
  return "idle";
}

function parseDish(dish: Element): DSNDishSnapshot {
  const activity = dish.getAttribute("activity") || "";
  const hasLiveUplink = getDirectChildren(dish, "upSignal").some(isLiveSignal);
  const hasLiveDownlink = getDirectChildren(dish, "downSignal").some(isLiveSignal);

  return {
    name: dish.getAttribute("name") || "",
    activity,
    hasLiveUplink,
    hasLiveDownlink,
    status: getDishStatus(activity, hasLiveUplink, hasLiveDownlink),
  };
}

function parseStation(station: Element): DSNStationSnapshot {
  return {
    name: station.getAttribute("name") || "",
    friendlyName: station.getAttribute("friendlyName") || "",
    dishes: [],
  };
}

export function parseDSNXml(xml: string, fetchedAt = Date.now()): DSNSnapshot {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  const parserError = doc.querySelector("parsererror");

  if (parserError) {
    throw new Error("Failed to parse NASA DSN XML");
  }

  if (!doc.documentElement || doc.documentElement.tagName !== "dsn") {
    throw new Error("Unexpected DSN XML format");
  }

  const stations: DSNStationSnapshot[] = [];
  let currentStation: DSNStationSnapshot | undefined;
  let sourceTimestamp = 0;

  Array.from(doc.documentElement.children).forEach((node) => {
    if (node.tagName === "station") {
      currentStation = parseStation(node);
      stations.push(currentStation);
      return;
    }

    if (node.tagName === "dish" && currentStation) {
      currentStation.dishes.push(parseDish(node));
      return;
    }

    if (node.tagName === "timestamp") {
      sourceTimestamp = parseInteger(node.textContent);
    }
  });

  return {
    sourceTimestamp,
    fetchedAt,
    stations,
  };
}
