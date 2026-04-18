export type DSNDishStatus = "active" | "idle" | "maintenance";

export interface DSNDishSnapshot {
  name: string;
  activity: string;
  hasLiveUplink: boolean;
  hasLiveDownlink: boolean;
  status: DSNDishStatus;
}

export interface DSNStationSnapshot {
  name: string;
  friendlyName: string;
  dishes: DSNDishSnapshot[];
}

export interface DSNSnapshot {
  sourceTimestamp: number;
  fetchedAt: number;
  stations: DSNStationSnapshot[];
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
