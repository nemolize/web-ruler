import { fireEvent, render, screen } from "@testing-library/react";
import { TodoList } from "./todo-list";

const dummyTodos = [{ id: 1, name: "dummyTodo", done: false }];

describe("TodoList", () => {
  const onToggleSpy = jest.fn();
  const onClickRemoveSpy = jest.fn();

  beforeEach(() => {
    onToggleSpy.mockClear();
    onClickRemoveSpy.mockClear();
    render(
      <TodoList
        todos={dummyTodos}
        onToggle={onToggleSpy}
        onClickRemove={onClickRemoveSpy}
      />,
    );
  });

  test("should render", () => {
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  test("should render todos", () => {
    expect(screen.getByText("dummyTodo")).toBeInTheDocument();
  });

  test("should call onToggle by clicking checkbox", () => {
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(onToggleSpy).toHaveBeenCalledWith(1);
  });

  test("should call onClickRemove by clicking remove", () => {
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(onClickRemoveSpy).toHaveBeenCalledWith(dummyTodos[0]);
  });
});
