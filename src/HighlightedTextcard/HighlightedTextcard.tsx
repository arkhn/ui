import React from "react";

import { makeStyles, createStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";

const useStyles = makeStyles(() =>
  createStyles({
    text: { whiteSpace: "pre-wrap", margin: 13 },
    color: { backgroundColor: "#5E4352", color: "white" },
    key: { backgroundColor: "#E43F6F", color: "white" },
    value: { backgroundColor: "#F56476", color: "white" },
    none: {},
  })
);

export interface Interval {
  start: number;
  stop: number;
  key?: string;
  type?: "key" | "value" | "color";
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
   * Keys of identified text to show. An empty array will highlight all identified text
   */
  keyToShow: string[];
  /**
   * Callback function returning the key on interval click
   */
  onIntervalClick?: Function;
  /**
   * Callback function returning the Interval containing the key
   */
  onIntervalHover?: Function;
}

const HighlightedTextcard: React.FC<HighlightedTextcardProps> = ({
  content,
  data,
  keyToShow = [],
  onIntervalClick,
  onIntervalHover,
}) => {
  const classes = useStyles();
  const positionList: Interval[] = [];

  data.forEach((d) => {
    d.positions.forEach((pos) => {
      const show =
        keyToShow.length === 0 || keyToShow.includes(d.key) ? true : false;

      if (pos.key) {
        positionList.push({
          ...pos.key,
          key: d.key,
          type: "key",
          colored: show,
        });
        positionList.push({
          ...pos.value,
          key: d.key,
          type: "value",
          colored: show,
        });
      } else {
        positionList.push({
          ...pos.value,
          key: d.key,
          type: "color",
          colored: show,
        });
      }
    });
  });

  const sortByValueStart = (a: Interval, b: Interval): -1 | 1 =>
    a.start < b.start ? -1 : 1;

  positionList.sort(sortByValueStart);

  return (
    <Card>
      <pre className={classes.text}>
        {content.substring(0, positionList[0].start)}
        {positionList.map((pos, i) => {
          return (
            <React.Fragment key={"highlightedText_" + i}>
              <span
                className={
                  pos.colored
                    ? pos.type
                      ? classes[pos.type]
                      : classes.none
                    : classes.none
                }
                onClick={() => {
                  if (onIntervalClick) onIntervalClick(pos);
                }}
                onMouseOver={() => {
                  if (onIntervalHover) onIntervalHover(pos);
                }}
              >
                {content.substring(pos.start, pos.stop)}
              </span>
              {positionList[i + 1] &&
                content.substring(pos.stop, positionList[i + 1].start)}
            </React.Fragment>
          );
        })}
        {content.substring(positionList[positionList.length - 1].stop)}
      </pre>
    </Card>
  );
};

export default HighlightedTextcard;
