import React from "react";
import clsx from "clsx";
import { Fab, makeStyles, Theme, createStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

const useStyles = makeStyles<
  Theme,
  { width: string | number; height: string | number }
>((theme: Theme) =>
  createStyles({
    container: {
      width: "fit-content",
      display: "flex",
      flexDirection: "column"
    },
    positionRight: {
      alignItems: "flex-end"
    },
    positionLeft: {
      alignItems: "flex-start"
    },
    childrenWrapper: {},
    absoluteContainer: {
      width: props => props.width,
      height: props => props.height,
      position: "absolute",
      zIndex: 2
    },
    fabButton: {
      marginBottom: theme.spacing(1)
    }
  })
);

export type ComponentOverlayerProps = {
  open: boolean;
  children: React.ReactNode;
  componentToDisplay?: React.ReactNode;
  buttonPosition?: "right" | "left";
  onClickButton?: () => void;
  width: string | number;
  height: string | number;
};

const ComponentOverlayer: React.FC<ComponentOverlayerProps> = ({
  open,
  children,
  componentToDisplay,
  buttonPosition = "right",
  onClickButton = () => {},
  width,
  height
}) => {
  const classes = useStyles({ width, height });
  return (
    <div
      className={clsx(classes.container, {
        [classes.positionRight]: buttonPosition === "right",
        [classes.positionLeft]: buttonPosition === "left"
      })}
    >
      <Fab className={classes.fabButton} onClick={onClickButton}>
        {open ? <RemoveIcon /> : <AddIcon />}
      </Fab>
      <div className={classes.childrenWrapper}>
        {open && (
          <div className={classes.absoluteContainer}>{componentToDisplay}</div>
        )}
        {children}
      </div>
    </div>
  );
};

export default ComponentOverlayer;
