import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import NavBar, { NavBarProps } from "./NavBar";
import { Toolbar } from "@material-ui/core";

Enzyme.configure({ adapter: new Adapter() });

const props: NavBarProps = {
  title: "test"
};

describe("NavBar", () => {
  it("Render Test", () => {
    const wrapper = shallow(<NavBar {...props} />);
    const toolBar = wrapper.find(Toolbar);
    console.log(toolBar.debug());
    expect(toolBar.text()).toEqual(props.title);
  });
});
