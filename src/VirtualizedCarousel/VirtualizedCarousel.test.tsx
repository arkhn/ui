import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { AutoSizer } from "react-virtualized";

/* Component to test */
import VirtualizedCarousel from "./VirtualizedCarousel";

Enzyme.configure({ adapter: new Adapter() });

describe("VirtualizedCarousel", () => {
  it("should render", () => {
    const documents = [{ source: "machin" }];
    const wrapper = shallow(
      <VirtualizedCarousel
        documentCount={documents.length}
        documentRenderer={index => documents[index]}
        onChangeDocument={() => {}}
      />
    );
    const autoSizer = wrapper.find(AutoSizer);
    expect(autoSizer).toHaveLength(1);
  });
});
