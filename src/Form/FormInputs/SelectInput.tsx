import React, { useRef, useEffect, useState } from "react";
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
  options: OptionType[];
  onChange: (value: OptionType | OptionType[] | null) => void;
  containerStyle?: React.CSSProperties;
  noneValueId?: string;
} & SelectProps;

const SelectInput = <K extends FieldValues>({
  title,
  options,
  error,
  helperText,
  multiple,
  onChange,
  noneValueId,
  variant,
  containerStyle = {
    margin: "1em"
  },
  ...selectProps
}: SelectInputProps<K>) => {
  const labelRef = useRef<HTMLLabelElement | null>(null);
  const [labelWidth, setLabelWidth] = useState(0);

  useEffect(() => {
    labelRef.current && setLabelWidth(labelRef.current.clientWidth);
  }, [labelRef]);

  const _onChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    if (multiple) {
      const values = event.target.value as string[];
      const selectedOptions = options.filter(opt => values.includes(opt.id));

      if (!noneValueId) {
        return onChange(selectedOptions);
      }
      const currentValue = selectProps.value as string[];
      const noneInCurrentValues = currentValue.some(
        value => value === noneValueId
      );
      const noneInNewValues = values.some(value => value === noneValueId);
      if (values.length === 0 || (!noneInCurrentValues && noneInNewValues)) {
        const noneValueOption = options.find(opt => opt.id === noneValueId);
        noneValueOption && onChange([noneValueOption]);
      } else {
        const valueOptions = values
          .map(id => options.find(opt => opt.id === id))
          .filter((opt): opt is OptionType => opt?.id !== noneValueId);
        onChange(valueOptions);
      }
    } else {
      const value = event.target.value as string;
      const option = options.find(opt => opt.id === value);
      onChange(option ?? null);
    }
  };

  return (
    <FormControl style={containerStyle} variant={variant} error={error}>
      <InputLabel ref={labelRef} id={selectProps.name} error={error}>
        {title}
      </InputLabel>
      <Select
        {...selectProps}
        labelId={selectProps.name}
        multiple={multiple}
        error={error}
        labelWidth={labelWidth}
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
