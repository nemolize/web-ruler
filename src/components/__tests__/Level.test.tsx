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
      transform: "rotateX(0deg) rotateY(0deg)",
      transformStyle: "preserve-3d",
    });
    expect(screen.getByTestId("level-vessel")).toHaveStyle({
      transformStyle: "preserve-3d",
    });
    expect(screen.getByTestId("level-bubble")).toHaveStyle({
      transform: "translate3d(calc(-50% - 0px), calc(-50% - 0px), 18px)",
    });
  });

  it("tilts the platform and clamps the bubble travel", async () => {
    renderLevel();
    fireEvent.click(screen.getByRole("button", { name: "Level" }));
    await screen.findByText("3D Bubble Level");

    dispatchOrientation(60, -60);

    await waitFor(() => {
      expect(screen.getByTestId("level-platform")).toHaveStyle({
        transform: "rotateX(-13.5deg) rotateY(-13.5deg)",
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

  it("keeps the platform static when reduced motion is requested", async () => {
    vi.mocked(window.matchMedia).mockImplementation(
      (query) =>
        ({
          matches: query === "(prefers-reduced-motion: reduce)",
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList,
    );

    renderLevel();
    fireEvent.click(screen.getByRole("button", { name: "Level" }));
    await screen.findByText("3D Bubble Level");
    dispatchOrientation(20, -20);

    await waitFor(() => {
      expect(screen.getByTestId("level-platform")).toHaveStyle({
        transform: "rotateX(0deg) rotateY(0deg)",
      });
      expect(screen.getByTestId("level-bubble")).toHaveStyle({
        transform: "translate3d(calc(-50% - -20px), calc(-50% - 20px), 18px)",
      });
    });
  });
});
