import React, { useRef, useEffect } from "react";
import clsx from "clsx";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import {
  AutoSizer,
  Grid,
  GridCellRenderer,
  ScrollSync
} from "react-virtualized";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  ResponderProvided,
  DraggableProvidedDragHandleProps
} from "react-beautiful-dnd";
import ReactDraggable from "react-draggable";
import { Checkbox, Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flexContainer: {
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box"
    },
    tableCell: {
      flex: 1,
      borderRight: `1px solid ${theme.palette.grey[300]}`,
      whiteSpace: "nowrap"
    },
    gridFocus: {
      "&:focus": {
        outline: "none"
      }
    },
    tablCellContent: {
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    draggableCell: {
      display: "flex",
      borderBottom: "1px solid",
      borderBottomColor: theme.palette.grey[300],
      boxSizing: "border-box",
      alignItems: "center",
      height: "100%",
      flex: 1
    },
    draggingCell: {
      border: "1px solid",
      borderColor: theme.palette.grey[300],
      backgroundColor: "white"
    },
    evenRowStyle: {
      backgroundColor: theme.palette.grey[200]
    },
    resizeHandle: {
      borderRight: "solid 1px",
      borderRightColor: theme.palette.grey[300],
      height: "100%",
      width: columnResizeHandleWidth,
      "&:hover": {
        cursor: "col-resize"
      }
    },
    droppableContainer: {
      width: "fit-content"
    },
    scrollContainer: {
      overflowX: "hidden"
    },
    hoverCell: {
      "&:hover": {
        backgroundColor: theme.palette.grey[300]
      }
    },
    selectedRowStyle: {
      backgroundColor: theme.palette.secondary.light,
      borderColor: theme.palette.secondary.main,
      "&:hover": {
        backgroundColor: theme.palette.secondary.dark
      }
    },
    selectedColumnCell: {
      backgroundColor: theme.palette.secondary.light,
      "&:hover": {
        backgroundColor: theme.palette.secondary.main
      }
    },
    tooltipSpan: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      WebkitLineClamp: 3,
      display: "-webkit-box",
      WebkitBoxOrient: "vertical"
    }
  })
);

const columnResizeHandleWidth: number = 5;
const checkboxWidth: number = 42;
const tooltipEnterDelay = 500;

export interface ColumnData {
  dataKey: GridDataKeys;
  label: string;
  numeric?: boolean;
  width: number;
  isDragDisabled?: boolean;
}

type GridDataKeys = keyof GridDataType;

export type GridDataType = {
  [key: string]: string | number;
};

export type HeaderCellRenderer = (
  props: ColumnData,
  draggableHandleProps: DraggableProvidedDragHandleProps | undefined
) => React.ReactNode;

export type HandleResizeColumn = (params: {
  dataKey: string;
  newWidth: number;
}) => void;

export interface VirtualizedDnDGridProps {
  /**
   * Grid columns to display
   */
  columns: ColumnData[];
  /**
   * Height of the header
   */
  headerHeight?: number;
  /**
   * Data to display
   */
  data: GridDataType[];
  /**
   * Index of the selected row
   */
  selectedRowIndex?: number;
  /**
   * DataKeys of the selected columns
   */
  selectedColumnKeys?: string[];
  /**
   * Height of grid rows
   */
  rowHeight?: number;
  /**
   * Grid width
   */
  width?: string | number;
  /**
   * Grid height (without counting the header)
   */
  height?: string | number;
  /**
   * Dragging callback fired when the dragging stops and the cell is released
   */
  onDragEnd: (result: DropResult, provided: ResponderProvided) => void;
  /**
   * Function returning the column width given the index
   */
  columnWidthGetter: (param: { index: number }) => number;
  /**
   * Callback fired when the header checkbox has been clicked on
   */
  onSelectHeaderCell?: (columnDataKey: GridDataKeys) => void;
  /**
   * Callback fired when a row has been clicked on
   */
  onRowClick?: (rowIndex: number) => void;
  /**
   * Function called to render the header cells given props
   * Do not forget to set the 'DraggableProvidedDragHandleProps' into the DragAndDrop handle component to support drag and drop.
   */
  headerCellRenderer: HeaderCellRenderer;
  /**
   * Callback fired after the release of the column resize drag&drop handle.
   * Called with arguments on the new column width, and the column dataKey.
   */
  handleResizeColumn: HandleResizeColumn;
  /**
   * Displays a tooltip with cell value when hovered
   */
  tooltipOnCells?: boolean;
}

