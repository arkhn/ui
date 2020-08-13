import React from "react";
import VirtualizedCarousel, {
  VirtualizedCarouselProps,
} from "./VirtualizedCarousel";
import { Meta, Story } from "@storybook/react/types-6-0";

export default {
  title: "VirtualizedCarousel",
  component: VirtualizedCarousel,
  decorators: [
    (storyFn: () => JSX.Element) => (
      <div style={{ height: "500px", width: "500px" }}>{storyFn()}</div>
    ),
  ],
  argTypes: {
    numberOfDocuments: {
      control: { type: "range", min: 1, max: 10000, step: 1 },
    },
  },
} as Meta;

const sourceList = [
  { source: require("./images/doc1.jpg") },
  { source: require("./images/doc2.jpg") },
  { source: require("./images/doc3.jpg") },
  { source: require("./images/doc4.jpg") },
];

const getDocuments = (numberOfDocuments: number) => {
  const documents = [];

  for (let i = 0; i < numberOfDocuments; i++) {
    documents.push(sourceList[Math.round(Math.random() * 100) % 4]);
  }
  return documents;
};

const Template: Story<VirtualizedCarouselProps & {
  numberOfDocuments: number;
}> = ({ numberOfDocuments, ...args }) => {
  const documents = getDocuments(numberOfDocuments);
  return <VirtualizedCarousel documents={documents} />;
};

export const Default = Template.bind({});

Default.args = {
  numberOfDocuments: 4000,
};
