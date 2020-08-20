import React from "react";

import { makeStyles, createStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";

const useStyles = makeStyles(() =>
  createStyles({
    text: { whiteSpace: "pre-wrap", margin: 13 },
    color: { color: "red" },
    key: { backgroundColor: "#E43F6F", color: "white" },
    value: { backgroundColor: "#F56476", color: "white" },
    textValue: { backgroundColor: "#5E4352", color: "white" },
  })
);

export interface Interval {
  start: number;
  stop: number;
  type?: "key" | "value" | "textValue";
}

export interface Position {
  key?: Interval;
  value: Interval;
}

export interface HighlightedTextcardProps {
  content: string;
  position: Position[];
}

const HighlightedTextcard: React.FC<HighlightedTextcardProps> = ({
  content,
  position,
}) => {
  const classes = useStyles();
  const positionList: Interval[] = [];

  position.map((pos) => {
    if (pos.key) {
      positionList.push({ ...pos.key, type: "key" });
      positionList.push({ ...pos.value, type: "value" });
    } else {
      positionList.push({ ...pos.value, type: "textValue" });
    }
  });

  const sortByValueStart = (a: Interval, b: Interval): -1 | 1 =>
    a.start < b.start ? -1 : 1;

  positionList.sort(sortByValueStart);

  return (
    <React.Fragment>
      <Card>
        <pre className={classes.text}>
          {content.substring(0, positionList[0].start)}
          {positionList.map((pos, i) => {
            return (
              <React.Fragment>
                <span
                  className={pos.type ? classes[pos.type] : classes.color}
                  key={"text_" + i}
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
      {JSON.stringify(position)}
    </React.Fragment>
  );
};

export default HighlightedTextcard;
