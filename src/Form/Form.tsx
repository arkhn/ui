import React, { useEffect } from "react";
import {
  useForm,
  Controller,
  UnpackNestedValue,
  DeepPartial,
  FieldName,
  FieldValues,
  Control,
  DeepMap,
  FieldError
} from "react-hook-form";
import TextInput from "./FormInputs/TextInput";
import { Grid, Button, Typography } from "@material-ui/core";
import SelectInput from "./FormInputs/SelectInput";
import DateInput from "./FormInputs/DateInput";
import { FormInputProperty } from "./InputTypes";
import AutocompleteInput from "./FormInputs/AutocompleteInput";
import SliderInput from "./FormInputs/SliderInput";

export type FormProps<T extends FieldValues> = {
  submit: (data: T) => void;
  title?: string;
  defaultValues?: UnpackNestedValue<DeepPartial<T>>;
  properties: FormInputProperty<T>[];
  formHeader?: JSX.Element;
  formFooter?: JSX.Element;
};

const Form = <T extends FieldValues = FieldValues>({
  defaultValues,
  title,
  properties,
  submit,
  formHeader,
  formFooter
}: FormProps<T>) => {
  const { handleSubmit, register, errors, control, setValue } = useForm<T>({
    defaultValues
  });

  useEffect(() => {
    const autocompleteProperties = properties.filter(
      property => property.type === "autocomplete"
    );

    if (autocompleteProperties.length > 0) {
      autocompleteProperties.forEach(property => {
        property.type !== "section" &&
          register(property.name as FieldName<T>, property.validationRules);
      });
    }
  }, [register, properties]);

  return (
    <form
      onSubmit={handleSubmit(submit)}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Grid container spacing={2} direction="column">
        {formHeader ? <Grid item>{formHeader}</Grid> : null}
        <Grid item>
          <FormSection<T, typeof register, typeof setValue>
            control={control}
            defaultValues={defaultValues}
            errors={errors}
            properties={properties}
            register={register}
            setValue={setValue}
            title={!formHeader ? title : undefined}
          />
        </Grid>
        {formFooter ? (
          <Grid item>{formFooter}</Grid>
        ) : (
          <Grid item>
            <Button type="submit">Submit</Button>
          </Grid>
        )}
      </Grid>
    </form>
  );
};

type RenderSectionProps<T extends FieldValues, R, S> = {
  properties: FormInputProperty<T>[];
  register: R;
  errors: DeepMap<T, FieldError>;
  control: Control<T>;
  setValue: S;
  defaultValues?: UnpackNestedValue<DeepPartial<T>>;
  gridContainerProps?: React.ComponentProps<typeof Grid>;
  title?: string;
};
const FormSection = <
  T extends FieldValues,
  R extends (...props: any) => any,
  S extends (...props: any) => any
>({
  properties,
  register,
  errors,
  control,
  defaultValues,
  setValue,
  title,
  gridContainerProps
}: RenderSectionProps<T, R, S>) => {
  return (
    <Grid
      container
      spacing={2}
      direction="column"
      {...gridContainerProps}
      style={{ width: "100%", ...gridContainerProps?.style }}
    >
      {title && (
        <Grid item style={{ width: "100%" }}>
          <Typography variant={"h5"}>{title}</Typography>
        </Grid>
      )}
      {properties.map(property => {
        let input: JSX.Element | null = null;
        switch (property.type) {
          case "number":
          case "text": {
            input = (
              <TextInput
                title={property.label}
                name={property.name}
                // containerStyle={property.containerStyle}
                inputRef={register(property.validationRules)}
                placeholder={property.placeholder}
                error={undefined !== errors[property.name]}
                variant={property.variant}
                helperText={
                  //@ts-ignore
                  errors[property.name] && errors[property.name].message
                }
                type={property.type}
              />
            );
            break;
          }

          case "multiSelect":
          case "select": {
            input = (
              <Controller
                name={property.name as FieldName<T>}
                control={control}
                rules={property.validationRules}
                defaultValue={property.defaultValue}
                render={({ onChange, value, ref }) => (
                  <SelectInput
                    // containerStyle={property.containerStyle}
                    title={property.label}
                    inputRef={ref}
                    variant={property.variant}
                    value={
                      property.type === "multiSelect"
                        ? Array.isArray(value)
                          ? value.map(val => val.id)
                          : []
                        : value?.id ?? ""
                    }
                    onChange={onChange}
                    multiple={property.type === "multiSelect"}
                    error={undefined !== errors[property.name]}
                    helperText={
                      //@ts-ignore
                      errors[property.name] && errors[property.name].message
                    }
                    options={property.selectOptions}
                  />
                )}
              />
            );
            break;
          }

          case "date": {
            input = (
              <Controller
                name={property.name as FieldName<T>}
                control={control}
                rules={property.validationRules}
                render={({ ref, ...props }) => (
                  <DateInput
                    {...props}
                    ref={ref}
                    label={property.label}
                    // containerStyle={property.containerStyle}
                    error={undefined !== errors[property.name]}
                    helperText={
                      //@ts-ignore
                      errors[property.name] && errors[property.name].message
                    }
                    inputVariant={property.variant}
                  />
                )}
              />
            );
            break;
          }

          case "autocomplete": {
            input = (
              <AutocompleteInput<T>
                //@ts-ignore
                options={property.autocompleteOptions}
                //@ts-ignore
                getSelectOptions={property.getAutocompleteOptions}
                defaultValue={defaultValues?.[property.name]}
                onChange={value =>
                  setValue(property.name as FieldName<T>, value, {
                    shouldValidate: true
                  })
                }
                // containerStyle={property.containerStyle}
                name={property.name as FieldName<T>}
                title={property.label}
                error={undefined !== errors[property.name]}
                helperText={
                  //@ts-ignore
                  errors[property.name] && errors[property.name].message
                }
              />
            );
            break;
          }

          case "slider": {
            input = (
              <Controller
                control={control}
                name={property.name as FieldName<T>}
                rules={property.validationRules}
                render={({ value, onChange }) => (
                  <SliderInput
                    value={value}
                    onChange={onChange}
                    title={property.label}
                    max={property.max}
                    min={property.min}
                    valueLabelDisplay={property.valueLabelDisplay}
                    defaultValue={property.defaultValue}
                    // containerStyle={property.containerStyle}
                    error={undefined !== errors[property.name]}
                    helperText={
                      //@ts-ignore
                      errors[property.name] && errors[property.name].message
                    }
                  />
                )}
              />
            );
            break;
          }

          case "section": {
            input = (
              <FormSection<T, typeof register, typeof setValue>
                control={control}
                defaultValues={defaultValues}
                errors={errors}
                properties={property.properties}
                register={register}
                setValue={setValue}
                title={property.title}
                gridContainerProps={property.gridContainerProps}
              />
            );
            break;
          }

          default:
            break;
        }

        return property.type === "section" ? (
          <Grid item key={property.name} style={{ width: "100%" }}>
            {input}
          </Grid>
        ) : (
          <Grid
            item
            key={property.name}
            {...property.gridContainerProps}
            style={{ width: "100%", ...property.gridContainerProps?.style }}
          >
            {input}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Form;
