import React from "react";
import {
  FormControl,
  FormLabel,
  Slider,
  Typography,
  Input
} from "@material-ui/core";

const CohortCustomInput = React.forwardRef(
  (
    {
      onChange,
      value
    }: {
      onChange: (value: [number, number]) => void;
      onBlur: () => void;
      value: [number, number];
      name: string;
      ref: React.MutableRefObject<any>;
    },
    ref
    /**
     * Use ref variable to wire onChange, focus, blur events and so on with react-hook-forms
     */
  ) => {
    const _getThumbToolTip = (value: number) => {
      return value === 100 ? `${value.toString()}+` : value.toString();
    };

    const _handleAgeInputChange = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      isMin: boolean
    ) => {
      const numberValue = parseInt(event.target.value);
      if (isNaN(numberValue)) {
        if (isMin) {
          onChange([0, Math.max(0, value[1])]);
        } else {
          onChange([Math.min(100, value[0]), 100]);
        }
      } else {
        let newAgeMin = 0;
        let newAgeMax = 100;
        if (isMin) {
          newAgeMin =
            numberValue < 0 ? 0 : numberValue > 100 ? 100 : numberValue;
          newAgeMax = Math.max(value[1], newAgeMin);
        } else {
          newAgeMax =
            numberValue > 100 ? 100 : numberValue < 0 ? 0 : numberValue;
          newAgeMin = Math.min(value[0], newAgeMax);
        }
        onChange([newAgeMin, newAgeMax]);
      }
    };

    return (
      <div style={{ margin: "1em" }}>
        <FormLabel>Fourchette d'âge</FormLabel>
        <Slider
          value={value ?? [0, 100]}
          onChange={(event, newValue) => onChange(newValue as [number, number])}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          valueLabelFormat={_getThumbToolTip}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Typography>De</Typography>
          <Input
            style={{
              border: "1px solid #D7DAE3",
              borderRadius: "5px",
              padding: "0.5em"
            }}
            type="number"
            onChange={event => {
              _handleAgeInputChange(event, true);
            }}
            value={value?.[0] ?? 0}
          />
          <Typography>à</Typography>
          <Input
            style={{
              border: "1px solid #D7DAE3",
              borderRadius: "5px",
              padding: "0.5em"
            }}
            type="number"
            onChange={event => {
              _handleAgeInputChange(event, false);
            }}
            value={value?.[1] ?? 100}
          />
        </div>
      </div>
    );
  }
);

CohortCustomInput.displayName = "CohortCustomInput";

export default CohortCustomInput;
