import React from "react";
import { FormControl, TextField, TextFieldProps } from "@material-ui/core";
import { UnpackNestedValue, DeepPartial } from "react-hook-form";

type TextInputProps<
  K extends Record<string, any>,
  T = UnpackNestedValue<DeepPartial<K>>
> = {
  title?: string;
  inputRef?: (ref: any) => void;
  name?: keyof T;
  error?: boolean;
  helperText?: string;
  type?: "text" | "number";
} & TextFieldProps;

const TextInput = <K extends Record<string, any>>({
  title,
  helperText,
  error,
  ...inputProps
}: TextInputProps<K>) => {
  return (
    <FormControl style={{ width: "100%" }} component="div">
      <TextField
        label={title}
        error={error}
        helperText={helperText}
        {...inputProps}
      />
    </FormControl>
  );
};

export default TextInput;
