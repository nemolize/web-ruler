import { describe, expect, it } from "vitest";

import { readPort } from "./port";

describe("readPort", () => {
  it("falls back to the default when unset or empty", () => {
    expect(readPort(undefined, "PLAYWRIGHT_PORT")).toBe(3000);
    expect(readPort("", "PLAYWRIGHT_PORT")).toBe(3000);
  });

  it("accepts a port in range", () => {
    expect(readPort("3187", "PLAYWRIGHT_PORT")).toBe(3187);
    expect(readPort("1", "PLAYWRIGHT_PORT")).toBe(1);
    expect(readPort("65535", "PLAYWRIGHT_PORT")).toBe(65535);
  });

  it("rejects a value outside the valid range", () => {
    expect(() => readPort("0", "PLAYWRIGHT_PORT")).toThrow(/from 1 to 65535/);
    expect(() => readPort("65536", "PLAYWRIGHT_PORT")).toThrow(
      /from 1 to 65535/,
    );
  });

  it("rejects anything that is not plain digits", () => {
    for (const raw of ["abc", "1e3", "0x143d", " 3000", "3000.0", "-1"]) {
      expect(() => readPort(raw, "PLAYWRIGHT_PORT")).toThrow(
        /must be an integer/,
      );
    }
  });

  it("names the caller's variable in the error", () => {
    expect(() => readPort("abc", "PLAYWRIGHT_PORT")).toThrow(
      /^PLAYWRIGHT_PORT must be/,
    );
    expect(() => readPort("abc", "E2E_PORT")).toThrow(/^E2E_PORT must be/);
  });
});
