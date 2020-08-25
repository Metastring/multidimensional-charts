import React from 'react';

import { BarChart } from './BarChart';

export default {
  title: 'Example/BarChart',
  component: BarChart,
  argTypes: {
    data: { control: 'array' },
  },
};

const Template = (args) => <BarChart {...args} />;

export const Sample = Template.bind({});
Sample.args = {
  data: [10, 20, 30],
  label: 'BarChart',
};
