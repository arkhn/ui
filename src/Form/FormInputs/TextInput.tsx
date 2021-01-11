import React, { useState } from "react";
import { FormControl, TextField, IconButton } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { FieldValues } from "react-hook-form";

type TextInputProps<K extends FieldValues> = {
  title?: string;
  inputRef?: (ref: any) => void;
  name?: keyof K;
  error?: boolean;
  helperText?: string;
  type?: "text" | "number";
  containerStyle?: React.CSSProperties;
  placeholder?: string;
  variant?: "filled" | "outlined" | "standard";
  password?: boolean;
  disabled?: boolean;
  endAdornment?: JSX.Element;
  startAdornment?: JSX.Element;
};

const EyeIcon: React.FC<{ hide?: boolean; onClick?: () => void }> = ({
  hide,
  onClick
}) => {
  return (
    <IconButton onClick={onClick}>
      {!hide ? <Visibility /> : <VisibilityOff />}
    </IconButton>
  );
};

const TextInput = <K extends FieldValues>({
  title,
  helperText,
  error,
  placeholder,
  variant,
  password,
  endAdornment,
  startAdornment,
  containerStyle = {
    margin: "1em"
  },
  ...inputProps
}: TextInputProps<K>) => {
  const [hideText, setHideText] = useState(password);

  return (
    <FormControl component="div" style={containerStyle}>
      <TextField
        label={title}
        error={error}
        helperText={helperText}
        placeholder={placeholder}
        variant={variant}
        fullWidth
        inputProps={{
          type: hideText ? "password" : inputProps.type
        }}
        InputProps={{
          startAdornment,
          endAdornment:
            endAdornment ??
            (password ? (
              <EyeIcon onClick={() => setHideText(!hideText)} hide={hideText} />
            ) : null)
        }}
        {...inputProps}
      />
    </FormControl>
  );
};

export default TextInput;