const VirtualizedDnDGrid: React.FC<VirtualizedDnDGridProps> = ({
  rowHeight = 48,
  headerHeight = 48,
  selectedColumnKeys = [],
  selectedRowIndex,
  tooltipOnCells = true,
  width = "100%",
  height = "400px",
  columns,
  onDragEnd,
  data,
  onRowClick,
  columnWidthGetter,
  headerCellRenderer,
  handleResizeColumn,
  onSelectHeaderCell
}) => {
  const classes = useStyles();
  const headerRef = useRef<HTMLDivElement>(null);
  const mainGridRef = useRef<Grid>(null);

  useEffect(() => {
    mainGridRef.current?.recomputeGridSize();
  }, [columns]);

  const cellRenderer: GridCellRenderer = ({
    rowIndex,
    columnIndex,
    key,
    style
  }) => {
    const column = columns[columnIndex];
    const { dataKey } = column;
    const spanDataValue = (
      <span className={classes.tablCellContent}>{data[rowIndex][dataKey]}</span>
    );
    return (
      <TableCell
        component="div"
        key={key}
        onClick={() => handleCellClick(rowIndex)}
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.evenRowStyle]: rowIndex % 2 === 0,
          [classes.selectedRowStyle]: selectedRowIndex === rowIndex,
          [classes.hoverCell]: selectedRowIndex !== rowIndex
        })}
        variant="body"
        style={style}
        align={
          (columnIndex != null && columns[columnIndex].numeric) || false
            ? "right"
            : "left"
        }
      >
        {tooltipOnCells ? (
          <Tooltip
            arrow
            enterDelay={tooltipEnterDelay}
            title={
              <span className={classes.tooltipSpan}>
                {data[rowIndex][dataKey]}
              </span>
            }
          >
            {spanDataValue}
          </Tooltip>
        ) : (
          spanDataValue
        )}
      </TableCell>
    );
  };

  const handleCellClick = (rowIndex: number) => {
    if (onRowClick) {
      onRowClick(rowIndex);
    }
  };

  const handleHeaderCellClick = (dataKey: GridDataKeys) => {
    if (onSelectHeaderCell) {
      onSelectHeaderCell(dataKey);
    }
  };

  return (
    <ScrollSync>
      {({
        clientHeight,
        clientWidth,
        onScroll,
        scrollHeight,
        scrollLeft,
        scrollTop,
        scrollWidth
      }) => (
        <div style={{ width }}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId="VirtualizedGridDroppable"
              direction="horizontal"
            >
              {(provided, snapshot) => (
                <div
                  ref={headerRef}
                  className={classes.scrollContainer}
                  onScroll={event => {
                    if (snapshot.isDraggingOver && headerRef.current) {
                      onScroll({
                        clientHeight,
                        clientWidth,
                        scrollTop,
                        scrollWidth,
                        scrollHeight,
                        scrollLeft: headerRef.current.scrollLeft
                      });
                    }
                  }}
                >
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={clsx(
                      classes.flexContainer,
                      classes.droppableContainer
                    )}
                    style={{ height: headerHeight }}
                  >
                    {columns.map(
                      (
                        { dataKey, isDragDisabled, width, ...otherColumnProps },
                        index
                      ) => (
                        <Draggable
                          draggableId={dataKey}
                          index={index}
                          key={dataKey}
                          isDragDisabled={isDragDisabled}
                        >
                          {(provided, snapshot) => (
                            <div
                              id={dataKey}
                              className={clsx(classes.draggableCell, {
                                [classes.draggingCell]: snapshot.isDragging
                              })}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <div>
                                <Checkbox
                                  checked={
                                    selectedColumnKeys.findIndex(
                                      key => key === dataKey
                                    ) >= 0
                                  }
                                  onChange={() => {
                                    handleHeaderCellClick(dataKey);
                                  }}
                                />
                              </div>
                              {headerCellRenderer(
                                {
                                  dataKey,
                                  isDragDisabled,
                                  width:
                                    width -
                                    (columnResizeHandleWidth + 1) -
                                    checkboxWidth,
                                  ...otherColumnProps
                                },
                                provided.dragHandleProps
                              )}
                              {!snapshot.isDragging && (
                                <ReactDraggable
                                  axis="x"
                                  defaultClassName="ReactDragHandle"
                                  defaultClassNameDragging="ReactDragHandleActive"
                                  onStop={(event, { x }) => {
                                    const newWidth = width + x;
                                    return handleResizeColumn({
                                      dataKey,
                                      newWidth: Math.max(newWidth, 150)
                                    });
                                  }}
                                  position={{
                                    x: 0,
                                    y: 0
                                  }}
                                >
                                  <div className={clsx(classes.resizeHandle)} />
                                </ReactDraggable>
                              )}
                            </div>
                          )}
                        </Draggable>
                      )
                    )}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div style={{ height }}>
            <AutoSizer>
              {autoSizerProps => {
                const autoSizerHeight = autoSizerProps.height;
                const autoSizerWidth = autoSizerProps.width;
                return (
                  <Grid
                    aria-label="VirtualizedDragAndropGrid"
                    ref={mainGridRef}
                    cellRenderer={cellRenderer}
                    columnCount={columns.length}
                    columnWidth={columnWidthGetter}
                    height={autoSizerHeight}
                    width={autoSizerWidth}
                    rowCount={data.length}
                    rowHeight={rowHeight!}
                    scrollLeft={scrollLeft}
                    className={classes.gridFocus}
                    onScroll={params => {
                      onScroll(params);
                      headerRef.current?.scrollTo(params.scrollLeft, 0);
                    }}
                  />
                );
              }}
            </AutoSizer>
          </div>
        </div>
      )}
    </ScrollSync>
  );
};

export default VirtualizedDnDGrid;
