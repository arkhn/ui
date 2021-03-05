import React, { useRef, useEffect, useState } from "react";
import {
  Select,
  MenuItem,
  SelectProps,
  FormControl,
  InputLabel,
  FormHelperText
} from "@material-ui/core";
import { OptionType } from "../InputTypes";

type SelectInputProps<K extends string> = {
  title?: string;
  error?: boolean;
  helperText?: string;
  options: OptionType<K>[];
  onChange: (value: K | K[] | null) => void;
  containerStyle?: React.CSSProperties;
  noneValueId?: string;
} & SelectProps;

const SelectInput = <OptionId extends string>({
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
}: SelectInputProps<OptionId>) => {
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
      const selectedOptionsIds = options
        .filter(opt => values.includes(opt.id))
        .map(({ id }) => id);

      if (!noneValueId) {
        return onChange(selectedOptionsIds);
      }
      const currentValue = selectProps.value as string[];
      const noneInCurrentValues = currentValue.some(
        value => value === noneValueId
      );
      const noneInNewValues = values.some(value => value === noneValueId);
      if (values.length === 0 || (!noneInCurrentValues && noneInNewValues)) {
        const noneValueOption = options.find(opt => opt.id === noneValueId);
        noneValueOption && onChange([noneValueOption.id]);
      } else {
        onChange(values as OptionId[]);
      }
    } else {
      const value = event.target.value as OptionId;
      onChange(value);
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
        inputProps={{ "aria-label": selectProps.name }}
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
