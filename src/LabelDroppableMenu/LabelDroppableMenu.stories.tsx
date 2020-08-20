import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import LabelDroppableMenu, {
  LabelDroppableMenuProps,
} from "./LabelDroppableMenu";

const Template: Story<LabelDroppableMenuProps> = (props) => {
  const [label, setLabel] = React.useState(props.label);
  React.useEffect(() => {
    setLabel(props.label);
  }, [props.label]);
  return (
    <LabelDroppableMenu {...props} label={label} onLabelEdited={setLabel} />
  );
};

export default {
  title: "LabelDroppableMenu",
  component: LabelDroppableMenu,
} as Meta;

export const Default = Template.bind({});
Default.args = {
  label: "machin",
  numeric: false,
  id: "labelDroppableMenu",
};
