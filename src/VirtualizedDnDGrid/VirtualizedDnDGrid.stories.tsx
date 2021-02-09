import React from "react";
import { Paper } from "@material-ui/core";
import VirtualizedDnDGrid, {
  VirtualizedDnDGridProps,
  ColumnData,
  HeaderCellRenderer,
  HandleResizeColumn
} from "./VirtualizedDnDGrid";
import { Meta, Story } from "@storybook/react/types-6-0";
import { TableDataType } from "../SelectableTable/SelectableTable";
import { DropResult } from "react-beautiful-dnd";
import LabelDroppableMenu from "../LabelDroppableMenu/LabelDroppableMenu";

function createColumnAndRows(
  columnLength: number,
  dataLength: number
): { columns: ColumnData[]; data: TableDataType[] } {
  const columns: ColumnData[] = [];
  const data: TableDataType[] = [];

  for (let columnIndex = 0; columnIndex < columnLength; columnIndex++) {
    columns.push({
      width: 200,
      label: `column ${columnIndex}`,
      dataKey: `column ${columnIndex}`,
      isDragDisabled: false
    });
  }

  for (let rowIndex = 0; rowIndex < dataLength; rowIndex++) {
    data.push({
      id: `row ${rowIndex}`
    });
  }

  return { columns, data };
}

const reorderColumns = (
  columns: ColumnData[],
  startIndex: number,
  endIndex: number
) => {
  const result = [...columns];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default {
  title: "VirtualizedDnDGrid",
  component: VirtualizedDnDGrid
} as Meta;

const Template: Story<VirtualizedDnDGridProps> = props => {
  const [columns, setColumns] = React.useState(props.columns);
  const [selectedColumnKeys, setSelectedColumnKeys] = React.useState<string[]>(
    []
  );
  const [selectedRowIndex, setSelectedRowIndex] = React.useState<
    number | undefined
  >();
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const reorderedColumns = reorderColumns(
      columns,
      result.source.index,
      result.destination.index
    );
    setColumns(reorderedColumns);
  };
  const handleResizeColumn: HandleResizeColumn = ({ dataKey, newWidth }) => {
    const newColumns = columns.map(column => {
      return {
        ...column,
        width: dataKey === column.dataKey ? newWidth : column.width
      };
    });
    setColumns(newColumns);
  };
  const headerCellRenderer: HeaderCellRenderer = (
    { width, numeric, label, dataKey },
    draggableHandleProps
  ) => (
    <div
      style={{
        width
      }}
      {...draggableHandleProps}
    >
      <LabelDroppableMenu
        label={label}
        numeric={numeric}
        id={dataKey}
        onLabelEdited={value => onEditColumnName(dataKey, value)}
        onDeleteClick={() => onDeleteColumn(dataKey)}
      />
    </div>
  );
  const onEditColumnName = (dataKey: string, value: string) => {
    const newColumns = columns.map(column => {
      return {
        ...column,
        label: column.dataKey === dataKey ? value : column.label
      };
    });

    setColumns(newColumns);
  };

  const onDeleteColumn = (dataKey: string) => {
    const columnIndex = columns.findIndex(col => col.dataKey === dataKey);
    const dataKeyIndex = selectedColumnKeys.findIndex(key => key === dataKey);
    if (dataKeyIndex >= 0) {
      const newSelectedColumns = [...selectedColumnKeys];
      newSelectedColumns.splice(dataKeyIndex, 1);
      setSelectedColumnKeys(newSelectedColumns);
    }
    if (columnIndex >= 0) {
      const newColumns = [...columns];
      newColumns.splice(columnIndex, 1);
      setColumns(newColumns);
    }
  };

  const handleColumnSelect = (dataKey: string) => {
    const dataKeyIndex = selectedColumnKeys.findIndex(key => key === dataKey);
    if (dataKeyIndex >= 0) {
      const newSelectedColumns = [...selectedColumnKeys];
      newSelectedColumns.splice(dataKeyIndex, 1);
      setSelectedColumnKeys(newSelectedColumns);
    } else {
      setSelectedColumnKeys([...selectedColumnKeys, dataKey]);
    }
  };
  return (
    <Paper>
      <VirtualizedDnDGrid
        {...props}
        onDragEnd={onDragEnd}
        columns={columns}
        selectedColumnKeys={selectedColumnKeys}
        columnWidthGetter={({ index }) => columns[index].width}
        headerCellRenderer={headerCellRenderer}
        handleResizeColumn={handleResizeColumn}
        selectedRowIndex={selectedRowIndex}
        onRowClick={setSelectedRowIndex}
        onSelectHeaderCell={handleColumnSelect}
      />
    </Paper>
  );
};

export const Basic = Template.bind({});
Basic.args = { ...createColumnAndRows(100, 50) };

export const WithHighColumnNumber = Template.bind({});
WithHighColumnNumber.args = { ...createColumnAndRows(5000, 1) };
