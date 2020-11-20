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
  valueLabelDisplay
}: SliderProps<T>) => {
  const _onChange = (
    event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => {
    onChange(value as T);
  };
  return (
    <FormControl style={{ width: "100%" }}>
      <FormLabel error={error}>{title}</FormLabel>
      <Slider
        value={value}
        onChange={_onChange}
        valueLabelDisplay={valueLabelDisplay}
        max={max}
        min={min}
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
