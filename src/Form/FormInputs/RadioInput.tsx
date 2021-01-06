import React from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText
} from "@material-ui/core";
import { FieldValues } from "react-hook-form";
import { OptionType } from "../InputTypes";

type RadioInputProps<K extends FieldValues> = {
  title?: string;
  error?: boolean;
  helperText?: string;
  options: OptionType<K>[];
  onChange: (value: OptionType<K> | null) => void;
  containerStyle?: React.CSSProperties;
  name?: keyof K;
  value: OptionType<K> | null;
  disabled?: boolean;
};

const RadioInput = <K extends FieldValues>({
  onChange,
  containerStyle = {
    margin: "1em"
  },
  error,
  title,
  options,
  helperText,
  name,
  value,
  disabled
}: RadioInputProps<K>) => {
  const _onChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    const option = options.find(opt => opt.id === value);
    onChange(option ?? null);
  };

  return (
    <FormControl style={containerStyle}>
      <FormLabel error={error} component="legend">
        {title}
      </FormLabel>
      <RadioGroup
        name={name}
        value={value ? value.id : null}
        onChange={_onChange}
      >
        {options.map(option => (
          <FormControlLabel
            key={option.id}
            value={option.id}
            disabled={disabled}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default RadioInput;
