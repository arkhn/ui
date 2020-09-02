import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import each from "jest-each";

/* Component to test */
import HighlightedTextcard, {
  HighlightedTextcardProps
} from "./HighlightedTextcard";

Enzyme.configure({ adapter: new Adapter() });

const props: HighlightedTextcardProps = {
  data: [
    {
      key: "test",
      positions: [
        { key: { start: 0, stop: 5 }, value: { start: 6, stop: 55 } },
        { key: { start: 57, stop: 200 }, value: { start: 252, stop: 500 } }
      ]
    },
    {
      key: "test2",
      positions: [
        {
          key: { start: 2200, stop: 2250 },
          value: { start: 2500, stop: 3000 }
        }
      ]
    },
    {
      key: "test3",
      positions: [{ value: { start: 1100, stop: 2000 } }]
    }
  ],
  keyToShow: ["test", "test2", "test3"],
  content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut non libero commodo, lobortis quam et, elementum risus. Nullam tempus viverra tortor, hendrerit sodales sem dapibus eu. Duis nec placerat purus. Etiam varius aliquet efficitur. Duis scelerisque mattis ullamcorper. Quisque mollis magna in varius dictum. Sed accumsan, tortor luctus molestie fermentum, sapien dolor condimentum turpis, eget volutpat nibh elit aliquet massa. Nullam tempor massa metus. Proin ultrices tortor orci. Nunc accumsan viverra risus. Suspendisse consequat magna ac vehicula vestibulum.

Ut luctus risus a neque vehicula varius. Morbi felis metus, molestie et sodales in, luctus nec metus. Quisque ut consectetur mi. Nulla cursus lectus dolor, eu posuere felis vehicula vel. Nunc ac venenatis libero. Curabitur lobortis mollis nibh sed porttitor. Aliquam erat volutpat. Aenean dapibus felis at ligula pulvinar posuere. Suspendisse purus eros, blandit id quam sed, vestibulum vulputate arcu. Quisque mattis a urna auctor aliquet. Nullam egestas purus augue, sit amet fermentum eros scelerisque aliquam. Curabitur sollicitudin dui suscipit risus gravida finibus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris enim justo, aliquam vel facilisis at, eleifend vitae arcu.

Aliquam at neque venenatis, tempor turpis nec, posuere leo. In efficitur enim in venenatis tempus. Nam nec malesuada dolor. Etiam finibus, ex vel sodales fermentum, sem massa laoreet orci, non scelerisque enim orci interdum turpis. Praesent et euismod tortor. Donec pulvinar lorem dui, ac auctor turpis varius sit amet. Sed eu eros ipsum. Aenean et elit volutpat nulla pretium fringilla ut eu turpis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer vulputate, turpis in bibendum pretium, eros nisi tristique urna, sit amet gravida augue massa sed nulla. In magna mauris, maximus vel lectus ac, bibendum fringilla eros. Pellentesque erat felis, ornare at laoreet eget, ornare eu elit.

Etiam condimentum dui sed sem tincidunt, non accumsan urna convallis. Vivamus dapibus nulla a tempus scelerisque. Nam in ligula sit amet diam pellentesque facilisis a at lorem. Phasellus id sagittis enim. Pellentesque ligula odio, ornare id suscipit vel, semper tempus diam. Quisque ex est, vulputate non sagittis id, consectetur ut elit. Praesent eu nulla vitae lorem varius imperdiet vel at nibh. Aenean fringilla, eros et tincidunt vestibulum, purus urna euismod turpis, ac pellentesque odio orci aliquam dolor. Etiam ultrices tempus tincidunt. Sed id aliquam ligula. Proin pharetra, lacus vel efficitur posuere, odio odio facilisis eros, ultricies rhoncus justo urna in mi. Donec ultrices, sapien vel condimentum luctus, libero nulla iaculis nulla, molestie efficitur leo diam eu massa. Ut lacinia ac lectus eget posuere. Duis lorem erat, iaculis in nunc non, volutpat sodales arcu.`
};

const props2: HighlightedTextcardProps = {
  ...props,
  data: []
};

const props3: HighlightedTextcardProps = {
  ...props,
  data: [
    {
      key: "test",
      positions: []
    }
  ]
};

describe("HighlightedTextcard", () => {
  each([props, props2, props3]).test(
    "testing HighlightedTextWithProps",
    (props: HighlightedTextcardProps) => {
      let positionList: number[] = [0, props.content.length];
      props.data.forEach(d => {
        d.positions.forEach(pos => {
          if (pos.key) {
            positionList.push(pos.key.start);
            positionList.push(pos.key.stop);
          }
          if (pos.value) {
            positionList.push(pos.value.start);
            positionList.push(pos.value.stop);
          }
        });
      });

      const wrapper = shallow(<HighlightedTextcard {...props} />);

      const spanElement = wrapper.find("pre").find("span");

      expect(spanElement).toHaveLength(positionList.length - 1);

      let text = "";
      spanElement.forEach(sp => {
        text += sp.text();
      });
      expect(text).toEqual(props.content);
    }
  );
});
