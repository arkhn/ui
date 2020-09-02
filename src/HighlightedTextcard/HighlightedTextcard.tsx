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
    overlap: {
      backgroundColor: theme.palette.warning.light,
      color: theme.palette.warning.contrastText
    },
    overlapHovered: {
      "&:hover": {
        backgroundColor: theme.palette.warning.light,
        color: theme.palette.warning.contrastText
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

const getSpanClassName = (
  intervals: Interval[],
  classes: ReturnType<typeof useStyles>
): string => {
  let className = "";
  if (intervals.length === 1) {
    switch (intervals[0].type) {
      case "key":
        className = clsx(classes.spanHover, classes.keyHovered, {
          [classes.key]: intervals[0].colored
        });
        break;
      case "onlyValueColor":
        className = clsx(classes.spanHover, classes.onlyValueColorHovered, {
          [classes.onlyValueColor]: intervals[0].colored
        });
        break;
      case "value":
        className = clsx(classes.spanHover, classes.valueHovered, {
          [classes.value]: intervals[0].colored
        });
        break;
      default:
        break;
    }
  }
  if (intervals.length > 1)
    className = clsx(classes.spanHover, classes.overlapHovered, {
      [classes.overlap]: intervals[0].colored
    });
  return className;
};

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
  onIntervalClick?: (intervals: Interval[]) => void;
}

const HighlightedTextcard: React.FC<HighlightedTextcardProps> = ({
  content,
  data,
  keyToShow = [],
  onIntervalClick
}) => {
  const classes = useStyles();

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

  let positionList: number[] = [0, content.length];
  for (let i in intervalList) {
    positionList.push(intervalList[i].start);
    positionList.push(intervalList[i].stop);
  }

  positionList.sort((a, b) => {
    return a - b;
  });

  const getIntervalInPosition = (position: number) =>
    intervalList.filter(
      interval =>
        position >= interval.start && position <= interval.stop && interval
    );

  const getText = () => {
    const result = [];
    for (let i = 1; i < positionList.length; i++) {
      let intervals = getIntervalInPosition(
        Math.floor((positionList[i] + positionList[i - 1]) / 2)
      );
      result.push(
        <span
          key={i}
          className={getSpanClassName(intervals, classes)}
          onClick={() => onIntervalClick && onIntervalClick(intervals)}
        >
          {content.substring(positionList[i - 1], positionList[i])}
        </span>
      );
    }

    return result;
  };

  return (
    <Container className={classes.scrollContainer} maxWidth="sm">
      <Paper>
        <pre className={classes.text}>{getText()}</pre>
      </Paper>
    </Container>
  );
};

export default HighlightedTextcard;
