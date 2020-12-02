import React from "react";
import SelectableTable, {
  TableDataType,
  SelectableTableProps
} from "./SelectableTable";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react/types-6-0";

export default {
  title: "SelectableTable",
  component: SelectableTable,
  argTypes: {
    numberOfRows: { control: { type: "number", min: 0, max: 100, step: 1 } },
    rows: { contol: "none" }
  }
} as Meta;

const createRowData = (numberOfRows: number): TableDataType[] => {
  const data = [];

  for (let i = 0; i < numberOfRows; i++) {
    const numberOfDocuments = Math.round(Math.random() * 100);
    data.push({
      name: `row ${i + 1}`,
      id: i.toString(),
      documents: [],
      numberOfDocs: numberOfDocuments
    });
  }

  return data.map((item, index, array) => ({
    ...item,
    parentId: index > 0 ? array[index - 1].id : null
  }));
};

const Template: Story<SelectableTableProps & { numberOfRows: number }> = ({
  columns,
  numberOfRows,
  buttons,
  tableTitle,
  toolBarDynamicTitle,
  focusedRowId,
  selectedRowIds,
  rows
}) => {
  const [stateFocusedRowId, setFocusedRowId] = React.useState<string | null>(
    focusedRowId
  );
  const [stateSelectedRowIds, setSelectedRowIds] = React.useState<string[]>([]);
  const [stateRows, setRows] = React.useState(createRowData(numberOfRows));

  React.useEffect(() => {
    setRows(createRowData(numberOfRows));
  }, [numberOfRows]);

  React.useEffect(() => {
    setRows(rows);
  }, [rows]);

  React.useEffect(() => {
    setFocusedRowId(focusedRowId);
  }, [focusedRowId]);

  React.useEffect(() => {
    setSelectedRowIds(selectedRowIds);
  }, [selectedRowIds]);

  const getRowParentId = (id: string) => {
    const row = stateRows.find(row => row.id === id);
    if (!row) {
      return null;
    } else {
      return row.parentId as string | null;
    }
  };

  return (
    <SelectableTable
      tableTitle={tableTitle}
      onEditRowAttribute={(id, attribute, value) =>
        action(
          `Edited attribure: ${attribute} on row with id: ${id} with new value: ${value}`
        )()
      }
      onRowClick={id => {
        setFocusedRowId(id);
        action(`Clicked on row with id: ${id}`)();
      }}
      rows={stateRows}
      focusedRowId={stateFocusedRowId}
      selectedRowIds={stateSelectedRowIds}
      onChangeSelectedRows={setSelectedRowIds}
      toolBarDynamicTitle={toolBarDynamicTitle}
      buttons={buttons}
      columns={columns}
      getRowParentId={getRowParentId}
      rowEndButtons={[
        {
          label: "Compute",
          onClick: console.log,
          disabled: false,
          variant: "contained"
        }
      ]}
    />
  );
};

export const Default = Template.bind({});

Default.args = {
  tableTitle: "Default title",
  numberOfRows: 5,
  toolBarDynamicTitle: `row(s) selected`,
  focusedRowId: null,
  selectedRowIds: [],
  rows: createRowData(5),
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
      onClick: (ids: string[]) =>
        action(`Clicked on button 1 with selected row ids: ${ids}`)(),
      disabled: false
    },
    {
      label: "Button 2",
      onClick: (ids: string[]) =>
        action(`Clicked on button 2 with selected row ids: ${ids}`)(),
      disabled: true
    }
  ]
};
