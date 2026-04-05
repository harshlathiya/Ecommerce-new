import { describe, it, expect } from "vitest";
import { formatCurrency, slugify } from "./index.js";

describe("formatCurrency", () => {
  it("formats USD", () => {
    expect(formatCurrency(10)).toMatch(/10/);
  });
});

describe("slugify", () => {
  it("slugifies", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
  });
});
