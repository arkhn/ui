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
  InputAdornment,
} from "@material-ui/core";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import EditIcon from "@material-ui/icons/EditOutlined";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import DoneIcon from "@material-ui/icons/Done";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flexContainer: {
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box",
    },
    cell: {
      flex: 1,
      paddingRight: theme.spacing(1),
      borderBottom: "none",
    },
    labelComponent: {
      flex: 1,
    },
    numericCell: {
      textAlign: "right",
    },
    input: {
      fontSize: theme.typography.fontSize,
    },
    labelSpan: {
      width: 10,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  })
);

export type LabelDroppableMenuProps = {
  numeric?: boolean;
  label: string;
  id: string;
  droppableListComponent?: React.ReactNode;
  onLabelEdited?: (value: string) => void;
  onDeleteClick?: () => void;
};

const LabelDroppableMenu: React.FC<LabelDroppableMenuProps> = ({
  label,
  numeric,
  id,
  droppableListComponent,
  onLabelEdited,
  onDeleteClick,
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
        [classes.numericCell]: numeric,
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
        {(popupState) =>
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
                  horizontal: "right",
                }}
              >
                {!onDeleteClick && droppableListComponent}
                <List>
                  <ListItem
                    button
                    onClick={() => {
                      popupState.close();
                      setTimeout(toggleEditMode);
                    }}
                  >
                    <ListItemIcon>
                      <EditIcon />
                    </ListItemIcon>
                    <ListItemText primary="Edit" />
                  </ListItem>
                  {onDeleteClick && (
                    <ListItem button onClick={onDeleteClick}>
                      <ListItemIcon>
                        <DeleteIcon />
                      </ListItemIcon>
                      <ListItemText primary="Delete" />
                    </ListItem>
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
