import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { ScrollSync } from "react-virtualized";

/* Component to test */
import VirtualizedDnDGrid, {
  VirtualizedDnDGridProps,
} from "./VirtualizedDnDGrid";

Enzyme.configure({ adapter: new Adapter() });

const props: VirtualizedDnDGridProps = {
  rowHeight: 50,
  headerHeight: 80,
  columnWidthGetter: () => 0,
  handleResizeColumn: () => {},
  headerCellRenderer: () => {
    return null;
  },
  onDragEnd: () => {},
  selectedColumnKeys: [],
  data: [
    { dessert: "toto", calories: 58 },
    { dessert: "toto", calories: 58 },
    { dessert: "toto", calories: 58 },
    { dessert: "toto", calories: 58 },
    { dessert: "toto", calories: 58 },
  ],
  width: "100%",
  height: "400px",
  selectedRowIndex: null,
  columns: [
    {
      width: 200,
      label: "Dessert",
      dataKey: "dessert",
      isDragDisabled: false,
    },
    {
      width: 200,
      label: "Calories\u00A0(g)",
      dataKey: "calories",
      numeric: true,
    },
  ],
};

describe("VirtualizedDnDGrid", () => {
  it("should render", () => {
    const wrapper = shallow(<VirtualizedDnDGrid {...props} />);
    const scrollSync = wrapper.find(ScrollSync);
    expect(scrollSync).toHaveLength(1);
  });
});
