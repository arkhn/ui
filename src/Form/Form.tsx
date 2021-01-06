import React, { useEffect, PropsWithChildren } from "react";
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
import { Button, Typography } from "@material-ui/core";
import SelectInput from "./FormInputs/SelectInput";
import DateInput from "./FormInputs/DateInput";
import { FormInputProperty } from "./InputTypes";
import AutocompleteInput from "./FormInputs/AutocompleteInput";
import SliderInput from "./FormInputs/SliderInput";
import RadioInput from "./FormInputs/RadioInput";
import SwitchInput from "./FormInputs/SwitchInput";

export interface FormProps<T extends FieldValues = FieldValues> {
  /**
   * Called when submitted and validation rules are valid
   */
  submit: (data: T) => void;
  /**
   * Form title. If a formHeader is supplied, 'title' won't be used.
   */
  title?: string;
  /**
   * Default values for the form submitted data.
   */
  defaultValues?: UnpackNestedValue<DeepPartial<T>>;
  /**
   * Array of properties describing the form inputs.
   */
  properties: FormInputProperty<T>[] | ((data: T) => FormInputProperty<T>[]);
  /**
   * Form header. It replaces 'title' when supplied.
   */
  formHeader?: React.ReactNode;
  /**
   * Form footer to be displayed instead of default submit button.
   *
   * This component has to render a 'button' HTML tag with 'type' attribute value set to "submit"
   */
  formFooter?: React.ReactNode;
  /**
   * Style applied to 'form' HTML tag element.
   * 
   * Default value :
      {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        height: "100%"
      }
   */
  formStyle?: React.CSSProperties;
  /**
   * Style applied to the 'form' sub div element, containing the form title and its content.
   * 
   * Default value :
      {
        flex: 1,
        overflow: "auto"
      }
   */
  formContentContainerStyle?: React.CSSProperties;
  /**
   * Facultative attribute 'id' of the 'form' HTML tag.
   */
  formId?: string;
  /**
   * True to remove default submit button.
   */
  displaySubmitButton?: boolean;
}

const Form = <T extends FieldValues = FieldValues>({
  defaultValues,
  title,
  properties,
  submit,
  formHeader,
  formFooter,
  formId,
  displaySubmitButton,
  formContentContainerStyle = {
    flex: 1,
    overflow: "auto"
  },
  formStyle = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    height: "100%"
  }
}: PropsWithChildren<FormProps<T>>) => {
  const { handleSubmit, register, errors, control, setValue, watch } = useForm<
    T
  >({
    defaultValues
  });
  const _properties =
    typeof properties === "function" ? properties(watch()) : properties;

  useEffect(() => {
    const autocompleteProperties = _properties.filter(
      property => property.type === "autocomplete"
    );

    if (autocompleteProperties.length > 0) {
      autocompleteProperties.forEach(property => {
        property.type !== "section" &&
          register(property.name as FieldName<T>, property.validationRules);
      });
    }
  }, [register, _properties]);

  return (
    <form
      onSubmit={handleSubmit(submit)}
      style={formStyle}
      id={formId}
      noValidate
    >
      <div style={formContentContainerStyle}>
        {formHeader}
        <FormSection<T, typeof register, typeof setValue>
          control={control}
          defaultValues={defaultValues}
          errors={errors}
          properties={_properties}
          register={register}
          setValue={setValue}
          title={!formHeader ? title : undefined}
        />
      </div>
      {displaySubmitButton ? <Button type="submit">Submit</Button> : formFooter}
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
  containerStyle?: React.CSSProperties;
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
  containerStyle = {
    padding: "1em",
    display: "flex",
    flex: 1,
    flexDirection: "column"
  }
}: RenderSectionProps<T, R, S>) => {
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
    <div style={containerStyle}>
      {title && <Typography variant={"h6"}>{title}</Typography>}
      {properties.map(property => {
        let input: React.ReactNode = null;
        switch (property.type) {
          case "number":
          case "text": {
            input = (
              <TextInput
                title={property.label}
                name={property.name}
                containerStyle={property.containerStyle}
                inputRef={register(property.validationRules)}
                placeholder={property.placeholder}
                error={undefined !== errors[property.name]}
                variant={property.variant}
                password={property.password}
                type={property.type}
                disabled={property.disabled}
                endAdornment={property.endAdornment}
                helperText={
                  //@ts-ignore
                  errors[property.name] && errors[property.name].message
                }
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
                render={({ onChange, value, ref, name }) => (
                  <SelectInput
                    containerStyle={property.containerStyle}
                    disabled={property.disabled}
                    title={property.label}
                    inputRef={ref}
                    name={name}
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
                    disabled={property.disabled}
                    ref={ref}
                    label={property.label}
                    containerStyle={property.containerStyle}
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
                variant={property.variant}
                defaultValue={defaultValues?.[property.name]}
                disabled={property.disabled}
                onChange={value =>
                  setValue(property.name as FieldName<T>, value, {
                    shouldValidate: true
                  })
                }
                containerStyle={property.containerStyle}
                name={property.name as FieldName<T>}
                title={property.label}
                error={undefined !== errors[property.name]}
                multiple={property.multiple}
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
                    disabled={property.disabled}
                    onChange={onChange}
                    title={property.label}
                    max={property.max}
                    min={property.min}
                    valueLabelDisplay={property.valueLabelDisplay}
                    defaultValue={property.defaultValue}
                    containerStyle={property.containerStyle}
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

          case "radio": {
            input = (
              <Controller
                name={property.name as FieldName<T>}
                control={control}
                rules={property.validationRules}
                defaultValue={property.defaultValue}
                render={({ onChange, value }) => (
                  <RadioInput
                    containerStyle={property.containerStyle}
                    disabled={property.disabled}
                    title={property.label}
                    value={value}
                    onChange={onChange}
                    error={undefined !== errors[property.name]}
                    helperText={
                      //@ts-ignore
                      errors[property.name] && errors[property.name].message
                    }
                    options={property.radioOptions}
                  />
                )}
              />
            );
            break;
          }

          case "custom": {
            input = (
              <Controller
                control={control}
                name={property.name as FieldName<T>}
                rules={property.validationRules}
                render={property.renderInput}
                defaultValue={defaultValues?.[property.name]}
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
                containerStyle={property.containerStyle}
              />
            );
            break;
          }

          case "switch": {
            input = (
              <Controller
                name={property.name as FieldName<T>}
                control={control}
                rules={property.validationRules}
                defaultValue={property.defaultValue}
                render={({ onChange, value }) => (
                  <SwitchInput
                    containerStyle={property.containerStyle}
                    title={property.label}
                    value={value ?? false}
                    disabled={property.disabled}
                    onChange={onChange}
                    error={undefined !== errors[property.name]}
                    helperText={
                      //@ts-ignore
                      errors[property.name] && errors[property.name].message
                    }
                    falseLabel={property.falseLabel}
                    trueLabel={property.trueLabel}
                  />
                )}
              />
            );
            break;
          }

          default:
            break;
        }

        return <React.Fragment key={property.name}>{input}</React.Fragment>;
      })}
    </div>
  );
};

export default Form;
