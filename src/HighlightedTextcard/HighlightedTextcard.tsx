import React from "react";
import clsx from "clsx";
import { makeStyles, createStyles, Theme, Container } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: { whiteSpace: "pre-wrap", margin: 13 },
    onlyValueColor: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText
    },
    onlyValueColorHovered: {
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText
      }
    },
    key: {
      backgroundColor: theme.palette.secondary.dark,
      color: theme.palette.secondary.contrastText
    },
    keyHovered: {
      "&:hover": {
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.secondary.contrastText
      }
    },
    value: {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.secondary.contrastText
    },
    valueHovered: {
      "&:hover": {
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.secondary.contrastText
      }
    },
    scrollContainer: {
      overflowY: "auto",
      height: "100%"
    },
    spanHover: {
      "&:hover": {
        cursor: "pointer"
      }
    }
  })
);

export interface Interval {
  start: number;
  stop: number;
  key?: string;
  type?: "key" | "value" | "onlyValueColor";
  colored?: boolean;
}

export interface Position {
  key?: Interval;
  value: Interval;
}

export interface HighlightedTextcardData {
  key: string;
  positions: Position[];
}

export interface HighlightedTextcardProps {
  /**
   * Text content of the document
   */
  content: string;
  /**
   * Data of position intervals and keys of identified text
   */
  data: HighlightedTextcardData[];
  /**
   * Keys of identified text to show. An empty array will highlight all interval in data
   */
  keyToShow: string[];
  /**
   * Callback function returning the key on interval click
   */
  onIntervalClick?: (interval: Interval) => void;
}

const HighlightedTextcard: React.FC<HighlightedTextcardProps> = ({
  content,
  data,
  keyToShow = [],
  onIntervalClick
}) => {
  const classes = useStyles();

  const getSpanClassName = (
    type?: "key" | "value" | "onlyValueColor",
    colored?: boolean
  ): string => {
    let className = "";
    switch (type) {
      case "key":
        className = clsx(classes.spanHover, classes.keyHovered, {
          [classes.key]: colored
        });
        break;
      case "onlyValueColor":
        className = clsx(classes.spanHover, classes.onlyValueColorHovered, {
          [classes.onlyValueColor]: colored
        });
        break;
      case "value":
        className = clsx(classes.spanHover, classes.valueHovered, {
          [classes.value]: colored
        });
        break;
      default:
        break;
    }
    return className;
  };

  const intervalList: Interval[] = data.reduce(
    (acc: Interval[], val: HighlightedTextcardData) => {
      for (const pos of val.positions) {
        const show = keyToShow.length === 0 || keyToShow.includes(val.key);

        if (pos.key) {
          acc.push({
            ...pos.key,
            key: val.key,
            type: "key",
            colored: show
          });
          acc.push({
            ...pos.value,
            key: val.key,
            type: "value",
            colored: show
          });
        } else {
          acc.push({
            ...pos.value,
            key: val.key,
            type: "onlyValueColor",
            colored: show
          });
        }
      }
      return acc;
    },
    []
  );

  const sortByValueStart = (a: Interval, b: Interval): -1 | 1 =>
    a.start < b.start ? -1 : 1;

  intervalList.sort(sortByValueStart);

  return (
    <Container className={classes.scrollContainer} maxWidth="sm">
      <Paper>
        <pre className={classes.text}>
          {content.substring(0, intervalList[0].start)}
          {intervalList.map((pos, i) => {
            return (
              <React.Fragment key={"highlightedText_" + i}>
                <span
                  className={getSpanClassName(pos.type, pos.colored)}
                  onClick={() => onIntervalClick && onIntervalClick(pos)}
                >
                  {content.substring(pos.start, pos.stop)}
                </span>
                {intervalList[i + 1] &&
                  content.substring(pos.stop, intervalList[i + 1].start)}
              </React.Fragment>
            );
          })}
          {content.substring(intervalList[intervalList.length - 1].stop)}
        </pre>
      </Paper>
    </Container>
  );
};

export default HighlightedTextcard;
