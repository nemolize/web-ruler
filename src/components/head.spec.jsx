import { render } from "@testing-library/react";
import { Head } from "./head";

describe("Head", () => {
  test("should render component without error", () => {
    expect(() => render(<Head />)).not.toThrow();
  });

  test("should render with props without error", () => {
    expect(() =>
      render(
        <Head
          title="dummyTitle"
          description="dummyDescription"
          ogImage="dummyImage"
          url="dummyUrl"
        />,
      ),
    ).not.toThrow();
  });
});
