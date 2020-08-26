import React from "react";
import NavBar, { NavBarProps } from "./NavBar";
import { Meta, Story } from "@storybook/react/types-6-0";
import { Typography } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";

export default {
  title: "NavBar",
  component: NavBar,
  argTypes: {
    title: { control: "none" }
  }
} as Meta;

const Template: Story<NavBarProps> = args => <NavBar {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: <Typography color="primary">Default</Typography>
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  title: (
    <>
      <HomeIcon color="primary" style={{ marginRight: 16 }} />
      <Typography color="primary">With Icon</Typography>
    </>
  )
};
