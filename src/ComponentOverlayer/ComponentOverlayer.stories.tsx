import React from "react";
import ComponentOverlayer, {
  ComponentOverlayerProps
} from "./ComponentOverlayer";
import { Meta, Story } from "@storybook/react/types-6-0";
import { action } from "@storybook/addon-actions";

export default {
  title: "ComponentOverlayer",
  component: ComponentOverlayer,
  argTypes: {
    componentToDisplay: { control: "none" }
  }
} as Meta;

const Template: Story<ComponentOverlayerProps> = args => {
  return (
    <ComponentOverlayer {...args}>
      <div style={{ height: 200, width: 200, backgroundColor: "blue" }} />
    </ComponentOverlayer>
  );
};

export const Default = Template.bind({});
Default.args = {
  componentToDisplay: (
    <div style={{ width: "200px", height: "200px", backgroundColor: "red" }} />
  )
};
