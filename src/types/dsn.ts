export type DSNDishStatus = "active" | "idle" | "maintenance";

export interface DSNSpacecraftMetadata {
  name: string;
  friendlyName: string;
  friendlyAcronym: string;
  explorerName: string;
  thumbnail: boolean;
}

export interface DSNConfiguredDish {
  name: string;
  friendlyName: string;
  type: string;
  isNew: boolean;
}

export interface DSNConfiguredStation {
  name: string;
  friendlyName: string;
  longitude: number;
  latitude: number;
  dishes: DSNConfiguredDish[];
}

export interface DSNConfigData {
  stations: DSNConfiguredStation[];
  spacecraftMap: Record<string, DSNSpacecraftMetadata>;
}

export interface DSNDishSnapshot {
  name: string;
  friendlyName: string;
  type: string;
  activity: string;
  hasLiveUplink: boolean;
  hasLiveDownlink: boolean;
  status: DSNDishStatus;
}

export interface DSNStationSnapshot {
  name: string;
  friendlyName: string;
  longitude: number;
  latitude: number;
  dishes: DSNDishSnapshot[];
}

export interface DSNSnapshot {
  sourceTimestamp: number;
  fetchedAt: number;
  stations: DSNStationSnapshot[];
  spacecraftMap: Record<string, DSNSpacecraftMetadata>;
}

export interface StationMeta {
  id: string;
  name: string;
  location: string;
  flag: string;
}

export const STATION_META: Record<string, StationMeta> = {
  gdscc: {
    id: "gdscc",
    name: "Goldstone",
    location: "California, USA",
    flag: "USA",
  },
  mdscc: {
    id: "mdscc",
    name: "Madrid",
    location: "Madrid, Spain",
    flag: "ESP",
  },
  cdscc: {
    id: "cdscc",
    name: "Canberra",
    location: "Canberra, Australia",
    flag: "AUS",
  },
};
