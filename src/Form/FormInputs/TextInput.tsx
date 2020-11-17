import React from "react";
import {
  Input,
  InputProps,
  FormControl,
  InputLabel,
  FormHelperText
} from "@material-ui/core";
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
  containerStyle?: React.CSSProperties;
} & InputProps;

const TextInput = <K extends Record<string, any>>({
  title,
  helperText,
  error,
  containerStyle,
  ...inputProps
}: TextInputProps<K>) => {
  return (
    <FormControl style={containerStyle} component="div">
      <InputLabel htmlFor={inputProps.name} error={error}>
        {title}
      </InputLabel>
      <Input id={inputProps.name} error={error} {...inputProps} />
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default TextInput;
