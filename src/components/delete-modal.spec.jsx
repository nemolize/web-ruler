import { render } from "@testing-library/react";
import { createRef } from "react";
import { DeleteModal } from "./delete-modal";

describe("DeleteModal", () => {
  let ref;
  let onRemoveSpy;

  beforeEach(() => {
    ref = createRef();
    onRemoveSpy = jest.fn();
    render(<DeleteModal ref={ref} onRemove={onRemoveSpy} />);
  });

  test("should render component", () => {
    expect(ref.current).toBeTruthy();
  });

  test("should have show method", () => {
    expect(typeof ref.current?.show).toBe("function");
  });
});
