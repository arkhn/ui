import React, { useState } from "react";
import clsx from "clsx";
import {
  makeStyles,
  Theme,
  createStyles,
  TableHead,
  TableRow as TableRowMui,
  TableCell,
  Checkbox,
  Paper,
  TableContainer,
  Table,
  TableBody,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Collapse
} from "@material-ui/core";
import EditInput from "../EditInput/EditInput";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

export type SelectableTableColumn = {
  /**
   * Label displayed on the column head
   */
  label: string;
  /**
   * Key of the row attribute the column is linked to
   */
  rowAttributeKey: TableDataTypeKeys;
  /**
   * Whether displaying the attribute with an input or not
   */
  input?: boolean;
  /**
   * Align attribute set to the TableCell from "@material-ui/core" library
   */
  align?: "left" | "right" | "inherit" | "center" | "justify";
  /**
   * Padding attribute set to the TableCell from "@material-ui/core" library
   */
  padding?: "none" | "checkbox" | "default";
};

export type ToolbarButton = {
  /**
   * Label displayed in the button
   */
  label: string;
  /**
   * Disabled attribute set to the Button component from "@material-ui/core" library
   */
  disabled?: boolean;
  /**
   * onClick function called when the user clicks on the button
   */
  onClick: (ids: string[]) => void;
  /**
   * Variant attribute set to the Button component from "@material-ui/core" library
   */
  variant?: "text" | "outlined" | "contained";
};

export type RowButton = {
  /**
   * Label displayed in the button
   */
  label: string;
  /**
   * Disabled attribute set to the Button component from "@material-ui/core" library
   */
  disabled?: boolean;
  /**
   * onClick function called when the user clicks on the button
   */
  onClick: (id: string) => void;
  /**
   * Variant attribute set to the Button component from "@material-ui/core" library
   */
  variant?: "text" | "outlined" | "contained";
};

interface TableHeadProps {
  classes?: ReturnType<typeof useStyles>;
  numSelected?: number;
  onSelectAllClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount?: number;
  columns: SelectableTableColumn[];
  collapsible?: boolean;
  rowEndButtonsLength?: number;
  visible?: boolean;
}

const useStyles = makeStyles(() =>
  createStyles({
    paper: {},
    table: {
      minWidth: 300
    },
    container: {
      maxHeight: "80vh"
    },
    nameCell: {
      maxWidth: "70%"
    }
  })
);

export const SelectableTableHead = (props: TableHeadProps) => {
  const {
    numSelected = 0,
    onSelectAllClick,
    rowCount = 0,
    columns,
    collapsible,
    rowEndButtonsLength,
    visible = true
  } = props;
  const endButtonCells: React.ReactNode[] = [];

  if (rowEndButtonsLength) {
    for (let i = 0; i < rowEndButtonsLength; i++) {
      endButtonCells.push(<TableCell key={`head-cell-button-${i}`} />);
    }
  }

  return (
    <TableHead
      style={{
        visibility: visible ? "inherit" : "collapse"
      }}
    >
      <TableRowMui>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all rows" }}
          />
        </TableCell>
        {collapsible && <TableCell padding="checkbox" />}
        {columns.map(column => (
          <TableCell
            align={column.align}
            padding={column.padding}
            key={`head ${column.label}`}
          >
            {column.label}
          </TableCell>
        ))}
        {endButtonCells}
      </TableRowMui>
    </TableHead>
  );
};

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: 300
    },
    highlight: {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.primary.main
    },
    title: {
      flex: "auto"
    },
    button: {
      margin: `0px ${theme.spacing(1)}px`
    },
    enabledButton: {
      backgroundColor: theme.palette.secondary.main,
      "&:hover": {
        backgroundColor: theme.palette.secondary.light
      }
    }
  })
);

interface TableToolbarProps {
  buttons: ToolbarButton[];
  tableTitle?: string;
  selectedRows: TableDataType[];
  toolBarDynamicTitle?: string;
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  selectedRows,
  tableTitle,
  buttons,
  toolBarDynamicTitle
}) => {
  const classes = useToolbarStyles();
  const numSelected = selectedRows.length;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {toolBarDynamicTitle}
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {tableTitle}
        </Typography>
      )}
      {buttons.map((button, index) => (
        <Button
          className={clsx(classes.button, {
            [classes.enabledButton]: numSelected !== 0
          })}
          variant={button.variant}
          disabled={button.disabled}
          key={`${button.label} ${index}`}
          onClick={() =>
            button.onClick(selectedRows.map(cluster => cluster.id))
          }
        >
          {button.label}
        </Button>
      ))}
    </Toolbar>
  );
};

export type TableDataType = {
  id: string;
  [key: string]: any;
};

type TableDataTypeKeys = keyof TableDataType;

