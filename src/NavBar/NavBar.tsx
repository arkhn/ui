import React from "react";
import {
  AppBar,
  Toolbar,
  makeStyles,
  createStyles,
  Theme,
  AppBarProps
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navBar: {
      background: theme.palette.background.paper,
      zIndex: 2
    },
    toolBar: {
      paddingLeft: theme.spacing(5)
    }
  })
);

export type NavBarProps = {
  title: React.ReactNode;
  appBarProps?: AppBarProps;
  toolBarProps?: React.ComponentProps<typeof Toolbar>;
};

const NavBar: React.FC<NavBarProps> = ({
  appBarProps,
  toolBarProps,
  title
}) => {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.navBar} {...appBarProps}>
      <Toolbar className={classes.toolBar} {...toolBarProps}>
        {title}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
