import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

/* Component to test */
import SelectableTable, {
  SelectableTableProps,
  TableToolbar,
  SelectableTableHead
} from "./SelectableTable";
import { TableRow, TableCell } from "@material-ui/core";

Enzyme.configure({ adapter: new Adapter() });

const props: SelectableTableProps = {
  tableTitle: "Default title",
  toolBarDynamicTitle: `row(s) selected`,
  focusedRowId: null,
  selectedRowIds: [],
  rows: [
    {
      name: `row 1`,
      id: "0",
      documents: [],
      numberOfDocs: 0
    },
    {
      name: `row 2`,
      id: "1",
      documents: [],
      numberOfDocs: 0
    },
    {
      name: `row 3`,
      id: "2",
      documents: [],
      numberOfDocs: 0
    }
  ],
  columns: [
    {
      label: "Nom",
      rowAttributeKey: "name",
      align: "left",
      padding: "none",
      input: true
    },
    {
      label: "Nombre de documents",
      rowAttributeKey: "numberOfDocs",
      align: "right",
      padding: "default"
    },
    {
      label: "Id",
      rowAttributeKey: "id",
      align: "right",
      padding: "default"
    }
  ],
  buttons: [
    {
      label: "Button 1",
      onClick: () => {}
    },
    {
      label: "Button 2",
      onClick: (ids: string[]) => {}
    }
  ],
  onChangeSelectedRows: () => {},
  onEditRowAttribute: () => {},
  onRowClick: () => {}
};

describe("SelectableTable", () => {
  it("Should render", () => {
    const wrapper = shallow(<SelectableTable {...props} />);

    const tableToolbar = wrapper.find(TableToolbar);
    expect(tableToolbar).toHaveLength(1);

    const tableRows = wrapper.find(TableRow);
    expect(tableRows).toHaveLength(props.rows.length);

    const tableCells = wrapper.find(TableCell);
    expect(tableCells).toHaveLength(
      props.rows.length * props.columns.length +
        props.columns.length /** for the header cells */
    );

    const selectableTableHead = wrapper.find(SelectableTableHead);
    expect(selectableTableHead).toHaveLength(1);
  });
});
