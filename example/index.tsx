import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BubbleChart } from '../.';
import { Sample, Sample2 } from '../stories/BubbleChart.stories';

const App = () => {
  const transitionDelay = 3000;
  const [args, setArgs] = React.useState(Sample.args);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setArgs(Sample2.args);
    }, transitionDelay);
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
