import React from "react";
import {
  Select,
  MenuItem,
  SelectProps,
  FormControl,
  InputLabel,
  FormHelperText
} from "@material-ui/core";
import { FieldValues } from "react-hook-form";
import { OptionType } from "../InputTypes";

type SelectInputProps<K extends FieldValues> = {
  title?: string;
  error?: boolean;
  helperText?: string;
  options: OptionType<K>[];
  onChange: (value: OptionType<K> | OptionType<K>[] | null) => void;
  containerStyle?: React.CSSProperties;
} & SelectProps;

const SelectInput = <K extends FieldValues>({
  title,
  options,
  error,
  helperText,
  multiple,
  onChange,
  containerStyle = {
    margin: "1em"
  },
  ...selectProps
}: SelectInputProps<K>) => {
  const _onChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    if (multiple) {
      const values = event.target.value as string[];
      const selectedOptions = options.filter(opt => values.includes(opt.id));
      onChange(selectedOptions);
    } else {
      const value = event.target.value as string;
      const option = options.find(opt => opt.id === value);
      onChange(option ?? null);
    }
  };

  return (
    <FormControl style={containerStyle}>
      <InputLabel id={selectProps.name} error={error}>
        {title}
      </InputLabel>
      <Select
        {...selectProps}
        labelId={selectProps.name}
        multiple={multiple}
        error={error}
        fullWidth
        onChange={_onChange}
      >
        {options.map(option => (
          <MenuItem key={option.id} value={option.id}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default SelectInput;
