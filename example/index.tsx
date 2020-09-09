import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BubbleChart } from '../.';
import { Sample2, Sample3 } from '../stories/BubbleChart.stories';

const App = () => {
  const transitionDelay = 3000;
  const [args, setArgs] = React.useState(Sample2.args);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setArgs(Sample3.args);
    }, transitionDelay);
    return () => clearTimeout(timer);
  }, []);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setArgs(Sample2.args);
    }, transitionDelay * 2);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div>
      <p>Wait for {transitionDelay} ms to see data change</p>
      <BubbleChart {...args} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
