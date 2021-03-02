import React from "react";
import { FormControl } from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
  KeyboardDateTimePickerProps
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { FieldValues } from "react-hook-form";

type DateInputProps<K extends FieldValues> = {
  name: keyof K;
  value?: Date | null;
  containerStyle?: React.CSSProperties;
} & KeyboardDateTimePickerProps;

const DateInput = React.forwardRef(
  <K extends FieldValues>(
    {
      name,
      value,
      containerStyle = {
        margin: "1em"
      },
      ...props
    }: DateInputProps<K>,
    ref?: React.Ref<HTMLInputElement>
  ) => {
    return (
      <FormControl style={containerStyle}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDateTimePicker
            disableFuture
            InputProps={{ inputRef: ref }}
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
            inputProps={{
              "aria-label": name
            }}
            {...props}
          />
        </MuiPickersUtilsProvider>
      </FormControl>
    );
  }
);

DateInput.displayName = "DateInput";

export default DateInput;
