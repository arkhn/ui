import React from "react";
import clsx from "clsx";
import {
  TableCell,
  IconButton,
  makeStyles,
  createStyles,
  Theme,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Input,
  InputAdornment
} from "@material-ui/core";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/Done";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flexContainer: {
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box"
    },
    cell: {
      flex: 1,
      paddingRight: theme.spacing(1),
      borderBottom: "none"
    },
    labelComponent: {
      flex: 1
    },
    numericCell: {
      textAlign: "right"
    },
    input: {
      fontSize: theme.typography.fontSize
    },
    labelSpan: {
      width: 10,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  })
);

export type LabelDroppableMenuProps = {
  numeric?: boolean;
  label: string;
  id: string;
  droppableListItems?: {
    label: string;
    onClick: (id: string) => void;
    icon: React.ReactNode;
    disabled?: boolean;
  }[];
  onLabelEdited?: (value: string) => void;
  /**
   * Disables "Rename" list item
   */
  disableEdit?: boolean;
  editIconProps?: React.ComponentProps<typeof EditIcon>;
};

const LabelDroppableMenu: React.FC<LabelDroppableMenuProps> = ({
  label,
  numeric,
  id,
  droppableListItems,
  onLabelEdited,
  editIconProps,
  disableEdit
}) => {
  const classes = useStyles();
  const [editingLabel, setEditingLabel] = React.useState(label);
  const [isEditingLabel, setIsEditingLabel] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const toggleEditMode = () => {
    setIsEditingLabel(!isEditingLabel);
  };
  const handleEditValidation = () => {
    if (onLabelEdited) {
      onLabelEdited(editingLabel);
    }
    toggleEditMode();
  };

  React.useEffect(() => {
    setEditingLabel(label);
  }, [label, isEditingLabel]);

  return (
    <TableCell
      component="div"
      variant="head"
      padding="none"
      className={clsx(classes.flexContainer, classes.cell, {
        [classes.numericCell]: numeric
      })}
    >
      {isEditingLabel ? (
        <Input
          className={classes.labelComponent}
          inputProps={{ className: classes.input }}
          inputRef={inputRef}
          disableUnderline
          autoFocus
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleEditValidation}>
                <DoneIcon />
              </IconButton>
            </InputAdornment>
          }
          onFocus={() => {
            setTimeout(() => inputRef.current?.select());
          }}
          onBlur={handleEditValidation}
          onChange={({ target: { value } }) => {
            setEditingLabel(value);
          }}
          onKeyDown={({ keyCode }) => {
            if (keyCode === 13) {
              inputRef.current?.blur();
            } else if (keyCode === 27) {
              toggleEditMode();
            }
          }}
          value={editingLabel}
        />
      ) : (
        <span className={clsx(classes.labelComponent, classes.labelSpan)}>
          {label}
        </span>
      )}
      <PopupState variant="popover" popupId={id}>
        {popupState =>
          !isEditingLabel && (
            <>
              <IconButton {...bindTrigger(popupState)}>
                <MoreHorizIcon />
              </IconButton>
              <Popover
                {...bindPopover(popupState)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
              >
                <List>
                  <ListItem
                    button
                    disabled={disableEdit}
                    onClick={() => {
                      popupState.close();
                      setTimeout(toggleEditMode);
                    }}
                  >
                    <ListItemIcon>
                      <EditIcon {...editIconProps} />
                    </ListItemIcon>
                    <ListItemText primary="Rename" />
                  </ListItem>
                  {droppableListItems &&
                    droppableListItems.map(
                      ({ icon, label, onClick, disabled }, index) => (
                        <ListItem
                          button
                          disabled={disabled}
                          onClick={() => {
                            popupState.close();
                            onClick(id);
                          }}
                          key={index}
                        >
                          <ListItemIcon>{icon}</ListItemIcon>
                          <ListItemText primary={label} />
                        </ListItem>
                      )
                    )}
                </List>
              </Popover>
            </>
          )
        }
      </PopupState>
    </TableCell>
  );
};

export default LabelDroppableMenu;
