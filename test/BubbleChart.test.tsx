import React from 'react';
import * as ReactDOM from 'react-dom';
import { Sample } from '../stories/BubbleChart.stories';
import { BubbleChartProps } from '../dist/BubbleChart';

describe('BubbleChart', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Sample {...(Sample.args as BubbleChartProps)} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
