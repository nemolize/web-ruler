import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Level } from "../Level";

const dispatchOrientation = (beta: number, gamma: number) => {
  const event = new Event("deviceorientation");
  Object.defineProperties(event, {
    beta: { value: beta },
    gamma: { value: gamma },
  });
  window.dispatchEvent(event);
};

const renderLevel = () =>
  render(
    <MantineProvider>
      <Level />
    </MantineProvider>,
  );

const getBubbleOffsets = () => {
  const bubble = screen.getByTestId("level-bubble");
  return {
    x: Number(bubble.dataset.offsetX),
    y: Number(bubble.dataset.offsetY),
  };
};

describe("Level", () => {
  beforeEach(() => {
    Object.defineProperty(window, "DeviceOrientationEvent", {
      configurable: true,
      value: class DeviceOrientationEvent extends Event {},
    });
  });

  it("renders a fixed 2D level with a raised bubble", async () => {
    renderLevel();
    fireEvent.click(screen.getByRole("button", { name: "Level" }));

    expect(await screen.findByText("2D Bubble Level")).toBeInTheDocument();
    expect(screen.getByTestId("level-platform").style.transform).toBe("");
    expect(screen.getByTestId("level-bubble")).toHaveStyle({
      transform: "translate(calc(-50% - 0px), calc(-50% - 0px))",
    });
  });

  it("moves only the bubble and clamps travel on both axes", async () => {
    renderLevel();
    fireEvent.click(screen.getByRole("button", { name: "Level" }));
    await screen.findByText("2D Bubble Level");

    const fixedPartIds = ["level-instrument", "level-platform", "level-grid"];
    const fixedPartAttributes = fixedPartIds.map((testId) => {
      const element = screen.getByTestId(testId);
      return {
        className: element.getAttribute("class"),
        style: element.getAttribute("style"),
      };
    });

    dispatchOrientation(60, -60);

    await waitFor(() => {
      fixedPartIds.forEach((testId, index) => {
        const element = screen.getByTestId(testId);
        expect({
          className: element.getAttribute("class"),
          style: element.getAttribute("style"),
        }).toEqual(fixedPartAttributes[index]);
      });
      expect(getBubbleOffsets().x).toBeCloseTo(-25.66, 2);
      expect(getBubbleOffsets().y).toBe(45);
      expect(screen.getByText("-25.7°")).toBeInTheDocument();
      expect(screen.getByText("60.0°")).toBeInTheDocument();
      expect(screen.getByText("Left/Right: not level")).toBeInTheDocument();
      expect(screen.getByText("Front/Back: not level")).toBeInTheDocument();
    });

    dispatchOrientation(0, 60);

    await waitFor(() => {
      expect(getBubbleOffsets()).toEqual({ x: 45, y: 0 });
    });
  });

  it("keeps front/back tilt continuous across the 180 degree boundary", async () => {
    renderLevel();
    fireEvent.click(screen.getByRole("button", { name: "Level" }));
    await screen.findByText("2D Bubble Level");

    dispatchOrientation(179, 10);

    await waitFor(() => {
      expect(getBubbleOffsets().x).toBeCloseTo(-10, 2);
      expect(getBubbleOffsets().y).toBe(1);
      expect(screen.getByText("1.0°")).toBeInTheDocument();
      expect(screen.getByText("-10.0°")).toBeInTheDocument();
      expect(screen.getByText("Front/Back: level")).toBeInTheDocument();
      expect(screen.getByText("Left/Right: not level")).toBeInTheDocument();
    });

    dispatchOrientation(-179, 10);

    await waitFor(() => {
      expect(getBubbleOffsets().x).toBeCloseTo(-10, 2);
      expect(getBubbleOffsets().y).toBe(-1);
      expect(screen.getByText("-1.0°")).toBeInTheDocument();
      expect(screen.getByText("-10.0°")).toBeInTheDocument();
      expect(screen.getByText("Front/Back: level")).toBeInTheDocument();
      expect(screen.getByText("Left/Right: not level")).toBeInTheDocument();
    });
  });
});
