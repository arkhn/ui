import React, { useRef } from "react";
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
   * Optional renderer to be used in place of documentRenderer when :documentCount is 0
   */
  noContentRenderer?: () => React.ReactNode;
  /**
   * Total number of documents
   */
  documentCount: number;
  /**
   * Callback called when the user changes the document page from the carousel
   */
  onChangeDocument: (docmentIndex: number) => void;
  /**
   * Selected index of document to preview
   */
  selectedDocumentIndex?: number;
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
  height = "50vh",
  noContentRenderer
}) => {
  const classes = useStyles();
  const mainGridRef = useRef<Grid>(null);
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [activePageLabel, setActivePageLabel] = React.useState(1);
  const [isGridScrolling, setIsGridScrolling] = React.useState(false);
  React.useEffect(() => {
    if (undefined !== selectedDocumentIndex) {
      mainGridRef.current?.scrollToCell({
        columnIndex: selectedDocumentIndex,
        rowIndex: 0
      });
      setActivePageLabel(selectedDocumentIndex + 1);
    }
  }, [selectedDocumentIndex]);
  React.useEffect(() => {
    if (!isGridScrolling && documentCount > 0) {
      onChangeDocument(activePageLabel - 1);
    }
  }, [isGridScrolling, documentCount]);
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };
  const setNextDoc = () => {
    if (
      undefined !== selectedDocumentIndex &&
      selectedDocumentIndex < documentCount - 1
    ) {
      onChangeDocument(activePageLabel);
    }
  };
  const setPrevDoc = () => {
    if (undefined !== selectedDocumentIndex && selectedDocumentIndex > 0) {
      onChangeDocument(activePageLabel - 2);
    }
  };
  const cellRenderer: GridCellRenderer = ({
    isScrolling,
    isVisible,
    key,
    style,
    columnIndex
  }: GridCellProps) => {
    if (isScrolling !== isGridScrolling) {
      setIsGridScrolling(isScrolling);
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
    if (pageNumber !== selectedDocumentIndex) {
      setActivePageLabel(pageNumber + 1);
    }
  };
  return (
    <>
      <div style={{ width, height, display: "block" }}>
        <AutoSizer>
          {({ width: autoSizerWidth, height: autoSizerHeight }) => (
            <>
              {documentCount > 0 && (
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
              )}
              <Grid
                aria-label="Document preview"
                ref={mainGridRef}
                cellRenderer={cellRenderer}
                columnCount={documentCount}
                columnWidth={autoSizerWidth}
                height={autoSizerHeight}
                rowCount={1}
                rowHeight={autoSizerHeight}
                width={autoSizerWidth}
                scrollToAlignment="center"
                onScroll={onScroll}
                className={classes.grid}
                noContentRenderer={noContentRenderer}
              />
            </>
          )}
        </AutoSizer>
      </div>
      {documentCount > 0 && (
        <Paper className={classes.footerControls}>
          <span>
            {activePageLabel} of {documentCount}
          </span>
          <IconButton onClick={toggleModal}>
            <FullScreenIcon />
          </IconButton>
        </Paper>
      )}
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
        {undefined !== selectedDocumentIndex &&
          documentRenderer(selectedDocumentIndex)}
      </Modal>
    </>
  );
};

export default VirtualizedCarousel;
