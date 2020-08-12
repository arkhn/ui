## Description

This library offers generic ReactJs components built with Typescript.

It has been designed for internal use and some of them may come with prop names corresponding to medical lexical fields.

## Get Started

### Installation

```
# With npm
$ npm install @arkhn/ui

# With yarn
$ yarn add @arkhn/ui
```

### Usage Example

```js
import { VirtualizedCarousel } from "@arkhn/ui";

const documents = [
  { source: "/images/doc1.jpg" },
  { source: "/images/doc2.jpg" },
  { source: "/images/doc3.jpg" },
  { source: "/images/doc4.jpg" },
];

<div
  style={{
    height: "300px",
    width: "300px",
  }}
>
  <VirtualizedCarousel documents={documents} />
</div>;
```

## Components List

| Component           | Description                                                                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| VirtualizedCarousel | Carousel component virtualizing its rendering using "react-virtualized" library. It takes up to 20.000 documents as props.                                        |
| SelectableTable     | Component using "@material-ui/core" to display a table with dynamic header. It allows single row selection and also multiple row selection with checkbox support. |
| EditInput           | A component based on the "@material-ui/core" Input component. It comes with an input adornment allowing value changes whenever clicked on.                        |