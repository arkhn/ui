import React from "react";
import {
  Slider,
  FormControl,
  FormLabel,
  FormHelperText
} from "@material-ui/core";

type SliderProps<T extends number | [number, number]> = {
  value: T;
  onChange: (value: T) => void;
  //   containerStyle?: React.CSSProperties;
  title?: string;
  max?: number;
  min?: number;
  error?: boolean;
  helperText?: string;
  defaultValue?: T;
  valueLabelDisplay?: "on" | "off" | "auto";
  containerStyle?: React.CSSProperties;
  disabled?: boolean;
  valueLabelFormat?:
    | string
    | ((value: number, index: number) => React.ReactNode);
};

const SliderInput = <T extends number | [number, number]>({
  value,
  onChange,
  title,
  max,
  min,
  error,
  helperText,
  defaultValue,
  valueLabelDisplay,
  valueLabelFormat,
  disabled,
  containerStyle = {
    margin: "1em"
  }
}: SliderProps<T>) => {
  const _onChange = (
    event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => {
    onChange(value as T);
  };
  const _getAriaLabel = (index: number) => `${name} ${index}`;
  return (
    <FormControl style={containerStyle}>
      <FormLabel error={error}>{title}</FormLabel>
      <Slider
        value={value}
        onChange={_onChange}
        valueLabelDisplay={valueLabelDisplay}
        valueLabelFormat={valueLabelFormat}
        disabled={disabled}
        max={max}
        min={min}
        getAriaLabel={_getAriaLabel}
        defaultValue={
          undefined !== defaultValue
            ? defaultValue
            : Array.isArray(value)
            ? [0, 0]
            : 0
        }
      />
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default SliderInput;
