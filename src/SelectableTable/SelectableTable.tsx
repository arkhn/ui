import React, { useState } from "react";
import clsx from "clsx";
import {
  makeStyles,
  Theme,
  createStyles,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  Paper,
  TableContainer,
  Table,
  TableBody,
  Toolbar,
  Typography,
  Button,
} from "@material-ui/core";
import EditInput from "../EditInput/EditInput";

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

export type SelectableTableButton = {
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

interface TableHeadProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
  columns: SelectableTableColumn[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {},
    table: {
      minWidth: 300,
    },
    container: {
      maxHeight: "80vh",
    },
    nameCell: {
      maxWidth: "70%",
    },
  })
);

const SelectableTableHead = (props: TableHeadProps) => {
  const { classes, numSelected, onSelectAllClick, rowCount, columns } = props;
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all rows" }}
          />
        </TableCell>
        {columns.map((column) => (
          <TableCell
            align={column.align}
            padding={column.padding}
            key={`head ${column.label}`}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: 300,
    },
    highlight: {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.primary.main,
    },
    title: {
      flex: "auto",
    },
    button: {
      margin: `0px ${theme.spacing(1)}px`,
    },
    enabledButton: {
      backgroundColor: theme.palette.secondary.main,
      "&:hover": {
        backgroundColor: theme.palette.secondary.light,
      },
    },
  })
);

interface TableToolbarProps {
  buttons: SelectableTableButton[];
  tableTitle: string;
  selectedRows: TableDataType[];
  onRowsSelectedDynamicTitle: string;
}

const TableToolbar: React.FC<TableToolbarProps> = ({
  selectedRows,
  tableTitle,
  buttons,
  onRowsSelectedDynamicTitle,
}) => {
  const classes = useToolbarStyles();
  const numSelected = selectedRows.length;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {onRowsSelectedDynamicTitle}
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
            [classes.enabledButton]: numSelected !== 0,
          })}
          variant={button.variant}
          disabled={button.disabled}
          key={`${button.label} ${index}`}
          onClick={() =>
            button.onClick(selectedRows.map((cluster) => cluster.id))
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

export interface SelectableTableProps {
  /**
   * Table title displayed in the table toolbar
   */
  tableTitle: string;
  /**
   * List of buttons to display in the table toolbar
   */
  buttons: SelectableTableButton[];
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
  onRowsSelectedDynamicTitle: string;
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

const SelectableTable: React.FC<SelectableTableProps> = ({
  tableTitle,
  buttons,
  selectedRowIds,
  onChangeSelectedRows,
  onRowsSelectedDynamicTitle,
  rows,
  columns,
  focusedRowId,
  onRowClick,
  onEditRowAttribute,
}) => {
  const classes = useStyles();

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && selectedRowIds.length === 0) {
      const newSelectedRows = rows.map((row) => row.id);
      onChangeSelectedRows(newSelectedRows);
      return;
    }

    onChangeSelectedRows([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selectedRowIds.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = [...selectedRowIds, id];
    } else {
      newSelected = selectedRowIds.filter((selectedId) => selectedId !== id);
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
        onRowsSelectedDynamicTitle={onRowsSelectedDynamicTitle}
        selectedRows={rows.filter(
          (row) => selectedRowIds.indexOf(row.id) !== -1
        )}
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
          />
          <TableBody>
            {rows.map((row, index) => {
              const isRowSelected = isSelected(row.id);
              const isRowPreviewed = isSelectedForPreview(row.id);
              const labelId = `selectable-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  selected={isRowPreviewed}
                  key={row.id}
                  onClick={(event) => {
                    onRowClick(row.id);
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isRowSelected}
                      inputProps={{ "aria-labelledby": labelId }}
                      onClick={(event: React.MouseEvent<unknown>) => {
                        event.stopPropagation();
                        handleClick(event, row.id);
                      }}
                    />
                  </TableCell>
                  {columns.map((column, columnIndex) => {
                    return column.input ? (
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding={column.padding}
                        align={column.align}
                        key={`${column.label} ${columnIndex}`}
                      >
                        <EditInput
                          value={row[column.rowAttributeKey]}
                          onChange={(value) => {
                            onEditRowAttribute(
                              row.id,
                              column.rowAttributeKey,
                              value
                            );
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
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SelectableTable;
