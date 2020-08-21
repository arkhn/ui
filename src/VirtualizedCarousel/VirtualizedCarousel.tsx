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
  /**
   * Render called to display the document within the carousel and also inside the modal
   */
  documentRenderer: (documentIndex: number) => React.ReactNode;
  /**
   * Total number of documents
   */
  documentCount: number;
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

const VirtualizedCarousel: React.FC<VirtualizedCarouselProps> = ({
  documentCount,
  documentRenderer,
}) => {
  const classes = useStyles();
  const [selectedColumn, setSelectedColumn] = React.useState(0);
  const [activePageLabel, setActivePageLabel] = React.useState(1);
  const [isModalOpen, setModalOpen] = React.useState(false);
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };
  const setNextDoc = () => {
    if (selectedColumn < documentCount - 1) {
      setSelectedColumn(activePageLabel);
    }
  };
  const setPrevDoc = () => {
    if (selectedColumn > 0) {
      setSelectedColumn(activePageLabel - 2);
    }
  };
  const cellRenderer: GridCellRenderer = ({
    isScrolling,
    isVisible,
    key,
    style,
    columnIndex,
  }: GridCellProps) => {
    if (!isScrolling && isVisible) {
      setSelectedColumn(activePageLabel - 1);
    }

    return (
      <div
        key={key}
        style={{ ...style, textAlign: "center" }}
        onClick={toggleModal}
      >
        {documentRenderer(columnIndex)}
      </div>
    );
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
              cellRenderer={cellRenderer}
              columnCount={documentCount}
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
              {activePageLabel} of {documentCount}
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
            {documentRenderer(selectedColumn)}
          </Modal>
        </>
      )}
    </AutoSizer>
  );
};

export default VirtualizedCarousel;
