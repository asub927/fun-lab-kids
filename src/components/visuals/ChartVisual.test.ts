import { describe, expect, it } from "vitest";
import { barColorForCategory } from "./ChartVisual";

describe("barColorForCategory", () => {
  it("maps color-named categories to matching fills", () => {
    expect(barColorForCategory("Red", 0)).toBe("#d64545");
    expect(barColorForCategory("Blue", 1)).toBe("#3f73b7");
    expect(barColorForCategory("Green", 2)).toBe("#2d7e73");
  });

  it("gives non-color categories distinct fallback colors", () => {
    const cat = barColorForCategory("Cat", 0);
    const dog = barColorForCategory("Dog", 1);
    const fish = barColorForCategory("Fish", 2);
    expect(new Set([cat, dog, fish]).size).toBe(3);
  });
});
