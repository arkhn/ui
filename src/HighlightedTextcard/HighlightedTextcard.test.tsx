import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

/* Component to test */
import HighlightedTextcard, {
  HighlightedTextcardProps,
} from "./HighlightedTextcard";
import { TableRow, TableCell, Button } from "@material-ui/core";

Enzyme.configure({ adapter: new Adapter() });

const props: HighlightedTextcardProps = {
  content: "text",
  position: [{ key: { start: 0, stop: 2 }, value: { start: 5, stop: 12 } }],
};

describe("HighlightedTextcard", () => {
  it("Should render", () => {
    const wrapper = shallow(<HighlightedTextcard {...props} />);
  });
});
