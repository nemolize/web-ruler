import { act, renderHook } from "@testing-library/react";
import type { DisplayMetrics } from "../useDisplayMetrics";
import { useUnit } from "../useUnit";

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

const mockDisplayMetrics: DisplayMetrics = {
  devicePixelRatio: 2,
  screenWidth: 1920,
  screenHeight: 1080,
  viewportWidth: 1920,
  viewportHeight: 1080,
  physicalDPI: 192,
  logicalDPI: 96,
  zoomLevel: 100,
  pixelsPerCm: 37.8,
  pixelsPerInch: 96,
  pixelsPerMm: 3.78,
};

describe("useUnit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should default to cm unit when no saved preference", () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useUnit(mockDisplayMetrics));

    expect(result.current.selectedUnit).toBe("cm");
    expect(result.current.unitMetrics?.unit).toBe("cm");
    expect(result.current.unitMetrics?.unitLabel).toBe("cm");
  });

  it("should load saved unit preference from localStorage", () => {
    mockLocalStorage.getItem.mockReturnValue("mm");

    const { result } = renderHook(() => useUnit(mockDisplayMetrics));

    expect(result.current.selectedUnit).toBe("mm");
    expect(result.current.unitMetrics?.unit).toBe("mm");
    expect(result.current.unitMetrics?.unitLabel).toBe("mm");
  });

  it("should change unit and save to localStorage", () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useUnit(mockDisplayMetrics));

    act(() => {
      result.current.changeUnit("in");
    });

    expect(result.current.selectedUnit).toBe("in");
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith("selectedUnit", "in");
    expect(result.current.unitMetrics?.unitLabel).toBe("in");
  });

  it("should calculate correct grid spacing for each unit", () => {
    const { result } = renderHook(() => useUnit(mockDisplayMetrics));

    // Test cm
    act(() => {
      result.current.changeUnit("cm");
    });
    expect(result.current.unitMetrics?.gridSpacing).toBe(37.8); // pixelsPerCm / (100/100)

    // Test mm
    act(() => {
      result.current.changeUnit("mm");
    });
    expect(result.current.unitMetrics?.gridSpacing).toBe(3.78); // pixelsPerMm / (100/100)

    // Test inches
    act(() => {
      result.current.changeUnit("in");
    });
    expect(result.current.unitMetrics?.gridSpacing).toBe(96); // pixelsPerInch / (100/100)
  });

  it("should return null when no metrics provided", () => {
    const { result } = renderHook(() => useUnit(null));

    expect(result.current.unitMetrics).toBeNull();
  });

  it("should ignore invalid unit from localStorage", () => {
    mockLocalStorage.getItem.mockReturnValue("invalid-unit");

    const { result } = renderHook(() => useUnit(mockDisplayMetrics));

    expect(result.current.selectedUnit).toBe("cm"); // Should default to cm
  });

  it("should calculate conversion factors correctly", () => {
    const { result } = renderHook(() => useUnit(mockDisplayMetrics));

    // Test cm conversion factor
    act(() => {
      result.current.changeUnit("cm");
    });
    expect(result.current.unitMetrics?.conversionFactor).toBe(1);

    // Test mm conversion factor
    act(() => {
      result.current.changeUnit("mm");
    });
    expect(result.current.unitMetrics?.conversionFactor).toBe(10);

    // Test inches conversion factor
    act(() => {
      result.current.changeUnit("in");
    });
    expect(result.current.unitMetrics?.conversionFactor).toBeCloseTo(
      1 / 2.54,
      5,
    );
  });
});
