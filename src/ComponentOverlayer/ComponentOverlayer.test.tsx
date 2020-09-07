import React from "react";
import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import ComponentOverlayer, {
  ComponentOverlayerProps
} from "./ComponentOverlayer";

Enzyme.configure({ adapter: new Adapter() });

const props: Partial<ComponentOverlayerProps> = {
  componentToDisplay: (
    <div style={{ width: "200px", height: "200px" }} id="overlayerChild" />
  )
};

describe("ComponentOverlayer tests", () => {
  it("render when closed", () => {
    const wrapper = shallow(
      <ComponentOverlayer {...props} open={false} height={200} width={200}>
        <div style={{ width: "200px", height: "200px" }} id="child" />
      </ComponentOverlayer>
    );
    const child = wrapper.find("#child");
    const overlayerChild = wrapper.find("#overlayerChild");
    expect(child).toHaveLength(1);
    expect(overlayerChild).toHaveLength(0);
  });

  it("render when opened", () => {
    const wrapper = shallow(
      <ComponentOverlayer {...props} open={true} height={200} width={200}>
        <div style={{ width: "200px", height: "200px" }} id="child" />
      </ComponentOverlayer>
    );
    const child = wrapper.find("#child");
    const overlayerChild = wrapper.find("#overlayerChild");
    expect(child).toHaveLength(1);
    expect(overlayerChild).toHaveLength(1);
  });
});
