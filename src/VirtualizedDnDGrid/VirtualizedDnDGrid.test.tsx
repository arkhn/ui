import React from "react";
import { render, cleanup, screen } from "@testing-library/react";

/* Component to test */
import VirtualizedDnDGrid, {
  VirtualizedDnDGridProps
} from "./VirtualizedDnDGrid";

afterEach(cleanup);

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
    { dessert: "toto", calories: 58 }
  ],
  width: "100%",
  height: "400px",
  columns: [
    {
      width: 200,
      label: "Dessert",
      dataKey: "dessert",
      isDragDisabled: false
    },
    {
      width: 200,
      label: "Calories\u00A0(g)",
      dataKey: "calories",
      numeric: true
    }
  ]
};

describe("VirtualizedDnDGrid", () => {
  it("should render header & body grids", async () => {
    render(<VirtualizedDnDGrid {...props} />);
    screen.getByRole("header-grid");
    screen.getByRole("body-grid");
  });
});
