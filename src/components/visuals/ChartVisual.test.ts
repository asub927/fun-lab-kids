import { describe, expect, it } from "vitest";
import { barColorForCategory, barColorToken } from "./ChartVisual";

describe("barColorForCategory", () => {
  it("maps color-named categories to matching fills", () => {
    expect(barColorForCategory("Red", 0)).toBe("#e53935");
    expect(barColorForCategory("Blue", 1)).toBe("#1e88e5");
    expect(barColorForCategory("Green", 2)).toBe("#43a047");
  });

  it("gives non-color categories distinct fallback colors", () => {
    const cat = barColorForCategory("Cat", 0);
    const dog = barColorForCategory("Dog", 1);
    const fish = barColorForCategory("Fish", 2);
    expect(new Set([cat, dog, fish]).size).toBe(3);
  });
});

describe("barColorToken", () => {
  it("returns css modifier tokens for color words", () => {
    expect(barColorToken("Red", 0)).toBe("red");
    expect(barColorToken("Blue", 1)).toBe("blue");
    expect(barColorToken("Green", 2)).toBe("green");
  });
});
