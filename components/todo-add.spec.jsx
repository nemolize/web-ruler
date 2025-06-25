import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoAdd } from "./todo-add";

describe("TodoAdd", () => {
  const onAddSpy = jest.fn();

  beforeEach(() => {
    onAddSpy.mockClear();
    render(<TodoAdd onAdd={onAddSpy} />);
  });

  test("should disable button if input field is empty", () => {
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  test("should call onAdd on form submit", async () => {
    const user = userEvent.setup();
    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button");

    await user.type(input, "dummy name");
    await user.click(button);

    expect(onAddSpy).toHaveBeenCalledWith("dummy name");
  });
});
