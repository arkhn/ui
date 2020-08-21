import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

/* Component to test */
import LabelDroppableMenu, {
  LabelDroppableMenuProps,
} from "./LabelDroppableMenu";
import PopupState from "material-ui-popup-state";

Enzyme.configure({ adapter: new Adapter() });

const props: LabelDroppableMenuProps = {
  id: "1",
  label: "test",
};

describe("VirtualizedDnDGrid", () => {
  it("should render", () => {
    const wrapper = shallow(<LabelDroppableMenu {...props} />);

    const span = wrapper.find("span");
    expect(span.text()).toEqual(props.label);
    expect(span).toHaveLength(1);

    const popupState = wrapper.find(PopupState);
    expect(popupState).toHaveLength(1);
  });
});
