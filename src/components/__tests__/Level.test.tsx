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

describe("Level", () => {
  beforeEach(() => {
    Object.defineProperty(window, "DeviceOrientationEvent", {
      configurable: true,
      value: class DeviceOrientationEvent extends Event {},
    });
  });

  it("renders the level as a perspective 3D instrument", async () => {
    renderLevel();
    fireEvent.click(screen.getByRole("button", { name: "Level" }));

    expect(await screen.findByText("3D Bubble Level")).toBeInTheDocument();
    expect(screen.getByTestId("level-platform")).toHaveStyle({
      transformStyle: "preserve-3d",
    });
    expect(screen.getByTestId("level-platform").style.transform).toBe("");
    expect(screen.getByTestId("level-vessel")).toHaveStyle({
      transformStyle: "preserve-3d",
    });
    expect(screen.getByTestId("level-bubble")).toHaveStyle({
      transform: "translate3d(calc(-50% - 0px), calc(-50% - 0px), 18px)",
    });
  });

  it("moves only the bubble and clamps its travel", async () => {
    renderLevel();
    fireEvent.click(screen.getByRole("button", { name: "Level" }));
    await screen.findByText("3D Bubble Level");

    const fixedPartIds = [
      "level-shadow",
      "level-platform",
      "level-vessel",
      "level-target",
      "level-grid",
    ];
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
      expect(screen.getByTestId("level-bubble")).toHaveStyle({
        transform: "translate3d(calc(-50% - -45px), calc(-50% - 45px), 18px)",
      });
      expect(screen.getByText("-60.0°")).toBeInTheDocument();
      expect(screen.getByText("60.0°")).toBeInTheDocument();
      expect(screen.getByText("Horizontal: not level")).toBeInTheDocument();
      expect(screen.getByText("Vertical: not level")).toBeInTheDocument();
    });
  });
});
