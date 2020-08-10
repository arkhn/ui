import React from "react";
import {
  Input,
  InputAdornment,
  IconButton,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

export interface EditInputProps {
  value: string;
  onChange: (value: string) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      textOverflow: "ellipsis",
    },
  })
);

const EditInput: React.FC<EditInputProps> = (props: EditInputProps) => {
  const classes = useStyles();
  const { value, onChange } = props;
  const [inputValue, setInputValue] = React.useState<string>(value);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div>
      <Input
        inputProps={{ className: classes.input }}
        value={inputValue}
        inputRef={inputRef}
        disableUnderline
        onBlur={() => onChange(inputValue)}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setInputValue(event.target.value)
        }
        onKeyDown={(event) => {
          if (event.keyCode === 13) {
            inputRef.current?.blur();
          }
        }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={(event) => {
                event.stopPropagation();
                inputRef.current?.select();
              }}
            >
              <EditIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </div>
  );
};

export default EditInput;
