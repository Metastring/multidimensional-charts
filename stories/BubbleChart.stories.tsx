import React from 'react';

import { Meta, Story } from '@storybook/react/types-6-0';

import { BubbleChart } from '../';
import { BubbleChartProps } from '../dist/BubbleChart';

export default {
  title: 'Example/BubbleChart',
  component: BubbleChart,
  argTypes: {
    data: { control: 'object' },
    dateParam: { control: 'text' },
    yParam: { control: 'text' },
    colorParam: { control: 'text' },
    sizeParam: { control: 'text' },
  },
} as Meta;

const Template: Story<BubbleChartProps> = args => <BubbleChart {...args} />;

export const Sample = Template.bind({});
Sample.args = {
  data: [
    {
      'duration.start': '2020-01-01',
      indicator: 'Dengue',
      value: '100',
      'entity.state': 'Kerala',
    },
    {
      'duration.start': '2020-01-04',
      indicator: 'Dengue',
      value: '400',
      'entity.state': 'Maharashtra',
    },
    {
      'duration.start': '2020-01-24',
      indicator: 'Dengue',
      value: '300',
      'entity.state': 'Maharashtra',
    },
    {
      'duration.start': '2020-02-04',
      indicator: 'Dengue',
      value: '10',
      'entity.state': 'Maharashtra',
    },
    {
      'duration.start': '2020-05-04',
      indicator: 'Dengue',
      value: '10',
      'entity.state': 'Maharashtra',
    },
    {
      'duration.start': '2020-03-04',
      indicator: 'Dengue',
      value: '5',
      'entity.state': 'Karnataka',
    },
  ],
  dateParam: 'duration.start',
  yParam: 'entity.state',
  colorParam: 'indicator',
  sizeParam: 'value',
};

export const Sample2 = Template.bind({});
Sample2.args = {
  data: [
    {
      'duration.start': '2020-05-01',
      indicator: 'Dengue',
      value: '400',
      'entity.state': 'Kerala',
    },
    {
      'duration.start': '2020-02-04',
      indicator: 'Dengue',
      value: '100',
      'entity.state': 'Maharashtra',
    },
    {
      'duration.start': '2020-09-24',
      indicator: 'Dengue',
      value: '1',
      'entity.state': 'Maharashtra',
    },
    {
      'duration.start': '2020-05-04',
      indicator: 'Dengue',
      value: '50',
      'entity.state': 'Maharashtra',
    },
    {
      'duration.start': '2020-03-04',
      indicator: 'Dengue',
      value: '70',
      'entity.state': 'Maharashtra',
    },
    {
      'duration.start': '2020-01-04',
      indicator: 'Dengue',
      value: '500',
      'entity.state': 'Karnataka',
    },
  ],
  dateParam: 'duration.start',
  yParam: 'entity.state',
  colorParam: 'indicator',
  sizeParam: 'value',
};
