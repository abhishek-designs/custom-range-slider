import { useState } from "react";
import RangeSlider from "./components/RangeSlider";
import "./App.css";

function App() {
  const [rangeValue, setValue] = useState<number>(0);

  return (
    <div className="App">
      <RangeSlider
        minRange={670}
        maxRange={899}
        onSliderChange={(value: number) => setValue(value)}
        showRange
        sliderColor="blue"
      />
      {[1, 2, 3].map(num => (
        <br key={num} />
      ))}
      <RangeSlider
        minRange={1}
        maxRange={15}
        onSliderChange={(value: number) => setValue(value)}
        showRange
        sliderColor="purple"
      />
      {/* <input
        type="range"
        className="default-range"
        min="45"
        max="60"
        onChange={e => console.log(e.target.value)}
      /> */}
    </div>
  );
}

export default App;
