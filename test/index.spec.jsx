import { render, screen } from "@testing-library/react";
import IndexPage, { INITIAL_STATE, STORAGE_KEY } from "../pages";

const initialState = {
  list: [{ id: 1, done: false, name: "initial todo" }],
  counter: 2,
};

describe("IndexPage", () => {
  afterAll(() => localStorage.removeItem(STORAGE_KEY));

  beforeEach(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
  });

  test("should render", () => {
    render(<IndexPage />);
    expect(screen.getByText("next-todo")).toBeInTheDocument();
  });

  test("should generate initial state if localStorage value does not exist", () => {
    localStorage.removeItem(STORAGE_KEY);
    Object.assign(INITIAL_STATE, { list: [], counter: 1 });
    render(<IndexPage />);
    expect(screen.getByText("next-todo")).toBeInTheDocument();
  });

  test("should display todos from localStorage", () => {
    render(<IndexPage />);
    expect(screen.getByText("initial todo")).toBeInTheDocument();
  });
});
