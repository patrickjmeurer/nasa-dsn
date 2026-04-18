import type {
  DSNConfigData,
  DSNConfiguredDish,
  DSNConfiguredStation,
  DSNDishSnapshot,
  DSNSnapshot,
  DSNSpacecraftMetadata,
  DSNStationSnapshot,
} from "../types/dsn";

function parseNumber(value: string | null): number {
  if (!value) return 0;

  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeSpacecraftKey(name: string): string {
  return name.trim().toLowerCase();
}

function createConfiguredDish(node: Element): DSNConfiguredDish {
  return {
    name: node.getAttribute("name") || "",
    friendlyName: node.getAttribute("friendlyName") || node.getAttribute("name") || "",
    type: node.getAttribute("type") || "",
    isNew: node.hasAttribute("new"),
  };
}

function createSpacecraftMetadata(node: Element): DSNSpacecraftMetadata {
  return {
    name: node.getAttribute("name") || "",
    friendlyName: node.getAttribute("friendlyName") || "",
    friendlyAcronym: node.getAttribute("friendlyAcronym") || "",
    explorerName: node.getAttribute("explorerName") || "",
    thumbnail: node.getAttribute("thumbnail") === "true",
  };
}

export function parseDSNConfigXml(xml: string): DSNConfigData {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  const parserError = doc.querySelector("parsererror");

  if (parserError) {
    throw new Error("Failed to parse NASA DSN config XML");
  }

  if (!doc.documentElement || doc.documentElement.tagName !== "config") {
    throw new Error("Unexpected DSN config XML format");
  }

  const stations: DSNConfiguredStation[] = [];
  const spacecraftMap: Record<string, DSNSpacecraftMetadata> = {};

  const sitesNode = doc.documentElement.querySelector("sites");
  if (sitesNode) {
    Array.from(sitesNode.children)
      .filter((node) => node.tagName === "site")
      .forEach((site) => {
        stations.push({
          name: site.getAttribute("name") || "",
          friendlyName: site.getAttribute("friendlyName") || "",
          longitude: parseNumber(site.getAttribute("longitude")),
          latitude: parseNumber(site.getAttribute("latitude")),
          dishes: Array.from(site.children)
            .filter((node) => node.tagName === "dish")
            .map(createConfiguredDish),
        });
      });
  }

  const spacecraftNode = doc.documentElement.querySelector("spacecraftMap");
  if (spacecraftNode) {
    Array.from(spacecraftNode.children)
      .filter((node) => node.tagName === "spacecraft")
      .forEach((node) => {
        const metadata = createSpacecraftMetadata(node);
        spacecraftMap[normalizeSpacecraftKey(metadata.name)] = metadata;
      });
  }

  return { stations, spacecraftMap };
}

function createEmptyDish(configuredDish: DSNConfiguredDish): DSNDishSnapshot {
  return {
    name: configuredDish.name,
    friendlyName: configuredDish.friendlyName,
    type: configuredDish.type,
    activity: "",
    hasLiveUplink: false,
    hasLiveDownlink: false,
    status: "idle",
  };
}

function mergeDish(
  liveDish: DSNDishSnapshot | undefined,
  configuredDish: DSNConfiguredDish,
): DSNDishSnapshot {
  if (!liveDish) {
    return createEmptyDish(configuredDish);
  }

  return {
    ...liveDish,
    friendlyName: configuredDish.friendlyName,
    type: configuredDish.type,
  };
}

function mergeStation(
  liveStation: DSNStationSnapshot | undefined,
  configuredStation: DSNConfiguredStation,
): DSNStationSnapshot {
  const liveDishMap = new Map(liveStation?.dishes.map((dish) => [dish.name, dish]) || []);
  const configuredDishNames = new Set(configuredStation.dishes.map((dish) => dish.name));

  const dishes = configuredStation.dishes.map((configuredDish) =>
    mergeDish(liveDishMap.get(configuredDish.name), configuredDish),
  );

  liveStation?.dishes.forEach((dish) => {
    if (!configuredDishNames.has(dish.name)) {
      dishes.push(dish);
    }
  });

  return {
    name: configuredStation.name,
    friendlyName: configuredStation.friendlyName || liveStation?.friendlyName || "",
    longitude: configuredStation.longitude,
    latitude: configuredStation.latitude,
    dishes,
  };
}

export function mergeSnapshotWithConfig(
  liveSnapshot: DSNSnapshot,
  config: DSNConfigData,
): DSNSnapshot {
  const liveStationMap = new Map(liveSnapshot.stations.map((station) => [station.name, station]));
  const configuredStationNames = new Set(config.stations.map((station) => station.name));

  const stations = config.stations.map((station) =>
    mergeStation(liveStationMap.get(station.name), station),
  );

  liveSnapshot.stations.forEach((station) => {
    if (!configuredStationNames.has(station.name)) {
      stations.push(station);
    }
  });

  return {
    ...liveSnapshot,
    stations,
    spacecraftMap: config.spacecraftMap,
  };
}
