import React from "react";
import { FormControl, TextField, TextFieldProps } from "@material-ui/core";
import { FieldValues } from "react-hook-form";

type TextInputProps<K extends FieldValues> = {
  title?: string;
  inputRef?: (ref: any) => void;
  name?: keyof K;
  error?: boolean;
  helperText?: string;
  type?: "text" | "number";
  containerStyle?: React.CSSProperties;
} & TextFieldProps;

const TextInput = <K extends FieldValues>({
  title,
  helperText,
  error,
  containerStyle = {
    margin: "1em"
  },
  ...inputProps
}: TextInputProps<K>) => {
  return (
    <FormControl component="div" style={containerStyle}>
      <TextField
        label={title}
        error={error}
        helperText={helperText}
        fullWidth
        {...inputProps}
      />
    </FormControl>
  );
};

export default TextInput;
