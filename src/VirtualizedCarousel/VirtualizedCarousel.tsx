import React from "react";
import {
  Grid,
  GridCellRenderer,
  GridCellProps,
  ScrollParams,
  AutoSizer
} from "react-virtualized";
import Modal from "react-modal";
import NextIcon from "@material-ui/icons/NavigateNext";
import PrevIcon from "@material-ui/icons/NavigateBefore";
import FullScreenIcon from "@material-ui/icons/Fullscreen";
import {
  makeStyles,
  createStyles,
  Theme,
  IconButton,
  Paper
} from "@material-ui/core";

export interface VirtualizedCarouselProps {
  /**
   * Render called to display the document within the carousel and also inside the modal
   */
  documentRenderer: (documentIndex: number) => React.ReactNode;
  /**
   * Total number of documents
   */
  documentCount: number;
  /**
   * Callback called when the user changes the document page from the carousel
   */
  onChangeDocument?: (docmentIndex: number) => void;
  /**
   * Selected index of document to preview
   */
  selectedDocumentIndex: number | null;
  /**
   * Grid component width
   */
  width?: string | number;
  /**
   * Grid component height. Doesn't take the footer control panel in account.
   */
  height?: string | number;
}

Modal.setAppElement("#root");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      // temporary right-to-left patch, waiting for∏
      // https://github.com/bvaughn/react-virtualized/issues/454
      "& .ReactVirtualized__Table__headerRow": {
        flip: false,
        paddingRight: theme.direction === "rtl" ? "0 !important" : undefined
      }
    },
    footerControls: {
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    previewButtonsContainer: {
      position: "absolute"
    }
  })
);

const VirtualizedCarousel: React.FC<VirtualizedCarouselProps> = ({
  documentCount,
  documentRenderer,
  onChangeDocument,
  selectedDocumentIndex,
  width = "25vw",
  height = "50vh"
}) => {
  const classes = useStyles();
  const [selectedColumn, setSelectedColumn] = React.useState(0);
  const [activePageLabel, setActivePageLabel] = React.useState(1);
  const [isModalOpen, setModalOpen] = React.useState(false);
  React.useEffect(() => {
    null !== selectedDocumentIndex && setSelectedColumn(selectedDocumentIndex);
  }, [selectedDocumentIndex]);
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
    columnIndex
  }: GridCellProps) => {
    if (!isScrolling && isVisible) {
      setSelectedColumn(activePageLabel - 1);
      null !== selectedDocumentIndex &&
        onChangeDocument &&
        onChangeDocument(activePageLabel - 1);
    }

    return (
      <div key={key} style={{ ...style, textAlign: "center" }}>
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
    <>
      <div style={{ width, height, display: "block" }}>
        <AutoSizer>
          {({ width: autoSizerWidth, height: autoSizerHeight }) => (
            <>
              <div className={classes.previewButtonsContainer}>
                <IconButton
                  onClick={setPrevDoc}
                  style={{
                    position: "relative",
                    left: 0,
                    top: autoSizerHeight / 2,
                    zIndex: 1
                  }}
                >
                  <PrevIcon />
                </IconButton>
                <IconButton
                  onClick={setNextDoc}
                  style={{
                    position: "relative",
                    left: autoSizerWidth - 2 * 48,
                    top: autoSizerHeight / 2,
                    zIndex: 1
                  }}
                >
                  <NextIcon />
                </IconButton>
              </div>
              <Grid
                aria-label="Document preview"
                cellRenderer={cellRenderer}
                columnCount={documentCount}
                columnWidth={autoSizerWidth}
                height={autoSizerHeight}
                rowCount={1}
                rowHeight={autoSizerHeight}
                width={autoSizerWidth}
                scrollToColumn={selectedColumn}
                scrollToAlignment="center"
                onScroll={onScroll}
                className={classes.grid}
              />
            </>
          )}
        </AutoSizer>
      </div>
      <Paper className={classes.footerControls}>
        <span>
          {activePageLabel} of {documentCount}
        </span>
        <IconButton onClick={toggleModal}>
          <FullScreenIcon />
        </IconButton>
      </Paper>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={toggleModal}
        style={{
          overlay: {
            zIndex: 2,
            display: "flex",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.4)"
          },
          content: {
            right: "auto",
            left: "auto",
            textAlign: "center"
          }
        }}
      >
        {documentRenderer(selectedColumn)}
      </Modal>
    </>
  );
};

export default VirtualizedCarousel;
