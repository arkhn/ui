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

export interface TableDataType {
  name: string;
  id: string;
  documents: any[];
}

export interface TableHeadProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

export interface TableToolbarProps {
  selectedClusters: TableDataType[];
  onMergeClick: (clusterIds: string[]) => void;
}

export interface SelectableTableProps {
  rows: TableDataType[];
  onMergeClick: (clusterIds: string[]) => void;
  selectedRowId: string | null;
  onRowClick: (clusterId: string) => void;
  onEditClusterName: (clusterId: string, clusterName: string) => void;
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
  const { classes, numSelected, onSelectAllClick, rowCount } = props;
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all clusters" }}
          />
        </TableCell>
        <TableCell align="left" padding="none">
          {`Clusters`}
        </TableCell>
        <TableCell align="right" padding="default">
          {`Number of documents`}
        </TableCell>
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

const TableToolbar = (props: TableToolbarProps) => {
  const classes = useToolbarStyles();
  const { selectedClusters, onMergeClick } = props;
  const numSelected = selectedClusters.length;

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
          {numSelected} cluster(s) selected (
          {selectedClusters.reduce(
            (acc, cluster) => acc + cluster.documents.length,
            0
          )}{" "}
          documents)
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Clusters
        </Typography>
      )}
      <Button
        className={clsx(classes.button, {
          [classes.enabledButton]: numSelected !== 0,
        })}
        variant="contained"
        disabled={numSelected <= 1}
        onClick={() =>
          onMergeClick(selectedClusters.map((cluster) => cluster.id))
        }
      >
        Merge
      </Button>
      <Button
        className={clsx(classes.button, {
          [classes.enabledButton]: numSelected !== 0,
        })}
        variant="contained"
        disabled={numSelected === 0}
      >
        Export
      </Button>
    </Toolbar>
  );
};

const SelectableTable = (props: SelectableTableProps) => {
  const classes = useStyles();
  const {
    rows,
    onMergeClick,
    selectedRowId,
    onRowClick,
    onEditClusterName,
  } = props;
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelectedRows = rows.map((row) => row.id);
      setSelected(newSelectedRows);
      return;
    }

    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((selectedId) => selectedId !== id);
    }

    setSelected(newSelected);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;
  const isSelectedForPreview = (id: string) => selectedRowId === id;

  return (
    <Paper className={classes.paper}>
      <TableToolbar
        selectedClusters={rows.filter((row) => selected.indexOf(row.id) !== -1)}
        onMergeClick={(clusterIds) => {
          onMergeClick(clusterIds);
          setSelected([]);
        }}
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
            numSelected={selected.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={rows.length}
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
                  <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                  >
                    <EditInput
                      value={row.name}
                      onChange={(name) => {
                        onEditClusterName(row.id, name);
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">{row.documents.length}</TableCell>
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