type TableRowProps = {
  level?: number;
  isSelectedForPreview?: (rowId: string) => boolean;
  row: TreeTableDataType;
  onRowClick: (rowId: string) => void;
  isSelected?: (rowId: string) => boolean;
  labelId?: string;
  onClickCheckbox: (rowId: string[]) => void;
  columns: SelectableTableColumn[];
  endButtons?: RowButton[];
  collapsible?: boolean;
  onEditRowAttribute: (
    rowId: string,
    rowAttributeKey: TableDataTypeKeys,
    value: string
  ) => void;
};

const getRecursiveChildrenIds = (root: TreeTableDataType): string[] => {
  if (!root.children) {
    return [];
  }
  return [
    ...root.children.map(row => row.id),
    ...root.children.map(getRecursiveChildrenIds).flat()
  ];
};

const getRowHeight = (root: TreeTableDataType): number => {
  if (!root.children || root.children.length === 0) {
    return 0;
  }

  return 1 + Math.max(...root.children.map(getRowHeight));
};

export const TableRow: React.FC<TableRowProps> = ({
  columns,
  onClickCheckbox,
  onRowClick,
  row,
  isSelectedForPreview,
  isSelected,
  labelId,
  onEditRowAttribute,
  level = 0,
  endButtons,
  collapsible
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <TableRowMui
        hover
        selected={isSelectedForPreview && isSelectedForPreview(row.id)}
        key={row.id}
        onClick={() => {
          onRowClick(row.id);
        }}
      >
        <TableCell
          padding="checkbox"
          style={{
            paddingLeft: 4 + level * 16
          }}
        >
          <Checkbox
            checked={isSelected && isSelected(row.id)}
            inputProps={{ "aria-labelledby": labelId }}
            onClick={(event: React.MouseEvent<unknown>) => {
              event.stopPropagation();
              onClickCheckbox([row.id, ...getRecursiveChildrenIds(row)]);
            }}
          />
        </TableCell>
        {collapsible && (
          <TableCell
            padding="checkbox"
            style={{
              paddingRight: getRowHeight(row) * 16
            }}
          >
            {row.children && row.children.length > 0 && (
              <IconButton
                aria-label="expand group"
                size="small"
                onClick={event => {
                  event.stopPropagation();
                  setOpen(!open);
                }}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
          </TableCell>
        )}
        {columns.map((column, columnIndex) => {
          return column.input ? (
            <TableCell
              id={labelId}
              scope="row"
              padding={column.padding}
              align={column.align}
              key={`${column.label} ${columnIndex}`}
            >
              <EditInput
                value={row[column.rowAttributeKey]}
                onChange={value => {
                  onEditRowAttribute(row.id, column.rowAttributeKey, value);
                }}
              />
            </TableCell>
          ) : (
            <TableCell
              align={column.align}
              padding={column.padding}
              key={`${column.label} ${columnIndex} value`}
            >
              {row[column.rowAttributeKey]}
            </TableCell>
          );
        })}
        {endButtons &&
          endButtons.map((button, index) => (
            <TableCell key={`buttons-${row.id}-${index}`} align="right">
              <Button
                variant={button.variant}
                disabled={button.disabled}
                key={`${button.label} ${index}`}
                onClick={event => {
                  event.stopPropagation();
                  button.onClick(row.id);
                }}
              >
                {button.label}
              </Button>
            </TableCell>
          ))}
      </TableRowMui>
      {row.children && row.children.length > 0 && (
        <TableRowMui>
          <TableCell
            padding="none"
            colSpan={2 + columns.length + (endButtons?.length ?? 0)}
          >
            <Collapse in={open} timeout="auto">
              <Table className={classes.table} size="medium">
                <SelectableTableHead
                  classes={classes}
                  columns={columns}
                  rowEndButtonsLength={endButtons?.length}
                  collapsible
                  visible={false}
                />
                <TableBody>
                  {row.children.map(row => (
                    <TableRow
                      key={row.id}
                      columns={columns}
                      onClickCheckbox={onClickCheckbox}
                      onEditRowAttribute={onEditRowAttribute}
                      onRowClick={onRowClick}
                      row={row}
                      isSelectedForPreview={isSelectedForPreview}
                      isSelected={isSelected}
                      level={level + 1}
                      endButtons={endButtons}
                      collapsible={collapsible}
                    />
                  ))}
                </TableBody>
              </Table>
            </Collapse>
          </TableCell>
        </TableRowMui>
      )}
    </>
  );
};
export interface SelectableTableProps {
  /**
   * If defined, converts the table into a collapsible one with tree data type previewing
   * and is called when rendering row children
   */
  getRowParentId?: (rowId: string) => string | null;
  /**
   * Table title displayed in the table toolbar
   */
  tableTitle?: string;
  /**
   * List of buttons to display in the table toolbar
   */
  buttons?: ToolbarButton[];
  /**
   * List of buttons to display on each row end
   */
  rowEndButtons?: RowButton[];
  /**
   * List of rows to display
   */
  rows: TableDataType[];
  /**
   * List of columns to display
   */
  columns: SelectableTableColumn[];
  /**
   * Id of the row which has focus
   */
  focusedRowId: string | null;
  /**
   * List of row ids selected with the checkbox
   */
  selectedRowIds: string[];
  /**
   * Text to display when rows are selected (with the checkbox). This will replace the 'tableTitle' value.
   */
  toolBarDynamicTitle?: string;
  /**
   * Called when the user clicks on a checkbox
   */
  onChangeSelectedRows: (rowIds: string[]) => void;
  /**
   * Called when the user clicks on a row
   */
  onRowClick: (rowId: string) => void;
  /**
   * Called when a row attribute is changed via the input
   */
  onEditRowAttribute: (
    rowId: string,
    rowAttributeKey: TableDataTypeKeys,
    value: string
  ) => void;
}

type TreeTableDataType = TableDataType & {
  children?: TableDataType[];
};

const getTreeDataModel = (
  rows: TableDataType[],
  getRowParentId: (rowId: string) => string | null
): TreeTableDataType[] => {
  const rowsCpy = [...rows];
  const rootRows: TreeTableDataType[] = [];
  for (const row of rows) {
    const parentId = getRowParentId(row.id);

    if (
      parentId === null ||
      undefined === rows.find(row => row.id === parentId)
    ) {
      //Remove current row from rowCpy to inject it in next function iteration
      const rowIndex = rowsCpy.findIndex(rowCpy => rowCpy.id === row.id);
      if (rowIndex >= 0) {
        rootRows.push({ ...row, children: [] });
        rowsCpy.splice(rowIndex, 1);
      }
    }
  }

  for (const rootRow of rootRows) {
    rootRow.children = rootRow.children?.concat(
      getTreeDataModel(rowsCpy, getRowParentId)
    );
  }

  return rootRows;
};

const SelectableTable: React.FC<SelectableTableProps> = ({
  tableTitle,
  buttons = [],
  selectedRowIds,
  onChangeSelectedRows,
  toolBarDynamicTitle,
  rows,
  columns,
  focusedRowId,
  onRowClick,
  onEditRowAttribute,
  getRowParentId,
  rowEndButtons
}) => {
  const classes = useStyles();
  const [treeRows] = useState(
    getRowParentId ? getTreeDataModel(rows, getRowParentId) : rows
  );

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && selectedRowIds.length === 0) {
      const newSelectedRows = rows.map(row => row.id);
      onChangeSelectedRows(newSelectedRows);
      return;
    }

    onChangeSelectedRows([]);
  };

  const handleClick = (ids: string[]) => {
    let newSelected = [...selectedRowIds];
    const clickTargetId = ids[0];

    if (undefined !== clickTargetId) {
      const shouldAddClickTarget = newSelected.indexOf(clickTargetId) < 0;

      //If we add the click target, we add all other ids (that are presumably its children)
      if (shouldAddClickTarget) {
        for (const id of ids) {
          const selectedIndex = newSelected.indexOf(id);
          if (selectedIndex === -1) {
            newSelected.push(id);
          }
        }
      } else {
        //Else we only remove the click target
        newSelected = newSelected.filter(id => id !== clickTargetId);
      }
    }

    onChangeSelectedRows(newSelected);
  };

  const isSelected = (id: string) => selectedRowIds.indexOf(id) !== -1;
  const isSelectedForPreview = (id: string) => focusedRowId === id;

  return (
    <Paper className={classes.paper}>
      <TableToolbar
        tableTitle={tableTitle}
        buttons={buttons}
        toolBarDynamicTitle={toolBarDynamicTitle}
        selectedRows={rows.filter(row => selectedRowIds.indexOf(row.id) !== -1)}
      />
      <TableContainer className={classes.container}>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          aria-label="clustersTable"
          size="medium"
          stickyHeader
        >
          <SelectableTableHead
            classes={classes}
            numSelected={selectedRowIds.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={rows.length}
            columns={columns}
            rowEndButtonsLength={rowEndButtons?.length}
            collapsible={undefined !== getRowParentId}
          />
          <TableBody>
            {treeRows.map(row => {
              return (
                <TableRow
                  key={row.id}
                  columns={columns}
                  onClickCheckbox={handleClick}
                  onEditRowAttribute={onEditRowAttribute}
                  onRowClick={onRowClick}
                  row={row}
                  isSelectedForPreview={isSelectedForPreview}
                  isSelected={isSelected}
                  endButtons={rowEndButtons}
                  collapsible={undefined !== getRowParentId}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SelectableTable;
