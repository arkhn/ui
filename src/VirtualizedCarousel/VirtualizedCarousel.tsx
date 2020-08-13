import React from "react";
import {
  Grid,
  GridCellRenderer,
  GridCellProps,
  ScrollParams,
  AutoSizer,
} from "react-virtualized";
import Modal from "react-modal";
import NextIcon from "@material-ui/icons/NavigateNext";
import PrevIcon from "@material-ui/icons/NavigateBefore";
import { makeStyles, createStyles, Theme, IconButton } from "@material-ui/core";

export interface VirtualizedCarouselProps {
  documents: { source: string }[];
}

Modal.setAppElement("#root");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      // temporary right-to-left patch, waiting for∏
      // https://github.com/bvaughn/react-virtualized/issues/454
      "& .ReactVirtualized__Table__headerRow": {
        flip: false,
        paddingRight: theme.direction === "rtl" ? "0 !important" : undefined,
      },
    },
  })
);

const cellRenderer = (
  documents: { source: string }[],
  activePageLabel: number,
  setSelectedColumn: React.Dispatch<React.SetStateAction<number>>,
  toggleModal: () => void
): GridCellRenderer => (props: GridCellProps) => {
  const { isScrolling, isVisible, style } = props;
  if (!isScrolling && isVisible) {
    setSelectedColumn(activePageLabel - 1);
  }

  return (
    <div
      key={props.key}
      style={{ ...style, textAlign: "center" }}
      onClick={toggleModal}
      className={"imgWrapper"}
    >
      {documents[props.columnIndex] && (
        <img
          style={{ height: "100%" }}
          src={documents[props.columnIndex].source}
          alt={`${props.columnIndex}`}
        />
      )}
    </div>
  );
};

const VirtualizedCarousel: React.FC<VirtualizedCarouselProps> = ({
  documents,
}) => {
  const classes = useStyles();
  const [selectedColumn, setSelectedColumn] = React.useState(0);
  const [activePageLabel, setActivePageLabel] = React.useState(1);
  const [isModalOpen, setModalOpen] = React.useState(false);
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };
  const setNextDoc = () => {
    if (selectedColumn < documents.length - 1) {
      setSelectedColumn(activePageLabel);
    }
  };
  const setPrevDoc = () => {
    if (selectedColumn > 0) {
      setSelectedColumn(activePageLabel - 2);
    }
  };
  const onScroll = ({
    clientWidth,
    scrollLeft,
    scrollWidth,
    ...scrollParams
  }: ScrollParams) => {
    let pageNumber = 0;
    if (clientWidth !== 0) {
      pageNumber = Math.round(scrollLeft / clientWidth);
    }
    if (pageNumber !== selectedColumn) {
      setActivePageLabel(pageNumber + 1);
    }
  };
  return (
    <AutoSizer>
      {({ width, height }) => (
        <>
          <div style={{ display: "inline-block" }}>
            <IconButton
              onClick={setPrevDoc}
              style={{
                position: "relative",
                left: 0,
                top: height / 2,
                zIndex: 1,
              }}
            >
              <PrevIcon />
            </IconButton>
            <IconButton
              onClick={setNextDoc}
              style={{
                position: "relative",
                left: width - 2 * 48,
                top: height / 2,
                zIndex: 1,
              }}
            >
              <NextIcon />
            </IconButton>
            <Grid
              aria-label="Document preview"
              cellRenderer={cellRenderer(
                documents,
                activePageLabel,
                setSelectedColumn,
                toggleModal
              )}
              columnCount={documents.length}
              columnWidth={width}
              height={height}
              rowCount={1}
              rowHeight={height}
              width={width}
              scrollToColumn={selectedColumn}
              scrollToAlignment="center"
              onScroll={onScroll}
              className={classes.grid}
            />
            <p>
              {activePageLabel} of {documents.length}
            </p>
          </div>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={toggleModal}
            style={{
              overlay: {
                zIndex: 2,
                display: "flex",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
              },
              content: {
                right: "auto",
                left: "auto",
                textAlign: "center",
              },
            }}
          >
            {documents[selectedColumn] && (
              <img
                style={{ height: "100%" }}
                src={documents[selectedColumn].source}
                alt={`${selectedColumn}`}
              />
            )}
          </Modal>
        </>
      )}
    </AutoSizer>
  );
};

export default VirtualizedCarousel;
