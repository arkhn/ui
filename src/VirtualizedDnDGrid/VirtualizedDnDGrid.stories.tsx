import React from "react";
import { Paper } from "@material-ui/core";
import VirtualizedDnDGrid, {
  VirtualizedDnDGridProps,
  ColumnData,
  HeaderCellRenderer,
  HandleResizeColumn,
} from "./VirtualizedDnDGrid";
import { Meta, Story } from "@storybook/react/types-6-0";
import { TableDataType } from "../SelectableTable/SelectableTable";
import { DropResult, ResponderProvided } from "react-beautiful-dnd";
import LabelDroppableMenu from "../LabelDroppableMenu/LabelDroppableMenu";

type Sample = [string, number, number, number, number];

const sample: Sample[] = [
  ["Frozen yoghurt", 159, 6.0, 24, 4.0],
  [
    "Ice cream sandwich Ice cream sandwich Ice cream sandwich Ice cream sandwich Ice cream sandwich Ice cream sandwich Ice cream sandwich Ice cream sandwich Ice cream sandwich Ice cream sandwich Ice cream sandwich Ice cream sandwich Ice cream sandwich Ice cream sandwich Ice cream sandwich Ice cream sandwich Ice cream sandwich Ice cream sandwich Ice cream sandwich Ice cream sandwich ",
    237,
    9.0,
    37,
    4.3,
  ],
  ["Eclair", 262, 16.0, 24, 6.0],
  ["Cupcake", 305, 3.7, 67, 4.3],
  ["Gingerbread", 356, 16.0, 49, 3.9],
];

function createData(
  id: string,
  dessert: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
): TableDataType {
  return {
    id,
    dessert,
    calories,
    fat,
    carbs,
    protein,
    protein1: protein,
    protein2: protein,
    protein3: protein,
    protein4: protein,
    protein5: protein,
    protein6: protein,
    protein7: protein,
    protein8: protein,
  };
}

const rows: TableDataType[] = [];

for (let i = 0; i < 200; i += 1) {
  const randomSelection = sample[Math.floor(Math.random() * sample.length)];
  rows.push(createData(i.toString(), ...randomSelection));
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
  component: VirtualizedDnDGrid,
} as Meta;

const Template: Story<VirtualizedDnDGridProps> = (props) => {
  const [columns, setColumns] = React.useState(props.columns);
  const [selectedColumnKeys, setSelectedColumnKeys] = React.useState<string[]>(
    []
  );
  const [selectedRowIndex, setSelectedRowIndex] = React.useState<number | null>(
    null
  );
  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
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
    const newColumns = columns.map((column) => {
      return {
        ...column,
        width: dataKey === column.dataKey ? newWidth : column.width,
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
        width: width,
      }}
      {...draggableHandleProps}
    >
      <LabelDroppableMenu
        label={label}
        numeric={numeric}
        id={dataKey}
        onLabelEdited={(value) => onEditColumnName(dataKey, value)}
        onDeleteClick={() => onDeleteColumn(dataKey)}
      />
    </div>
  );
  const onEditColumnName = (dataKey: string, value: string) => {
    const newColumns = columns.map((column) => {
      return {
        ...column,
        label: column.dataKey === dataKey ? value : column.label,
      };
    });

    setColumns(newColumns);
  };

  const onDeleteColumn = (dataKey: string) => {
    const columnIndex = columns.findIndex((col) => col.dataKey === dataKey);
    const dataKeyIndex = selectedColumnKeys.findIndex((key) => key === dataKey);
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
    const dataKeyIndex = selectedColumnKeys.findIndex((key) => key === dataKey);
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

Basic.args = {
  data: rows,
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
    {
      width: 200,
      label: "Fat\u00A0(g)",
      dataKey: "fat",
      numeric: true,
    },
    {
      width: 200,
      label: "Carbs\u00A0(g)",
      dataKey: "carbs",
      numeric: true,
    },
    {
      width: 200,
      label: "Protein\u00A0(g)",
      dataKey: "protein",
      numeric: true,
    },
    {
      width: 200,
      label: "Protein\u00A0(g)",
      dataKey: "protein1",
      numeric: true,
    },
    {
      width: 200,
      label: "Protein\u00A0(g)",
      dataKey: "protein2",
      numeric: true,
    },
    {
      width: 200,
      label: "Protein\u00A0(g)",
      dataKey: "protein3",
      numeric: true,
    },
    {
      width: 200,
      label: "Protein\u00A0(g)",
      dataKey: "protein4",
      numeric: true,
    },
    {
      width: 200,
      label: "Protein\u00A0(g)",
      dataKey: "protein5",
      numeric: true,
    },
    {
      width: 200,
      label: "Protein\u00A0(g)",
      dataKey: "protein6",
      numeric: true,
    },
    {
      width: 200,
      label: "Protein\u00A0(g)",
      dataKey: "protein7",
      numeric: true,
    },
    {
      width: 200,
      label: "Protein\u00A0(g)",
      dataKey: "protein8",
      numeric: true,
    },
  ],
};
