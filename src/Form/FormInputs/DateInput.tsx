import React from "react";
import { FormControl } from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { UnpackNestedValue, DeepPartial } from "react-hook-form";

type DateInputProps<
  K extends Record<string, any>,
  T = UnpackNestedValue<DeepPartial<K>>
> = {
  name: keyof T;
  label?: string;
  inputRef?: (ref: any) => void;
  value?: Date | null;
  onChange: (date: Date | null) => void;
  error?: boolean;
  helperText?: string;
  containerStyle?: React.CSSProperties;
};

const DateInput = <K extends Record<string, any>>({
  name,
  containerStyle,
  value,
  inputRef,
  ...props
}: DateInputProps<K>) => {
  return (
    <FormControl style={containerStyle}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDateTimePicker
          disableFuture
          ref={inputRef}
          fullWidth
          ampm={false}
          variant="inline"
          format="dd/MM/yyyy HH:mm"
          margin="normal"
          id={`${name}-date-picker`}
          KeyboardButtonProps={{
            "aria-label": "change date"
          }}
          value={value ?? null}
          {...props}
        />
      </MuiPickersUtilsProvider>
    </FormControl>
  );
};

export default DateInput;
