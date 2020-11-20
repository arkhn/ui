import React from "react";
import { FormControl } from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
  KeyboardDateTimePickerProps
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { UnpackNestedValue, DeepPartial } from "react-hook-form";

type DateInputProps<
  K extends Record<string, any>,
  T = UnpackNestedValue<DeepPartial<K>>
> = {
  name: keyof T;
  value?: Date | null;
} & KeyboardDateTimePickerProps;

const DateInput = React.forwardRef(
  <K extends Record<string, any>>(
    { name, value, ...props }: DateInputProps<K>,
    ref?: React.Ref<HTMLInputElement>
  ) => {
    return (
      <FormControl style={{ width: "100%" }}>
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
            {...props}
          />
        </MuiPickersUtilsProvider>
      </FormControl>
    );
  }
);

DateInput.displayName = "DateInput";

export default DateInput;
