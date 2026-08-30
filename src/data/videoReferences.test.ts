import { describe, expect, it } from "vitest";
import { allVideoReferences, ELA_READ_ALOUDS, STORYLINE_BOOKS } from "./videoReferences";

describe("video references", () => {
  it("uses NC DPI–endorsed Storyline Online URLs for ELA read-alouds", () => {
    for (const ref of allVideoReferences()) {
      expect(ref.videoUrl).toMatch(/^https:\/\/storylineonline\.net\/books\//);
      expect(ref.videoUrl).not.toContain("khanacademy.org");
      expect(ref.videoUrl).not.toContain("youtube.com");
      expect(ref.videoProvider).toContain("NC DPI");
    }
  });

  it("maps every Storyline slug to a known book path", () => {
    for (const url of Object.values(STORYLINE_BOOKS)) {
      expect(url).toMatch(/^https:\/\/storylineonline\.net\/books\/[a-z0-9-]+\/$/);
    }
  });

  it("covers reading and listening ELA standards", () => {
    expect(ELA_READ_ALOUDS["RL.2.1"]).toBeTruthy();
    expect(ELA_READ_ALOUDS["RI.2.1"]).toBeTruthy();
    expect(Object.keys(ELA_READ_ALOUDS).length).toBeGreaterThan(10);
  });
});
