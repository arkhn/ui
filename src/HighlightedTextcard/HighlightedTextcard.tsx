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

const getIntervalClass = (
  interval: Interval,
  classes: ReturnType<typeof useStyles>
) => {
  switch (interval.type) {
    case "key":
      return clsx(classes.spanHover, classes.keyHovered, {
        [classes.key]: interval.colored
      });
    case "onlyValueColor":
      return clsx(classes.spanHover, classes.onlyValueColorHovered, {
        [classes.onlyValueColor]: interval.colored
      });
    case "value":
      return clsx(classes.spanHover, classes.valueHovered, {
        [classes.value]: interval.colored
      });
    default:
      return "";
  }
};

const getSpanClassName = (
  intervals: Interval[],
  classes: ReturnType<typeof useStyles>
): string => {
  if (intervals.length === 1) {
    /*
     * CASE ONE INTERVAL
     */
    return getIntervalClass(intervals[0], classes);
  } else if (intervals.length > 1) {
    /*
     * CASE MULTIPLE INTERVALS
     */
    const coloredIntervals = intervals.filter(int => int.colored);

    if (coloredIntervals.length === 0) {
      // If none of the intervals are colored, we just apply hover styling
      return clsx(classes.spanHover, classes.overlapHovered);
    } else if (coloredIntervals.length === 1) {
      // If just one Interval must be highlighted, we apply its style
      return getIntervalClass(coloredIntervals[0], classes);
    } else if (coloredIntervals.length > 1) {
      // If more than one Intervals must be highlighted, we apply overlap style
      return clsx(classes.spanHover, classes.overlapHovered, classes.overlap);
    }
  }
  return "";
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
  [key: string]: Position[];
}

export interface HighlightedTextcardProps {
  /**
   * Text content of the document
   */
  content: string;
  /**
   * Data of position intervals and keys of identified text
   */
  data: HighlightedTextcardData;
  /**
   * Keys of identified text to show. An empty array will highlight all interval in data
   */
  keys: string[];
  /**
   * Callback function returning the key on interval click
   */
  onIntervalClick?: (intervals: Interval[]) => void;
}

const HighlightedTextcard: React.FC<HighlightedTextcardProps> = ({
  content,
  data,
  keys = [],
  onIntervalClick
}) => {
  const classes = useStyles();

  const intervalList: Interval[] = [];

  for (const dataKey in data) {
    for (const position of data[dataKey]) {
      const show = keys.length === 0 || keys.includes(dataKey);

      if (position.key) {
        intervalList.push({
          ...position.key,
          key: dataKey,
          type: "key",
          colored: show
        });
        intervalList.push({
          ...position.value,
          key: dataKey,
          type: "value",
          colored: show
        });
      } else {
        intervalList.push({
          ...position.value,
          key: dataKey,
          type: "onlyValueColor",
          colored: show
        });
      }
    }
  }

  /*
   * Generate the position array (positionList)
   */
  let positionList: number[] = [0, content.length];

  intervalList.forEach(interval => {
    positionList.push(interval.start);
    positionList.push(interval.stop);
  });

  positionList.sort((a, b) => {
    return a - b;
  });

  // Remove duplicates
  positionList = positionList.filter((c, index, originalPositionList) => {
    return originalPositionList.indexOf(c) === index;
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
        (positionList[i] + positionList[i - 1]) / 2
      );
      result.push(
        <span
          key={i}
          className={getSpanClassName(intervals, classes)}
          onClick={() =>
            onIntervalClick &&
            intervals.length > 0 &&
            onIntervalClick(intervals)
          }
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
