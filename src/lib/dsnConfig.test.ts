import { describe, expect, it } from "vitest";
import configXml from "../test/fixtures/dsn-config-sample.xml?raw";
import snapshotXml from "../test/fixtures/dsn-sample.xml?raw";
import { parseDSNXml } from "./dsnParser";
import { mergeSnapshotWithConfig, parseDSNConfigXml } from "./dsnConfig";

describe("dsn config integration", () => {
  it("parses NASA site inventory and spacecraft aliases from config.xml", () => {
    const config = parseDSNConfigXml(configXml);

    expect(config.stations.find((station) => station.name === "mdscc")?.dishes.map((dish) => dish.name))
      .toEqual(["DSS63", "DSS65", "DSS53", "DSS54", "DSS55", "DSS56"]);
    expect(config.stations.find((station) => station.name === "gdscc")?.dishes.map((dish) => dish.name))
      .toEqual(["DSS14", "DSS24", "DSS25", "DSS26"]);
    expect(config.spacecraftMap.em2?.friendlyName).toBe("Human Space Flight: Artemis II");
    expect(config.spacecraftMap.em2?.friendlyAcronym).toBe("art2");
  });

  it("merges official config inventory into the live DSN snapshot", () => {
    const merged = mergeSnapshotWithConfig(
      parseDSNXml(snapshotXml, 1775695006000),
      parseDSNConfigXml(configXml),
    );

    expect(merged.stations.find((station) => station.name === "mdscc")?.dishes.map((dish) => dish.name))
      .toEqual(["DSS63", "DSS65", "DSS53", "DSS54", "DSS55", "DSS56"]);
    expect(merged.stations.find((station) => station.name === "gdscc")?.dishes.map((dish) => dish.name))
      .toEqual(["DSS14", "DSS24", "DSS25", "DSS26"]);
    expect(merged.stations.find((station) => station.name === "mdscc")?.dishes.find((dish) => dish.name === "DSS65"))
      .toMatchObject({ status: "idle", friendlyName: "DSS 65", type: "34MHEF" });
    expect(merged.spacecraftMap.em2?.friendlyName).toBe("Human Space Flight: Artemis II");
  });
});
