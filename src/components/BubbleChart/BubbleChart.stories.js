import React from 'react';

import BubbleChart from './BubbleChart';

export default {
  title: 'Example/BubbleChart',
  component: BubbleChart,
  argTypes: {
    data: { control: 'object' },
    xTicks: { control: 'number' },
    dateParam: { control: 'text' },
    yParam: { control: 'text' },
    colorParam: { control: 'text' },
    sizeParam: { control: 'text' },
  },
};

const Template = (args) => <BubbleChart {...args} />;

export const Sample = Template.bind({});
Sample.args = {
  data: [{
    "duration.start": "2020-01-01",
    "indicator": "Dengue",
    "value": 100,
    "entity.state": "Kerala"
  },{
    "duration.start": "2020-01-04",
    "indicator": "Dengue",
    "value": 400,
    "entity.state": "Maharashtra"
  },{
    "duration.start": "2020-01-24",
    "indicator": "Dengue",
    "value": 300,
    "entity.state": "Maharashtra"
  },{
    "duration.start": "2020-02-04",
    "indicator": "Dengue",
    "value": 10,
    "entity.state": "Maharashtra"
  },{
    "duration.start": "2020-05-04",
    "indicator": "Dengue",
    "value": 10,
    "entity.state": "Maharashtra"
  },{
    "duration.start": "2020-03-04",
    "indicator": "Dengue",
    "value": 5,
    "entity.state": "Karnataka"
  }],
  xTicks: 5,
  yParam: "entity.state",
  colorParam: "indicator",
  sizeParam: "value",
};
