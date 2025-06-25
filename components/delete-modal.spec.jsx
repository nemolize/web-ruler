import { shallow } from "enzyme";
import { createRef } from "react";
import { DeleteModal } from "./delete-modal";

const dummyTodo = { id: 1, name: "dummyTodo", done: false };

describe("DeleteModal", () => {
  let wrapper;
  let ref;
  let onRemoveSpy;

  beforeEach(() => {
    ref = createRef();
    onRemoveSpy = jest.fn();
    wrapper = shallow(<DeleteModal ref={ref} onRemove={onRemoveSpy} />);
  });

  describe("show", () => {
    test("should not render DOM before without calling show()", () => {
      expect(wrapper.find(".modal.is-active").exists()).toBeFalsy();
    });

    test("should render DOM after calling show()", () => {
      ref.current.show(dummyTodo);
      expect(wrapper.find(".modal.is-active").exists()).toBeTruthy();
    });
  });

  test("should call onRemove on click remove button", () => {
    ref.current.show(dummyTodo);
    wrapper
      .find("button")
      .filterWhere((b) => b.text() === "Delete")
      .simulate("click");
    expect(onRemoveSpy).toBeCalledWith(dummyTodo);
  });
  describe("removeTarget", () => {
    describe("should be cleared", () => {
      beforeEach(() => ref.current.show(dummyTodo));
      test("on click cancel button", () => {
        wrapper
          .find("button")
          .filterWhere((b) => b.text() === "Cancel")
          .simulate("click");
      });
      test("on click close button", () => {
        wrapper
          .find("button")
          .filterWhere((b) => b.text() === "Cancel")
          .simulate("click");
      });

      afterEach(() =>
        expect(wrapper.find(".modal.is-active").exists()).toBeFalsy(),
      );
    });
  });
});
